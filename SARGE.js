(function(){

const loadingScreen =
  document.getElementById('loadingScreen');

const loadingStartedAt =
  performance.now();

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let loadingScreenDismissed = false;

function showLoadingScreen(){

  loadingScreen.classList.remove('is-hidden');

  loadingScreen.removeAttribute('aria-hidden');

}


function hideLoadingScreen(){

  loadingScreen.classList.add('is-hidden');

  loadingScreen.setAttribute('aria-hidden', 'true');

}


function dismissLoadingScreen(){

  if(loadingScreenDismissed){
    return;
  }

  loadingScreenDismissed = true;

  const minimumDuration =
    prefersReducedMotion
      ? 0
      : 900;

  const remainingDuration =
    Math.max(0, minimumDuration - (performance.now() - loadingStartedAt));

  window.setTimeout(
    hideLoadingScreen,
    remainingDuration
  );

}

window.addEventListener('load', dismissLoadingScreen, { once:true });

window.setTimeout(dismissLoadingScreen, 5000);

if(document.readyState === 'complete'){
  dismissLoadingScreen();
}

/* =========================================================
   AUTHENTICATION SYSTEM
========================================================= */

const authScreen =
  document.getElementById('authScreen');

const mainInterface =
  document.getElementById('mainInterface');

const loginSection =
  document.getElementById('loginSection');

const signupSection =
  document.getElementById('signupSection');

const loginForm =
  document.getElementById('loginForm');

const signupForm =
  document.getElementById('signupForm');

const loginEmail =
  document.getElementById('loginEmail');

const loginPassword =
  document.getElementById('loginPassword');

const signupName =
  document.getElementById('signupName');

const signupEmail =
  document.getElementById('signupEmail');

const signupPassword =
  document.getElementById('signupPassword');

const signupConfirmPassword =
  document.getElementById('signupConfirmPassword');

const loginMessage =
  document.getElementById('loginMessage');

const signupMessage =
  document.getElementById('signupMessage');

const showSignup =
  document.getElementById('showSignup');

const showLogin =
  document.getElementById('showLogin');

const logoutBtn =
  document.getElementById('logoutBtn');

const userName =
  document.getElementById('userName');


/* =========================================================
   SHOW LOGIN
========================================================= */

function showLoginScreen(){

  authScreen.classList.remove('hidden');

  mainInterface.classList.add('hidden');

  loginSection.style.display = 'block';

  signupSection.style.display = 'none';

  loginMessage.textContent = '';

  signupMessage.textContent = '';

}


/* =========================================================
   SHOW SIGN UP
========================================================= */

function showSignupScreen(){

  loginSection.style.display = 'none';

  signupSection.style.display = 'block';

  loginMessage.textContent = '';

  signupMessage.textContent = '';

  signupForm.reset();

  setTimeout(function(){

    signupName.focus();

  },100);

}


/* =========================================================
   SWITCH TO SIGN UP
========================================================= */

showSignup.addEventListener(
  'click',
  showSignupScreen
);


/* =========================================================
   SWITCH TO LOGIN
========================================================= */

showLogin.addEventListener(
  'click',
  function(){

    loginSection.style.display = 'block';

    signupSection.style.display = 'none';

    signupMessage.textContent = '';

    loginMessage.textContent = '';

  }
);


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

document
  .getElementById('showLoginPassword')
  .addEventListener(
    'click',
    function(){

      if(loginPassword.type === 'password'){

        loginPassword.type = 'text';

        this.textContent = 'Hide';

      }else{

        loginPassword.type = 'password';

        this.textContent = 'Show';

      }

    }
  );


document
  .getElementById('showSignupPassword')
  .addEventListener(
    'click',
    function(){

      if(signupPassword.type === 'password'){

        signupPassword.type = 'text';

        this.textContent = 'Hide';

      }else{

        signupPassword.type = 'password';

        this.textContent = 'Show';

      }

    }
  );


document
  .getElementById('showConfirmPassword')
  .addEventListener(
    'click',
    function(){

      if(signupConfirmPassword.type === 'password'){

        signupConfirmPassword.type = 'text';

        this.textContent = 'Hide';

      }else{

        signupConfirmPassword.type = 'password';

        this.textContent = 'Show';

      }

    }
  );


/* =========================================================
   MEDIA FRAME
========================================================= */

function mediaFrame(image,alt){

  return `

    <div class="media-frame">

      <img
        src="images/${image}"
        alt="${alt}"
        loading="lazy"
        onerror="this.parentElement.classList.add('img-missing')"
      >

      <span class="img-missing-label">

        Add a photo

        <strong>
          images/${image}
        </strong>

      </span>

    </div>

  `;

}


document.getElementById('heroShoe').innerHTML =
  mediaFrame(
    'Image.jpg',
    'Laneline shoe'
  );


/* =========================================================
   PRODUCT DATA

   Each color has its own "img" file inside the images/ folder.
   If a color has no "img", the product's main "img" is used.
   The first color should use the product's main image.
========================================================= */

const CURRENCY_RATE = 63.5;

function formatPeso(value){
  return new Intl.NumberFormat('en-PH', {
    style:'currency',
    currency:'PHP',
    minimumFractionDigits:2,
    maximumFractionDigits:2
  }).format(Number(value));
}

let products = [

  {
    id:'p1',
    name:'ADDI ZERO',
    cat:'Running',
    price:128 * CURRENCY_RATE,
    img:'running-red.png',

    blurb:
      'A cinder-track red midsole and a mesh upper built to breathe through the final stretch.',

    colors:[
      { name:'Track Red', hue:0,   img:'running-red.png' },
      { name:'Ink',       hue:190, img:'running-ink.png' },
      { name:'Chalk',     hue:40,  img:'running-chalk.png' }
    ]
  },

  {
    id:'p2',
    name:'Nike GT-Cut 4',
    cat:'Basketball',
    price:145 * CURRENCY_RATE,
    img:'basketball.jpg',

    blurb:
      'A wide platform and locked-in ankle collar for stop-start footwork on hardwood.',

    colors:[
      { name:'Court Teal', hue:150, img:'basketball-graphite.png' },
      { name:'Hazard',     hue:20,  img:'basketball-hazard.png' },
      { name:'Graphite',   hue:200, img:'basketball.jpg' }
    ]
  },

  {
    id:'p3',
    name:'New Balance 550',
    cat:'Lifestyle',
    price:98 * CURRENCY_RATE,
    img:'casual.png',

    blurb:
      'A low-profile everyday shoe, cushioned enough for a full day on concrete.',

    colors:[
      { name:'Indigo', hue:220, img:'casual.png' },
      { name:'Bone',   hue:35,  img:'casual-bone.png' },
      { name:'Rust',   hue:5,   img:'casual-rust.png' }
    ]
  },

  {
    id:'p4',
    name:'Agility Peak 6',
    cat:'Trail',
    price:132 * CURRENCY_RATE,
    img:'trail.png',

    blurb:
      'Lugged rubber outsole and a reinforced toe cap for loose gravel and root-lined trails.',

    colors:[
      { name:'Moss',  hue:70,  img:'trail.png' },
      { name:'Clay',  hue:10,  img:'trail-clay.png' },
      { name:'Slate', hue:195, img:'trail-slate.png' }
    ]
  },

  {
    id:'p5',
    name:'Asics',
    cat:'Running',
    price:118 * CURRENCY_RATE,
    img:'running2.png',

    blurb:
      'Reflective overlays and a softer stack for easy miles after the sun goes down.',

    colors:[
      { name:'Dusk Violet', hue:280, img:'running2.png' },
      { name:'Ink',         hue:190, img:'running2-ink.png' },
      { name:'Chalk',       hue:40,  img:'running2-chalk.png' }
    ]
  },

  {
    id:'p6',
    name:'Sabrina 4',
    cat:'Basketball',
    price:150 * CURRENCY_RATE,
    img:'basketballshoes.png',

    blurb:
      'A retro-stacked heel and full-length cushioning built for long tournament days.',

    colors:[
      { name:'Signal Pink', hue:320, img:'basketballshoes.png' },
      { name:'Hazard',      hue:20,  img:'basketballshoes-hazard.png' },
      { name:'Graphite',    hue:200, img:'basketballshoes-graphite.png' }
    ]
  }

];


const categories = [
  'All',
  'Running',
  'Basketball',
  'Lifestyle',
  'Trail'
];


let activeCat = 'All';

let currentProduct = products[0];

let selectedColorIdx = 0;

let selectedSize = null;

let cart = [];


/* =========================================================
   TABS
========================================================= */

const tabsEl =
  document.getElementById('tabs');

categories.forEach(
  cat => {

    const b =
      document.createElement('button');

    b.className =
      'tab' +
      (
        cat === 'All'
        ? ' active'
        : ''
      );

    b.textContent = cat;

    b.addEventListener(
      'click',
      () => {

        activeCat = cat;

        [
          ...tabsEl.children
        ].forEach(
          c =>
            c.classList.remove('active')
        );

        b.classList.add('active');

        renderGrid();

      }
    );

    tabsEl.appendChild(b);

  }
);


/* =========================================================
   PRODUCT GRID
========================================================= */

const gridEl =
  document.getElementById('productGrid');


function renderGrid(){

  gridEl.innerHTML = '';

  const list =
    products.filter(
      p =>
        activeCat === 'All' ||
        p.cat === activeCat
    );

  list.forEach(
    p => {

      const card =
        document.createElement('article');

      card.className = 'card';

      card.innerHTML = `

        <div class="card-media">

          <span class="card-tag">
            ${p.cat}
          </span>

          ${mediaFrame(
            p.img,
            p.name
          )}

        </div>

        <div class="card-body">

          <h3>
            ${p.name}
          </h3>

          <div class="card-foot">

            <span class="price">
              ${formatPeso(p.price)}
            </span>

            <button
              class="view-btn"
              data-id="${p.id}"
            >
              View
            </button>

          </div>

        </div>

      `;

      gridEl.appendChild(card);

    }
  );

  gridEl
    .querySelectorAll('.view-btn')
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          () => {

            const p =
              products.find(
                x =>
                  x.id === btn.dataset.id
              );

            setSpotlight(p);

            document
              .getElementById('spotlight')
              .scrollIntoView({
                behavior:'smooth',
                block:'start'
              });

          }
        );

      }
    );

}


