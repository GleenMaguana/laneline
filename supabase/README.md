# Laneline Supabase setup

## 1. Create the database

In the Supabase project, open **SQL Editor**, paste and run [`schema.sql`](./schema.sql). It creates the customer and owner profiles, shoe catalog and color/size inventory, shipping addresses, orders and order items, order-status history, wishlists, and newsletter subscriptions. It also enables row-level security and seeds the current six products and their colorways.

The seed sets each size/color inventory row to 10 pairs as sample stock. Adjust those quantities in the Supabase Table Editor before accepting real orders.

## 2. Connect the storefront

In **Project Settings → API**, copy the Project URL and the public anon/publishable key into [`../SARGE-supabase-config.js`](../SARGE-supabase-config.js). Keep the key public/anon; **never put a service-role key in browser code**.

Serve the `MAGUANA&JANIOLA` folder over a local or hosted HTTP(S) web server and open `SARGE.html`. Supabase Auth does not reliably work when opening the file directly from `file://`.

If email confirmation is enabled in Supabase Auth, confirm the signup email before logging in. Add the deployed site URL to the Supabase Auth URL configuration if email confirmation or password recovery redirects are used.

## 3. Create the store owner

Sign up using the account that should manage the store, confirm its email, then run this once in the SQL Editor (replace the address):

```sql
update public.user_profiles
set role = 'owner'
where id = (
  select id from auth.users
  where email = 'owner@example.com'
);
```

New signups are customers by default. Only the database owner should promote an account. The customer storefront shows **My orders**; the owner additionally sees the **Owner dashboard**, all customer orders, shipping details, and controls to update pending order statuses. Row-level security enforces the same access rules in the database.

Checkout creates a pending order and reserves the selected inventory in one database transaction. It does not process payments.
