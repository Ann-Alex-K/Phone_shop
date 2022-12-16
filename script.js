window.onload = () => {
    getData();
}

let products = [];

function getData() {
    axios.get('https://dh.cubicle.53xapps.com/products').then((responce) => {
        products = responce.data;
        products.splice(0, 19);
        render(products)
    })
}

function render(list) {

    const blocks = document.querySelector('.blocks');
    blocks.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let product of list) {


        const block = document.createElement('div');

        block.className = 'block text-center text-white-50 shadow';



        const html = `
        <div class="block">
        <p class="product">
          <h5 class="product-title">${product.title}</h5>
          </p>
          <img class="product-img rounded" src=${product.photo.front} alt="">
          <p class="product-price">
          <span>${product.price + '₽'}</span>
      </p>
          <button data-type="${product.id}" href="#" class="addСart btn btn-primary" onclick="addToCart(${product.id})" > Добавить в корзину <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus-fill" viewBox="0 0 16 16">
          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
        </svg></button>
      </div>
      `

        block.innerHTML = html;


        fragment.appendChild(block)
    }

    blocks.appendChild(fragment);

}

let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

function addToCart(id) {
    if (cart.some((item) => item.id === id)) {
        changeCount("addTocart", id);
    } else {
        const item = products.find((product) => product.id === id)

        cart.push({
            ...item,
            count: 1
        });
    }
    updateCart();
}

function updateCart() {
    renderCartItems(cart)
    renderTotal()

    localStorage.setItem("CART", JSON.stringify(cart))
}

function renderCartItems(list) {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    for (let product of list) {
        const cartRow = document.createElement('tr');


        const addHtml = `
              <th scope="row" width="60%">${product.title}</th>
              <td scope="row" width="10%">${product.price + '₽'}</td>
              <td scope="row"width="20%">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="delTocart bi bi-dash-circle" onclick="changeCount('delTocart', ${product.id})" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
            </svg>
              <span class="number">${product.count + ' ' + 'шт'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="addTocart bi bi-plus-circle" onclick="changeCount('addTocart', ${product.id})" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg></td>
               <td width="10%">  <button type="button" class="btn-close"  onclick="delFromCart(${product.id})"></button></td>
              `
        //
        cartRow.innerHTML += addHtml;
        cartList.appendChild(cartRow);

    }
}

function delFromCart(id) {
    cart = cart.filter((item) => item.id !== id);

    updateCart();
}

function changeCount(action, id) {
    cart = cart.map((item) => {
        let count = item.count;

        if (item.id === id) {
            if (action === "delTocart" && item.count !== 0) {
                count--;
            } else if (action === "addTocart") {
                count++;
            }
        }

        return {
            ...item,
            count,
        };
    })
    updateCart();
}

function renderTotal() {
    const total = document.querySelector('.subTotal');
    let totalPrice = 0,
        totalItems = 0;

    cart.forEach((item) => {
        totalPrice += item.price * item.count;
        totalItems += item.count;
    })
    total.innerHTML = `
    Всего товаров: ${totalItems} |
Итог: ${totalPrice + '₽'} 
    `
}

const dropdown = document.querySelector('.dropdown-menu');

dropdown.addEventListener('click', (e) => {

    const child = [...dropdown.children];
    child.forEach(el => {
        el.firstChild.classList.remove('active');
    });


    e.target.classList.add('active');
    const category = e.target.dataset.type;

    const dropdownTitle = document.getElementById('navDropdown');

    if (category === 'all')
        dropdownTitle.textContent = 'Все товары'

    if (category === '1')
        dropdownTitle.textContent = 'Apple'

    if (category === '2')
        dropdownTitle.textContent = 'HONOR'

    if (category === '3')
        dropdownTitle.textContent = 'Xiaomi'

    if (category === '4')
        dropdownTitle.textContent = 'Samsung'

    filterProducts(category)
})

function filterProducts(category) {
    const filterCategory = products.filter(product => {
        return product.brand_id == category || category === 'all'; 
    })
    render(filterCategory)
}