/* =========================================================
   SPOTLIGHT
========================================================= */

const spMedia =
  document.getElementById('spotlightMedia');

const spName =
  document.getElementById('spName');

const spCat =
  document.getElementById('spCat');

const spBlurb =
  document.getElementById('spBlurb');

const spPrice =
  document.getElementById('spPrice');

const spColors =
  document.getElementById('spColors');

const spSizes =
  document.getElementById('spSizes');

const sizeHint =
  document.getElementById('sizeHint');


const sizeRange = [
  7,
  7.5,
  8,
  8.5,
  9,
  9.5,
  10,
  10.5,
  11,
  11.5,
  12,
  13
];


function setSpotlight(p){

  currentProduct = p;

  selectedColorIdx = 0;

  selectedSize = null;

  sizeHint.textContent = '\u00a0';

  sizeHint.classList.remove('warn');

  spName.textContent = p.name;

  spCat.textContent = p.cat;

  spBlurb.textContent = p.blurb;

  spPrice.textContent = formatPeso(p.price);

  // Show the first color's image when the spotlight loads
  spMedia.innerHTML =
    mediaFrame(
      p.colors[0].img || p.img,
      p.name
    );

  spColors.innerHTML = '';

  p.colors.forEach(
    (c,i) => {

      const dot =
        document.createElement('button');

      dot.className =
        'colorway' +
        (
          i === 0
          ? ' active'
          : ''
        );

      dot.style.background =
        `hsl(${c.hue},70%,50%)`;

      dot.title = c.name;

      dot.setAttribute(
        'aria-label',
        c.name
      );

      dot.addEventListener(
        'click',
        () => {

          selectedColorIdx = i;

          [
            ...spColors.children
          ].forEach(
            d =>
              d.classList.remove('active')
          );

          dot.classList.add('active');

          // Swap the shoe image to the chosen color
          spMedia.innerHTML =
            mediaFrame(
              c.img || p.img,
              p.name + ' - ' + c.name
            );

        }
      );

      spColors.appendChild(dot);

    }
  );

  spSizes.innerHTML = '';

  sizeRange.forEach(
    s => {

      const b =
        document.createElement('button');

      b.className = 'size-btn';

      b.textContent = s;

      b.addEventListener(
        'click',
        () => {

          selectedSize = s;

          [
            ...spSizes.children
          ].forEach(
            x =>
              x.classList.remove('selected')
          );

          b.classList.add('selected');

          sizeHint.textContent = '\u00a0';

          sizeHint.classList.remove('warn');

        }
      );

      spSizes.appendChild(b);

    }
  );

}


