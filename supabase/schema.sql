create extension if not exists pgcrypto;

create type public.account_role as enum ('customer', 'owner');
create type public.order_status as enum (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.account_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('Running', 'Basketball', 'Lifestyle', 'Trail')),
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image_path text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_name text not null,
  hue smallint not null default 0 check (hue between 0 and 360),
  image_path text not null,
  created_at timestamptz not null default now(),
  unique (product_id, color_name)
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  size numeric(3, 1) not null check (size between 1 and 20),
  stock integer not null default 0 check (stock >= 0),
  updated_at timestamptz not null default now(),
  unique (variant_id, size)
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  label text not null default 'Shipping',
  recipient_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text,
  postal_code text not null,
  country text not null default 'Philippines',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index customer_addresses_one_default
  on public.customer_addresses(user_id) where is_default;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id),
  status public.order_status not null default 'pending',
  customer_name text not null,
  customer_email text not null,
  shipping_address jsonb not null,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_created_at on public.orders(user_id, created_at desc);
create index orders_status_created_at on public.orders(status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  inventory_id uuid references public.inventory(id) on delete set null,
  product_name text not null,
  variant_name text not null,
  size numeric(3, 1) not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  image_path text not null,
  created_at timestamptz not null default now()
);

create index order_items_order_id on public.order_items(order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  changed_by uuid references public.user_profiles(id) on delete set null,
  old_status public.order_status,
  new_status public.order_status not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.wishlists (
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = (select auth.uid())
      and role = 'owner'
  );
$$;

create or replace function public.create_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger auth_user_profile_created
  after insert on auth.users
  for each row execute function public.create_user_profile();

create or replace function public.record_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status = 'cancelled' and new.status <> 'cancelled' then
    raise exception 'Cancelled orders cannot be reopened.';
  end if;

  if new.status = 'cancelled' and old.status <> 'cancelled' then
    update public.inventory i
    set stock = i.stock + item_totals.quantity, updated_at = now()
    from (
      select inventory_id, sum(quantity)::integer as quantity
      from public.order_items
      where order_id = new.id and inventory_id is not null
      group by inventory_id
    ) item_totals
    where item_totals.inventory_id = i.id;
  end if;

  if new.status is distinct from old.status then
    insert into public.order_status_history (
      order_id, changed_by, old_status, new_status
    )
    values (new.id, auth.uid(), old.status, new.status);
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger order_status_changed
  before update on public.orders
  for each row execute function public.record_order_status_change();

create or replace function public.place_order(
  p_items jsonb,
  p_shipping_address jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile public.user_profiles%rowtype;
  v_item jsonb;
  v_inventory public.inventory%rowtype;
  v_variant public.product_variants%rowtype;
  v_product public.products%rowtype;
  v_order_id uuid;
  v_quantity integer;
  v_subtotal numeric(10, 2) := 0;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to place an order.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'An order must contain between 1 and 50 items.';
  end if;

  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then
    raise exception 'An order must contain between 1 and 50 items.';
  end if;

  if p_shipping_address is null
     or jsonb_typeof(p_shipping_address) <> 'object'
     or nullif(trim(p_shipping_address ->> 'recipient_name'), '') is null
     or nullif(trim(p_shipping_address ->> 'phone'), '') is null
     or nullif(trim(p_shipping_address ->> 'address_line1'), '') is null
     or nullif(trim(p_shipping_address ->> 'city'), '') is null
     or nullif(trim(p_shipping_address ->> 'postal_code'), '') is null then
    raise exception 'A complete shipping address is required.';
  end if;

  select * into v_profile
  from public.user_profiles
  where id = v_user_id;

  if not found then
    raise exception 'Your customer profile is not ready yet.';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if (v_item ->> 'inventory_id') is null
       or not coalesce((v_item ->> 'quantity') ~ '^[1-9][0-9]*$', false) then
      raise exception 'Invalid product or quantity in the order.';
    end if;

    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity > 99 then
      raise exception 'An item quantity cannot exceed 99.';
    end if;

    select i.* into v_inventory
    from public.inventory i
    join public.product_variants pv on pv.id = i.variant_id
    join public.products p on p.id = pv.product_id
    where i.id = (v_item ->> 'inventory_id')::uuid
      and p.is_published
    for update of i;

    if not found or v_inventory.stock < v_quantity then
      raise exception 'One or more selected sizes are out of stock.';
    end if;

    select * into v_variant
    from public.product_variants
    where id = v_inventory.variant_id;

    select * into v_product
    from public.products
    where id = v_variant.product_id
    for share;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  insert into public.orders (
    user_id, customer_name, customer_email, shipping_address, subtotal, total
  )
  values (
    v_user_id,
    coalesce(nullif(v_profile.full_name, ''), p_shipping_address ->> 'recipient_name'),
    coalesce((select auth.jwt() ->> 'email'), ''),
    p_shipping_address,
    v_subtotal,
    v_subtotal
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;

    select i.* into v_inventory
    from public.inventory i
    where i.id = (v_item ->> 'inventory_id')::uuid;

    select * into v_variant
    from public.product_variants
    where id = v_inventory.variant_id;

    select * into v_product
    from public.products
    where id = v_variant.product_id;

    update public.inventory
    set stock = stock - v_quantity, updated_at = now()
    where id = v_inventory.id;

    insert into public.order_items (
      order_id, inventory_id, product_name, variant_name, size,
      quantity, unit_price, image_path
    )
    values (
      v_order_id, v_inventory.id, v_product.name, v_variant.color_name,
      v_inventory.size, v_quantity, v_product.price, v_variant.image_path
    );
  end loop;

  return v_order_id;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to authenticated;

alter table public.user_profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.wishlists enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Profiles are visible to their owner and store owner"
  on public.user_profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_owner()));

create policy "Users can update their own basic profile"
  on public.user_profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and role = 'customer');

