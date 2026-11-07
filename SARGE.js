(function(){

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
   DEMO ACCOUNT
========================================================= */

const DEMO_ACCOUNT = {
  name:'Demo User',
  email:'user@laneline.com',
  password:'123456'
};


/* =========================================================
   GET SAVED USERS
========================================================= */

function getUsers(){

  try{

    return JSON.parse(
      localStorage.getItem('lanelineUsers')
    ) || [];

  }catch(error){

    return [];

  }

}


/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users){

  localStorage.setItem(
    'lanelineUsers',
    JSON.stringify(users)
  );

}


/* =========================================================
   CREATE DEMO ACCOUNT
========================================================= */

function initializeDemoAccount(){

  const users = getUsers();

  const exists =
    users.some(
      user =>
        user.email.toLowerCase() ===
        DEMO_ACCOUNT.email.toLowerCase()
    );

  if(!exists){

    users.push(DEMO_ACCOUNT);

    saveUsers(users);

  }

}


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
   LOGIN
========================================================= */

loginForm.addEventListener(
  'submit',
  function(e){

    e.preventDefault();

    const email =
      loginEmail.value
        .trim()
        .toLowerCase();

    const password =
      loginPassword.value;

    loginMessage.textContent = '';

    loginMessage.style.color = '#B52B1A';

    const users = getUsers();

    const user =
      users.find(
        account =>
          account.email.toLowerCase() === email &&
          account.password === password
      );

    if(!user){

      loginMessage.textContent =
        'Incorrect email or password.';

      return;

    }

    localStorage.setItem(
      'lanelineLoggedIn',
      'true'
    );

    localStorage.setItem(
      'lanelineUser',
      user.email
    );

    localStorage.setItem(
      'lanelineUserName',
      user.name
    );

    loginMessage.style.color = '#28753C';

    loginMessage.textContent =
      'Login successful!';

    setTimeout(function(){

      authScreen.classList.add('hidden');

      mainInterface.classList.remove('hidden');

      userName.textContent = user.name;

      loginForm.reset();

      showToast(
        'Welcome to Laneline, ' +
        user.name +
        '!'
      );

      window.scrollTo(0,0);

    },400);

  }
);


/* =========================================================
   SIGN UP
========================================================= */

signupForm.addEventListener(
  'submit',
  function(e){

    e.preventDefault();

    const name =
      signupName.value.trim();

    const email =
      signupEmail.value
        .trim()
        .toLowerCase();

    const password =
      signupPassword.value;

    const confirmPassword =
      signupConfirmPassword.value;

    signupMessage.textContent = '';

    signupMessage.style.color = '#B52B1A';

    if(name.length < 2){

      signupMessage.textContent =
        'Please enter your full name.';

      return;

    }

    if(password.length < 6){

      signupMessage.textContent =
        'Password must be at least 6 characters.';

      return;

    }

    if(password !== confirmPassword){

      signupMessage.textContent =
        'Passwords do not match.';

      return;

    }

    let users = getUsers();

    const existingUser =
      users.find(
        user =>
          user.email.toLowerCase() === email
      );

    if(existingUser){

      signupMessage.textContent =
        'An account with this email already exists.';

      return;

    }

    const newUser = {
      name:name,
      email:email,
      password:password
    };

    users.push(newUser);

    saveUsers(users);

    signupMessage.style.color = '#28753C';

    signupMessage.textContent =
      'Account created successfully!';

    signupForm.reset();

    setTimeout(function(){

      loginSection.style.display = 'block';

      signupSection.style.display = 'none';

      loginEmail.value = email;

      loginPassword.value = '';

      loginMessage.style.color = '#28753C';

      loginMessage.textContent =
        'Account created. Please log in.';

    },800);

  }
);


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
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
  'click',
  function(){

    localStorage.removeItem(
      'lanelineLoggedIn'
    );

    localStorage.removeItem(
      'lanelineUser'
    );

    localStorage.removeItem(
      'lanelineUserName'
    );

    mainInterface.classList.add('hidden');

    authScreen.classList.remove('hidden');

    loginSection.style.display = 'block';

    signupSection.style.display = 'none';

    loginForm.reset();

    signupForm.reset();

    loginMessage.textContent = '';

    signupMessage.textContent = '';

    loginPassword.type = 'password';

    document
      .getElementById('showLoginPassword')
      .textContent = 'Show';

    window.scrollTo(0,0);

    setTimeout(function(){

      loginEmail.focus();

    },100);

  }
);


/* =========================================================
   CHECK LOGIN STATUS
========================================================= */

function checkLoginStatus(){

  const loggedIn =
    localStorage.getItem(
      'lanelineLoggedIn'
    ) === 'true';

  const savedName =
    localStorage.getItem(
      'lanelineUserName'
    );

  if(loggedIn){

    authScreen.classList.add('hidden');

    mainInterface.classList.remove('hidden');

    userName.textContent =
      savedName || 'User';

  }else{

    authScreen.classList.remove('hidden');

    mainInterface.classList.add('hidden');

    setTimeout(function(){

      loginEmail.focus();

    },100);

  }

}


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
    'image.jpg',
    'Laneline shoe'
  );


/* =========================================================
   PRODUCT DATA

   Each color has its own "img" file inside the images/ folder.
   If a color has no "img", the product's main "img" is used.
   The first color should use the product's main image.
========================================================= */

const products = [

  {
    id:'p1',
    name:'ADDI ZERO',
    cat:'Running',
    price:128,
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
    price:145,
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
    price:98,
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
    price:132,
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
    price:118,
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
    price:150,
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

          <span class="cat">
            ${p.cat}
          </span>

          <h3>
            ${p.name}
          </h3>

          <div class="card-foot">

            <span class="price">
              $${p.price}
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

  spPrice.textContent = '$' + p.price;

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

        existing.qty += 1;

      }else{

        cart.push({

          key:key,

          id:currentProduct.id,

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

const subtotalEl =
  document.getElementById('subtotal');


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
            $${item.price * item.qty}
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
    '$' + subtotal;

}


/* =========================================================
   CHECKOUT
========================================================= */

document
  .getElementById('checkoutBtn')
  .addEventListener(
    'click',
    () => {

      if(cart.length === 0){

        showToast(
          'Your bag is empty'
        );

        return;

      }

      showToast(
        'This is a mockup — checkout isn’t connected to payment'
      );

    }
  );


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
   INITIALIZE
========================================================= */

initializeDemoAccount();

renderGrid();

setSpotlight(products[0]);

renderCart();

checkLoginStatus();


})();