/* =========================================================
   ADD TO BAG
========================================================= */

document
  .getElementById('addToBagBtn')
  .addEventListener(
    'click',
    () => {

      if(!selectedSize){

        sizeHint.textContent =
          'Pick a size before adding to your bag.';

        sizeHint.classList.add('warn');

        return;

      }

      const color =
        currentProduct.colors[selectedColorIdx];

      const inventory =
        color.inventory &&
        color.inventory.find(
          item =>
            Number(item.size) === Number(selectedSize)
        );

      if(!inventory || inventory.stock < 1){

        sizeHint.textContent =
          'This color and size is currently out of stock.';

        sizeHint.classList.add('warn');

        return;

      }

      const key =
        currentProduct.id +
        '|' +
        color.name +
        '|' +
        selectedSize;

      const existing =
        cart.find(
          i =>
            i.key === key
        );

      if(existing){

        if(existing.qty >= inventory.stock){

          showToast('There is not enough stock for that quantity.');

          return;

        }

        existing.qty += 1;

      }else{

        cart.push({

          key:key,

          id:currentProduct.id,

          inventoryId:inventory.id,

          name:currentProduct.name,

          // Cart thumbnail uses the chosen color's image
          img:color.img || currentProduct.img,

          color:color.name,

          hue:color.hue,

          size:selectedSize,

          price:currentProduct.price,

          qty:1

        });

      }

      renderCart();

      animateCartAdd();

      showToast(
        `Added ${currentProduct.name} · ${color.name} · size ${selectedSize}`
      );

    }
  );


