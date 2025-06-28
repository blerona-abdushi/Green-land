document.addEventListener("DOMContentLoaded", function () {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    const menuContainer = document.querySelector(".menu-container");
    menuContainer.innerHTML = ''; 

    let total = 0;

    if (cart.length === 0) {
      const message = document.createElement("p");
      message.textContent = "Your cart is empty!";
      menuContainer.appendChild(message);
      return;
    }

    cart.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("menu-card");
      card.innerHTML = `
        <div class="card-img">
          <img src="${item.thumbnail}" alt="${item.title}" />
        </div>
        <div class="card-content">
          <h1 class="card-title">${item.title}</h1>
          <p class="card-des">${item.description}</p>
        </div>
        <div class="flex-end">
          <div class="arrows-container">
            <span class="count">${item.quantity}</span>
            <div class="arrows">
              <button class="increment">
                <i class="fa-solid fa-caret-up"></i>
              </button>
              <button class="decrement">
                <i class="fa-solid fa-caret-down"></i>
              </button>
            </div>
            <span class="price">${(item.price * item.quantity).toFixed(2)}</span>
            <button class="trash-can">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
      menuContainer.appendChild(card);

      total += item.price * item.quantity;

      const incrementButton = card.querySelector(".increment");
      const decrementButton = card.querySelector(".decrement");
      const trashButton = card.querySelector(".trash-can");

      incrementButton.addEventListener("click", function () {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart)); // Save to localStorage
        updateCart();
      });

      decrementButton.addEventListener("click", function () {
        if (item.quantity > 1) {
          item.quantity--;
          localStorage.setItem("cart", JSON.stringify(cart)); // Save to localStorage
          updateCart();
        }
      });

      trashButton.addEventListener("click", function () {
        cart.splice(index, 1); 
        localStorage.setItem("cart", JSON.stringify(cart)); // Save to localStorage
        updateCart(); 
      });
    });

    const cartCount = document.querySelector(".cart-count");
    const totalPrice = document.querySelector(".total span");
    const subtotal = document.querySelector(".subtotal span");
    const shipping = document.querySelector(".shipping span");

    if (cartCount && totalPrice && subtotal && shipping) {
      const shippingCost = 5.00; 
      const totalWithShipping = total + shippingCost;

      cartCount.textContent = cart.length;
      subtotal.textContent = total.toFixed(2);
      shipping.textContent = shippingCost.toFixed(2);
      totalPrice.textContent = totalWithShipping.toFixed(2);
    }
  }

  updateCart();

  const checkoutButton = document.getElementById("checkout-button");
  checkoutButton.addEventListener("click", function () {
    
    const name = document.getElementById("name").value.trim();
    let cardNumber = document.getElementById("card").value.replace(/\s/g, ''); 
    const expirationDate = document.getElementById("Expiration-date").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    const nameRegex = /^[a-zA-Z\s]+$/;
    const cardRegex = /^\d{16}$/;  // Card must have exactly 16 digits
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    
    if (cardNumber.length === 16) {
      cardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
      document.getElementById("card").value = cardNumber; 
    } else if (cardNumber.length < 16) {
      alert("Card number must have exactly 16 digits.");
      return;
    }

    // Check if card number, expiration date and CVV are valid
    if (!name || !cardRegex.test(cardNumber.replace(/\s/g, '')) || !expirationDateRegex.test(expirationDate) || !cvvRegex.test(cvv)) {
      alert("Please complete all fields correctly.");
      return;
    }

    
    localStorage.removeItem("cart"); 
    updateCart(); 
    document.getElementById("success-modal").style.display = "block"; 
    setTimeout(function () {
      document.getElementById("success-modal").style.display = "none"; 
    }, 5000);
  });

  // Format the expiration date with the required format 11/01
  const expirationInput = document.getElementById("Expiration-date");
  expirationInput.addEventListener("input", function () {
    let expDate = expirationInput.value.replace(/\D/g, ''); 
    if (expDate.length >= 3) {
      expDate = expDate.slice(0, 2) + '/' + expDate.slice(2, 4); // Format as MM/YY
    }
    expirationInput.value = expDate; 
  });

  
  const cvvInput = document.getElementById("cvv");
  cvvInput.addEventListener("input", function () {
    let cvvValue = cvvInput.value.replace(/\D/g, ''); 
    if (cvvValue.length > 3) {
      cvvValue = cvvValue.slice(0, 3); 
    }
    cvvInput.value = cvvValue; 
  });

});