create policy "Published products are visible to customers"
  on public.products for select to authenticated
  using (is_published or (select public.is_owner()));

create policy "Store owner manages products"
  on public.products for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy "Variants of published products are visible to customers"
  on public.product_variants for select to authenticated
  using (
    (select public.is_owner())
    or exists (
      select 1 from public.products p
      where p.id = product_id and p.is_published
    )
  );

create policy "Store owner manages variants"
  on public.product_variants for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy "Inventory for published products is visible to customers"
  on public.inventory for select to authenticated
  using (
    (select public.is_owner())
    or exists (
      select 1
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
      where pv.id = variant_id and p.is_published
    )
  );

create policy "Store owner manages inventory"
  on public.inventory for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy "Users manage their own addresses"
  on public.customer_addresses for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Customers and owner can read orders"
  on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_owner()));

create policy "Store owner updates orders"
  on public.orders for update to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy "Customers and owner can read order items"
  on public.order_items for select to authenticated
  using (
    (select public.is_owner())
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
  );

create policy "Customers and owner can read order history"
  on public.order_status_history for select to authenticated
  using (
    (select public.is_owner())
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
  );

create policy "Users manage their own wishlist"
  on public.wishlists for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (unsubscribed_at is null);

create policy "Store owner reads newsletter subscribers"
  on public.newsletter_subscribers for select to authenticated
  using ((select public.is_owner()));

create policy "Store owner updates newsletter subscribers"
  on public.newsletter_subscribers for update to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

create policy "Store owner deletes newsletter subscribers"
  on public.newsletter_subscribers for delete to authenticated
  using ((select public.is_owner()));

grant select, insert, update, delete on public.products, public.product_variants, public.inventory to authenticated;
grant select, update on public.user_profiles to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items, public.order_status_history to authenticated;
grant select, insert, update, delete on public.customer_addresses, public.wishlists to authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, update, delete on public.newsletter_subscribers to authenticated;

insert into public.products (slug, name, category, description, price, image_path)
values
  ('addi-zero', 'ADDI ZERO', 'Running', 'A cinder-track red midsole and a mesh upper built to breathe through the final stretch.', 128, 'running-red.png'),
  ('nike-gt-cut-4', 'Nike GT-Cut 4', 'Basketball', 'A wide platform and locked-in ankle collar for stop-start footwork on hardwood.', 145, 'basketball.jpg'),
  ('new-balance-550', 'New Balance 550', 'Lifestyle', 'A low-profile everyday shoe, cushioned enough for a full day on concrete.', 98, 'casual.png'),
  ('agility-peak-6', 'Agility Peak 6', 'Trail', 'Lugged rubber outsole and a reinforced toe cap for loose gravel and root-lined trails.', 132, 'trail.png'),
  ('asics', 'Asics', 'Running', 'Reflective overlays and a softer stack for easy miles after the sun goes down.', 118, 'running2.png'),
  ('sabrina-4', 'Sabrina 4', 'Basketball', 'A retro-stacked heel and full-length cushioning built for long tournament days.', 150, 'basketballshoes.png')
on conflict (slug) do nothing;

insert into public.product_variants (product_id, color_name, hue, image_path)
select p.id, v.color_name, v.hue, v.image_path
from (values
  ('addi-zero', 'Track Red', 0, 'running-red.png'),
  ('addi-zero', 'Ink', 190, 'running-ink.png'),
  ('addi-zero', 'Chalk', 40, 'running-chalk.png'),
  ('nike-gt-cut-4', 'Court Teal', 150, 'basketball-graphite.png'),
  ('nike-gt-cut-4', 'Hazard', 20, 'basketball-hazard.png'),
  ('nike-gt-cut-4', 'Graphite', 200, 'basketball.jpg'),
  ('new-balance-550', 'Indigo', 220, 'casual.png'),
  ('new-balance-550', 'Bone', 35, 'casual-bone.png'),
  ('new-balance-550', 'Rust', 5, 'casual-rust.png'),
  ('agility-peak-6', 'Moss', 70, 'trail.png'),
  ('agility-peak-6', 'Clay', 10, 'trail-clay.png'),
  ('agility-peak-6', 'Slate', 195, 'trail-slate.png'),
  ('asics', 'Dusk Violet', 280, 'running2.png'),
  ('asics', 'Ink', 190, 'running2-ink.png'),
  ('asics', 'Chalk', 40, 'running2-chalk.png'),
  ('sabrina-4', 'Signal Pink', 320, 'basketballshoes.png'),
  ('sabrina-4', 'Hazard', 20, 'basketballshoes-hazard.png'),
  ('sabrina-4', 'Graphite', 200, 'basketballshoes-graphite.png')
) as v(slug, color_name, hue, image_path)
join public.products p on p.slug = v.slug
on conflict (product_id, color_name) do nothing;

insert into public.inventory (variant_id, size, stock)
select pv.id, sizes.size, 10
from public.product_variants pv
cross join unnest(array[7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13]::numeric[]) as sizes(size)
on conflict (variant_id, size) do nothing;

-- Promote the intended store owner after that person signs up. Run manually in the SQL editor:
-- update public.user_profiles
-- set role = 'owner'
-- where id = (select id from auth.users where email = 'owner@example.com');