/* =========================================================
   WISHLIST
========================================================= */

document
  .getElementById('wishlistBtn')
  .addEventListener(
    'click',
    () => {

      showToast(
        `Saved ${currentProduct.name} for later`
      );

    }
  );


/* =========================================================
   CART DRAWER
========================================================= */

const overlay =
  document.getElementById('overlay');

const drawer =
  document.getElementById('cartDrawer');

const drawerItems =
  document.getElementById('drawerItems');

const cartCount =
  document.getElementById('cartCount');

const cartToggle =
  document.getElementById('cartToggle');

const subtotalEl =
  document.getElementById('subtotal');


function animateCartAdd(){

  cartToggle.classList.remove('cart-bump');

  cartCount.classList.remove('cart-bump');

  void cartToggle.offsetWidth;

  cartToggle.classList.add('cart-bump');

  cartCount.classList.add('cart-bump');

  const image =
    spMedia.querySelector('.media-frame img');

  if(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !image ||
    !image.complete ||
    !image.naturalWidth
  ){

    return;

  }

  const start = image.getBoundingClientRect();

  const target = cartToggle.getBoundingClientRect();

  const flyingImage = document.createElement('img');

  flyingImage.className = 'cart-flight';

  flyingImage.src = image.currentSrc || image.src;

  flyingImage.alt = '';

  flyingImage.style.left = `${start.left}px`;

  flyingImage.style.top = `${start.top}px`;

  flyingImage.style.width = `${start.width}px`;

  flyingImage.style.height = `${start.height}px`;

  document.body.appendChild(flyingImage);

  const travelX =
    target.left + target.width / 2 - (start.left + start.width / 2);

  const travelY =
    target.top + target.height / 2 - (start.top + start.height / 2);

  const animation = flyingImage.animate(
    [
      {
        transform:'translate(0, 0) scale(1)',
        opacity:1
      },
      {
        transform:`translate(${travelX}px, ${travelY}px) scale(.08)`,
        opacity:.2
      }
    ],
    {
      duration:650,
      easing:'cubic-bezier(.2, .75, .25, 1)'
    }
  );

  animation.onfinish = () => flyingImage.remove();

  animation.oncancel = () => flyingImage.remove();

}


function openDrawer(){

  drawer.classList.add('open');

  overlay.classList.add('open');

}


function closeDrawer(){

  drawer.classList.remove('open');

  overlay.classList.remove('open');

}


document
  .getElementById('cartToggle')
  .addEventListener(
    'click',
    openDrawer
  );


