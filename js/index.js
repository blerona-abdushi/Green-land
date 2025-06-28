let allProducts = [];

// Fetch categories
async function fetchCategories() {
  try {
    const categoriesResponse = await fetch(
      "https://dummyjson.com/products/categories"
    );
    const categoriesData = await categoriesResponse.json();
    console.log("Categories:", categoriesData);

    renderCategories(categoriesData);
  } catch (error) {
    console.log("Error fetching categories:", error);
  }
}

// Render categories and set up filtering
function renderCategories(categories) {
  const categoriesContainer = document.querySelector(".categories");

  categoriesContainer.innerHTML =
    '<button class="category active" data-category="all">All</button>';

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("category");
    button.textContent = category.name;
    button.dataset.category = category.slug;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".category")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterProductsByCategory(category.slug);
    });

    categoriesContainer.appendChild(button);
  });

  
  document
    .querySelector(".category[data-category='all']")
    .addEventListener("click", () => {
      document
        .querySelectorAll(".category")
        .forEach((btn) => btn.classList.remove("category-active"));
      document
        .querySelector(".category[data-category='all']")
        .classList.add("category-active");
      renderProducts(allProducts);
    });
}

async function fetchProducts() {
  try {
    const productsResponse = await fetch(
      "https://dummyjson.com/products?limit=194"
    );
    const productsData = await productsResponse.json();
    allProducts = productsData.products;
    console.log("Products:", allProducts);
    renderProducts(allProducts);
  } catch (error) {
    console.log("Error fetching products:", error);
  }
}

function renderProducts(products) {
  const productsContainer = document.querySelector(".products-list");
  productsContainer.innerHTML = ""; 

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product-container");
    productElement.innerHTML = `
      <img class="image" src="${product.thumbnail}" alt="${product.title}">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-actions">
        <span class="product-price">$${product.price}</span>
        <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" 
          data-price="${product.price}" data-description="${product.description}" data-thumbnail="${product.thumbnail}">Add to Cart</button>
        <i class="fas fa-heart heart-icon"></i>
      </div>
    `;

    
    productElement
      .querySelector(".add-to-cart")
      .addEventListener("click", (e) => {
        addToCart(e.target.dataset);
      });

    productsContainer.appendChild(productElement);
  });
}


function filterProductsByCategory(categorySlug) {
  if (categorySlug === "all") {
    renderProducts(allProducts);
  } else {
    const filteredProducts = allProducts.filter(
      (product) => product.category.toLowerCase() === categorySlug
    );
    renderProducts(filteredProducts);
  }
}


function addToCart(productData) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingProduct = cart.find(
    (item) => item.id === parseInt(productData.id)
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: parseInt(productData.id),
      title: productData.title,
      thumbnail: productData.thumbnail, 
      price: parseFloat(productData.price),
      description: productData.description,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge(); 
  Toastify({
    text: `${productData.title} added to cart`,
    duration: 3000,  
    close: true,
    gravity: "bottom", 
    position: "center", 
    backgroundColor: "#4a9c80", 
    stopOnFocus: true, 
  }).showToast();
}


function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartBadge = document.querySelector(".badge"); 
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "inline-block" : "none"; 
  }
}


function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.querySelector(".cart-items");
  
  cartContainer.innerHTML = ""; 
  
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
      <img class="cart-thumbnail" src="${item.thumbnail}" alt="${item.title}">
      <h3 class="cart-item-title">${item.title}</h3>
      <p class="cart-item-description">${item.description}</p>
      <span class="cart-item-price">$${item.price}</span>
      <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
    `;
    
    cartContainer.appendChild(cartItemElement);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
  updateCartBadge();
});