document
  .getElementById('drawerClose')
  .addEventListener(
    'click',
    closeDrawer
  );


overlay.addEventListener(
  'click',
  closeDrawer
);


/* =========================================================
   RENDER CART
========================================================= */

function renderCart(){

  const totalQty =
    cart.reduce(
      (n,i) =>
        n + i.qty,
      0
    );

  cartCount.textContent = totalQty;

  if(cart.length === 0){

    drawerItems.innerHTML =
      '<p class="drawer-empty">Your bag is empty. Go find your next pair.</p>';

  }else{

    drawerItems.innerHTML = '';

    cart.forEach(
      item => {

        const row =
          document.createElement('div');

        row.className = 'cart-item';

        row.innerHTML = `

          <div class="thumb">

            ${mediaFrame(
              item.img,
              item.name
            )}

          </div>

          <div class="meta">

            <h4>
              ${item.name}
            </h4>

            <div class="sub">

              ${item.color}

              ·

              Size ${item.size}

            </div>

            <div class="qty-row">

              <button
                class="qty-btn"
                data-action="dec"
                data-key="${item.key}"
              >
                −
              </button>

              <span class="qty-val">
                ${item.qty}
              </span>

              <button
                class="qty-btn"
                data-action="inc"
                data-key="${item.key}"
              >
                +
              </button>

              <button
                class="remove-btn"
                data-action="remove"
                data-key="${item.key}"
              >
                Remove
              </button>

            </div>

          </div>

          <div class="item-price">
            ${formatPeso(item.price * item.qty)}
          </div>

        `;

        drawerItems.appendChild(row);

      }
    );

    drawerItems
      .querySelectorAll(
        'button[data-action]'
      )
      .forEach(
        btn => {

          btn.addEventListener(
            'click',
            () => {

              const key =
                btn.dataset.key;

              const action =
                btn.dataset.action;

              const item =
                cart.find(
                  i =>
                    i.key === key
                );

              if(!item)
                return;

              if(action === 'inc'){

                const inventory = products
                  .flatMap(product => product.colors)
                  .flatMap(color => color.inventory || [])
                  .find(stockItem => stockItem.id === item.inventoryId);

                if(!inventory || item.qty >= inventory.stock){
                  showToast('There is not enough stock for that quantity.');
                  return;
                }

                item.qty += 1;

              }

              if(action === 'dec'){

                item.qty =
                  Math.max(
                    1,
                    item.qty - 1
                  );

              }

              if(action === 'remove'){

                cart =
                  cart.filter(
                    i =>
                      i.key !== key
                  );

              }

              renderCart();

            }
          );

        }
      );

  }

  const subtotal =
    cart.reduce(
      (n,i) =>
        n +
        i.price *
        i.qty,
      0
    );

  subtotalEl.textContent =
    formatPeso(subtotal);

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(msg){

  const t =
    document.getElementById('toast');

  t.textContent = msg;

  t.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(
      () =>
        t.classList.remove('show'),
      2600
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

document
  .getElementById('newsletterForm')
  .addEventListener(
    'submit',
    (e) => {

      e.preventDefault();

      document
        .getElementById('newsletterMsg')
        .textContent =
        'You’re on the list — watch your inbox.';

      e.target.reset();

    }
  );


/* =========================================================
   SUPABASE
========================================================= */

const userRole =
  document.getElementById('userRole');

const ordersPanel =
  document.getElementById('ordersPanel');

const ownerDashboard =
  document.getElementById('ownerDashboard');

const ownerDashboardToggle =
  document.getElementById('ownerDashboardToggle');

const storefrontSections = [
  document.querySelector('.hero'),
  document.getElementById('shop'),
  document.getElementById('spotlight'),
  document.getElementById('newsletter'),
  document.getElementById('footer')
];

const supabaseUrl =
  window.LANELINE_SUPABASE_URL || '';

const supabaseAnonKey =
  window.LANELINE_SUPABASE_ANON_KEY || '';

const supabaseConfigured =
  window.supabase &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey &&
  !supabaseUrl.includes('YOUR_SUPABASE') &&
  !supabaseAnonKey.includes('YOUR_SUPABASE');

const supabaseClient =
  supabaseConfigured
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

let activeUser = null;
let activeProfile = null;

function supabaseSetupMessage(){

  if(!window.supabase){
    return 'The Supabase client library did not load. Check your internet connection and reload.';
  }

  return 'Add your Supabase project URL and anon key to SARGE-supabase-config.js.';

}

localStorage.removeItem('lanelineUsers');
localStorage.removeItem('lanelineLoggedIn');
localStorage.removeItem('lanelineUser');
localStorage.removeItem('lanelineUserName');

function setAuthMessage(element, message, isSuccess){

  element.textContent = message;
  element.style.color = isSuccess ? '#28753C' : '#B52B1A';

}

function showSignedOut(){

  activeUser = null;
  activeProfile = null;
  userName.textContent = '';
  userRole.textContent = '';
  ownerDashboardToggle.hidden = true;
  authScreen.classList.remove('hidden');
  mainInterface.classList.add('hidden');
  ordersPanel.hidden = true;
  ownerDashboard.hidden = true;
  storefrontSections.forEach(section => section.hidden = false);

}

function closeAccountPanels(){

  ordersPanel.hidden = true;
  ownerDashboard.hidden = true;
  storefrontSections.forEach(section => section.hidden = false);

}

async function loadProducts(){

  const { data, error } = await supabaseClient
    .from('products')
    .select('id,slug,name,category,description,price,image_path,product_variants(id,color_name,hue,image_path,inventory(id,size,stock))')
    .eq('is_published', true)
    .order('name');

  if(error){
    throw error;
  }

  products = data.map(product => ({
    id:product.id,
    slug:product.slug,
    name:product.name,
    cat:product.category,
    price:Number(product.price) * CURRENCY_RATE,
    img:product.image_path.split('/').pop(),
    blurb:product.description,
    colors:product.product_variants.map(variant => ({
      id:variant.id,
      variantId:variant.id,
      name:variant.color_name,
      hue:variant.hue,
      img:variant.image_path.split('/').pop(),
      inventory:variant.inventory
    }))
  }));

  activeCat = 'All';
  tabsEl.querySelectorAll('.tab').forEach(button => {
    button.classList.toggle('active', button.textContent === 'All');
  });
  renderGrid();

  if(products.length){
    setSpotlight(products[0]);
  }else{
    spName.textContent = 'No products available';
    spBlurb.textContent = 'Please check back soon.';
  }

}

async function loadCurrentUser(session){

  if(!session){
    showSignedOut();
    return;
  }

  activeUser = session.user;

  const { data:profile, error } = await supabaseClient
    .from('user_profiles')
    .select('id,full_name,role')
    .eq('id', session.user.id)
    .single();

  if(error){
    showSignedOut();
    setAuthMessage(
      loginMessage,
      'Could not load your account profile. Check that the Supabase schema has been installed.',
      false
    );
    return;
  }

  activeProfile = profile;
  userName.textContent =
    profile.full_name || session.user.email || 'Customer';
  userRole.textContent =
    profile.role === 'owner' ? 'OWNER' : 'CUSTOMER';
  ownerDashboardToggle.hidden = profile.role !== 'owner';
  authScreen.classList.add('hidden');
  mainInterface.classList.remove('hidden');

  try{
    await loadProducts();
  }catch(productError){
    products = [];
    renderGrid();
    showToast('Products could not be loaded: ' + productError.message);
  }

}

loginForm.addEventListener('submit', async function(event){

  event.preventDefault();
  event.stopImmediatePropagation();
  setAuthMessage(loginMessage, '', false);

  if(!supabaseClient){
    setAuthMessage(
      loginMessage,
      supabaseSetupMessage(),
      false
    );
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email:loginEmail.value.trim(),
    password:loginPassword.value
  });

  if(error){
    setAuthMessage(loginMessage, error.message, false);
    return;
  }

  loginForm.reset();
  await loadCurrentUser(data.session);
  showToast('Welcome to Laneline.');

}, true);

signupForm.addEventListener('submit', async function(event){

  event.preventDefault();
  event.stopImmediatePropagation();
  setAuthMessage(signupMessage, '', false);

  if(!supabaseClient){
    setAuthMessage(
      signupMessage,
      supabaseSetupMessage(),
      false
    );
    return;
  }

  if(signupPassword.value !== signupConfirmPassword.value){
    setAuthMessage(signupMessage, 'Passwords do not match.', false);
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email:signupEmail.value.trim(),
    password:signupPassword.value,
    options:{
      data:{ full_name:signupName.value.trim() }
    }
  });

  if(error){
    setAuthMessage(signupMessage, error.message, false);
    return;
  }

  signupForm.reset();

  if(data.session){
    await loadCurrentUser(data.session);
    showToast('Your customer account is ready.');
  }else{
    loginSection.style.display = 'block';
    signupSection.style.display = 'none';
    loginEmail.value = data.user.email;
    setAuthMessage(
      loginMessage,
      'Account created. Check your email to confirm your address, then log in.',
      true
    );
  }

}, true);

logoutBtn.addEventListener('click', async function(event){

  event.preventDefault();
  event.stopImmediatePropagation();

  if(supabaseClient){
    const { error } = await supabaseClient.auth.signOut();
    if(error){
      showToast('Could not log out: ' + error.message);
      return;
    }
  }

  showSignedOut();

}, true);

document
  .getElementById('checkoutBtn')
  .addEventListener('click', async function(event){

    event.preventDefault();
    event.stopImmediatePropagation();

    if(!supabaseClient || !activeUser){
      showToast('Log in with your Supabase account before checkout.');
      return;
    }

    if(!cart.length){
      showToast('Your bag is empty.');
      return;
    }

    const addressForm =
      document.getElementById('checkoutAddress');

    if(!addressForm.reportValidity()){
      return;
    }

    const address =
      Object.fromEntries(new FormData(addressForm).entries());

    const { data:orderId, error } = await supabaseClient.rpc('place_order', {
      p_items:cart.map(item => ({
        inventory_id:item.inventoryId,
        quantity:item.qty
      })),
      p_shipping_address:address
    });

    if(error){
      showToast('Order could not be placed: ' + error.message);
      return;
    }

    cart = [];
    renderCart();
    addressForm.reset();
    addressForm.elements.country.value = 'Philippines';
    closeDrawer();
    showToast(
      'Order ' + orderId.slice(0, 8).toUpperCase() +
      ' placed and awaiting owner confirmation.'
    );
    await loadCustomerOrders();
    if(activeProfile.role === 'owner'){
      await loadOwnerOrders();
    }

  }, true);

function createOrderCard(order, ownerView){

  const card = document.createElement('article');
  card.className = 'order-card';

  const header = document.createElement('div');
  header.className = 'order-card-head';

  const summary = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = 'Order ' + order.id.slice(0, 8).toUpperCase();
  const detail = document.createElement('p');
  const date = new Date(order.created_at).toLocaleString();
  detail.textContent = (ownerView
    ? (order.customer_name + ' · ' + order.customer_email + ' · ')
    : '') + date + ' · ' + formatPeso(Number(order.total));
  summary.append(title, detail);

  const status = document.createElement('span');
  status.className = 'order-status';
  status.textContent = order.status;
  header.append(summary, status);
  card.appendChild(header);

  if(ownerView && order.shipping_address){
    const address = order.shipping_address;
    const shipping = document.createElement('p');
    shipping.textContent =
      'Ship to: ' + address.recipient_name + ', ' +
      address.address_line1 + ', ' + address.city + ', ' +
      address.postal_code + ', ' + address.country +
      ' · ' + address.phone;
    card.appendChild(shipping);
  }

  const items = document.createElement('div');
  items.className = 'order-items';
  items.textContent = (order.order_items || []).map(item =>
    item.quantity + ' × ' + item.product_name + ' · ' +
    item.variant_name + ' · US ' + item.size
  ).join(' | ') || 'No item details';
  card.appendChild(items);

  if(ownerView){
    const management = document.createElement('div');
    management.className = 'order-management';
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Update order status');
    select.disabled = order.status === 'cancelled';
    ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
      .forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        option.selected = value === order.status;
        select.appendChild(option);
      });

    select.addEventListener('change', async function(){
      const { error } = await supabaseClient
        .from('orders')
        .update({ status:select.value })
        .eq('id', order.id);

      if(error){
        showToast('Order status could not be updated: ' + error.message);
        await loadOwnerOrders();
        return;
      }

      showToast('Order status updated.');
      await loadOwnerOrders();
    });

    management.appendChild(select);
    card.appendChild(management);
  }

  return card;

}

async function loadCustomerOrders(){

  const list = document.getElementById('customerOrders');
  list.replaceChildren();

  const { data, error } = await supabaseClient
    .from('orders')
    .select('id,status,total,created_at,order_items(product_name,variant_name,size,quantity,unit_price)')
    .order('created_at', { ascending:false });

  if(error){
    list.textContent = 'Orders could not be loaded: ' + error.message;
    return;
  }

  if(!data.length){
    list.textContent = 'You have not placed any orders yet.';
    return;
  }

  data.forEach(order => list.appendChild(createOrderCard(order, false)));

}

async function loadOwnerOrders(){

  const list = document.getElementById('ownerOrders');
  const summary = document.getElementById('ownerOrderSummary');
  list.replaceChildren();
  summary.textContent = 'Loading orders...';

  const { data, error } = await supabaseClient
    .from('orders')
    .select('id,user_id,status,total,created_at,customer_name,customer_email,shipping_address,order_items(product_name,variant_name,size,quantity,unit_price)')
    .order('created_at', { ascending:false });

  if(error){
    summary.textContent = 'Dashboard data could not be loaded.';
    list.textContent = error.message;
    return;
  }

  const pendingCount = data.filter(order => order.status === 'pending').length;
  summary.textContent =
    data.length + ' total orders · ' + pendingCount + ' pending';

  if(!data.length){
    list.textContent = 'No customer orders yet.';
    return;
  }

  data.forEach(order => list.appendChild(createOrderCard(order, true)));

}

document
  .getElementById('ordersToggle')
  .addEventListener('click', async function(){

    if(!activeUser){
      return;
    }

    closeAccountPanels();
    storefrontSections.forEach(section => section.hidden = true);
    ordersPanel.hidden = false;
    await loadCustomerOrders();

  });

ownerDashboardToggle.addEventListener('click', async function(){

  if(!activeProfile || activeProfile.role !== 'owner'){
    showToast('Owner access is required.');
    return;
  }

  closeAccountPanels();
  storefrontSections.forEach(section => section.hidden = true);
  ownerDashboard.hidden = false;
  await loadOwnerOrders();

});

document.querySelectorAll('[data-close-panel]').forEach(button => {
  button.addEventListener('click', closeAccountPanels);
});

document
  .getElementById('addToBagBtn')
  .addEventListener('click', function(event){
    if(!activeUser){
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast('Log in to add products to your bag.');
    }
  }, true);

document
  .getElementById('wishlistBtn')
  .addEventListener('click', async function(event){
    event.preventDefault();
    event.stopImmediatePropagation();

    if(!activeUser || !supabaseClient){
      showToast('Log in to save products.');
      return;
    }

    const { error } = await supabaseClient
      .from('wishlists')
      .upsert({ user_id:activeUser.id, product_id:currentProduct.id });

    if(error){
      showToast('Could not save product: ' + error.message);
      return;
    }

    showToast('Saved ' + currentProduct.name + ' for later.');
  }, true);

document
  .getElementById('newsletterForm')
  .addEventListener('submit', async function(event){
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    const input = form.querySelector('input[type="email"]');
    const newsletterMessage = document.getElementById('newsletterMsg');

    if(!supabaseClient){
      newsletterMessage.textContent =
        'Newsletter signup is unavailable until Supabase is configured.';
      return;
    }

    const { error } = await supabaseClient
      .from('newsletter_subscribers')
      .insert({ email:input.value.trim().toLowerCase() });

    if(error){
      newsletterMessage.textContent = 'Could not subscribe: ' + error.message;
      return;
    }

    newsletterMessage.textContent = 'You’re on the list — watch your inbox.';
    form.reset();
  }, true);

if(supabaseClient){
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if(error){
      setAuthMessage(loginMessage, 'Could not restore your session: ' + error.message, false);
      showSignedOut();
      return;
    }

    loadCurrentUser(data.session);
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => loadCurrentUser(session), 0);
  });

}else{
  showSignedOut();
  setAuthMessage(
    loginMessage,
    supabaseSetupMessage(),
    false
  );
}


/* =========================================================
   INITIALIZE
========================================================= */

renderGrid();

setSpotlight(products[0]);

renderCart();


})();