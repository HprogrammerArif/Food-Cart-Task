// Function to toggle the visibility of the mobile menu
const toggleMobileMenu = () => {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden"); // Show/hide mobile menu
};

// Cart-related variables and elements
let cart = []; // Array to store items added to the cart
const cartSidebar = document.getElementById("cart-sidebar"); // Sidebar element for the cart
const cartItemsContainer = document.getElementById("cart-items-container"); // Container for items in the cart
const cartTotal = document.getElementById("cart-total"); // Element to display total cart amount

// Load cart from local storage on page load
document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);

// Function to close the cart sidebar
const closeCart = () => {
  cartSidebar.classList.add("translate-x-full"); // Hide the sidebar
};

// Event listener to close the cart when the close button is clicked
document.getElementById("close-cart").addEventListener("click", closeCart);

// Function to toggle the cart sidebar visibility
const toggleCart = () => {
  cartSidebar.classList.toggle("translate-x-full"); // Show/hide the sidebar
};

// Function to open the cart sidebar
const openCart = () => {
  cartSidebar.classList.remove("translate-x-full"); // Make sidebar visible
};

// Event listeners to add items to the cart when "Add to Cart" buttons are clicked
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (event) => {
    const buttonClicked = event.target;

    // Disable button to prevent multiple clicks
    buttonClicked.disabled = true;
    buttonClicked.classList.add("opacity-50", "cursor-not-allowed");

    // Fetch item details
    const itemId = event.target.getAttribute("data-id");
    const itemCard = event.target.closest(".p-6");
    const itemName = itemCard.querySelector("h3").innerText;
    const itemPrice = parseFloat(itemCard.querySelector("p").innerText.replace("$", ""));
    const itemImage = itemCard.querySelector("img").getAttribute("src"); // Assuming item card has an image element

    // Add item to cart
    addItemToCart(itemId, itemName, itemPrice, itemImage);
  });
});

// Function to add an item to the cart
const addItemToCart = (id, name, price, imageUrl) => {
  if (!Array.isArray(cart)) cart = []; // Ensure cart is an array

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity if item already exists
  } else {
    cart.push({ id, name, price, quantity: 1, imageUrl }); // Add new item to the cart with image URL

  }
  updateCartUI(); // Refresh the UI
  saveCartToLocalStorage(); // Save to local storage
  openCart(); // Open the cart sidebar after adding an item
};

// Function to update the cart UI
const updateCartUI = () => {
  cartItemsContainer.innerHTML = ""; // Clear previous cart items
  let total = 0;
  let totalItems = 0; // Holds the total number of items

  // Loop through cart items to display each one
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalItems += item.quantity; // Update total items

    // Cart item structure with image, title, price, and quantity controls
    const cartItem = document.createElement("div");
    cartItem.classList.add("flex", "justify-between", "items-center", "py-2");

    cartItem.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded" />
      <div class="flex-grow mx-2">
        <p class="font-medium text-sm text-gray-900">${item.name}</p>
        <p class="text-gray-600 text-xs">$${item.price}</p>
      </div>
      <div class="flex items-center text-sm ">
        <button class="decrease-quantity text-gray-600" data-id="${item.id}">-</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="increase-quantity mr-2 text-gray-600" data-id="${item.id}">+</button>
      </div>
      <div class="flex flex-col justify-between mr-2">
        <button class="delete-item font-medium text-xs text-red-900 border" data-id="${item.id}">DELETE</button>
        <p class="font-medium text-xs mt-2 text-gray-900">$${itemTotal.toFixed(2)}</p>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem); // Add item to the cart container

    // DELETE button event listener
    cartItem.querySelector(".delete-item").addEventListener("click", (event) => {
      const button = event.target;
      deleteItemFromCart(item.id, button); // Pass button to enable it again after deletion
    });
  });

  cartTotal.innerText = `$${total.toFixed(2)}`; // Update the subtotal
  updateCartHeader(totalItems); // Update header with total items count

  // Add event listeners for quantity control buttons
  cartItemsContainer.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      updateItemQuantity(itemId, 1); // Increase quantity
    });
  });

  cartItemsContainer.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      updateItemQuantity(itemId, -1); // Decrease quantity
    });
  });
};

// Function to delete an item from the cart
function deleteItemFromCart(id, button) {
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1); // Remove the item from the cart

    enableAddToCartButton(id);
  }
  
  updateCartUI();
  saveCartToLocalStorage(); // Save updated cart to local storage
}

// Function to enable the "Add to Cart" button
const enableAddToCartButton = (id) => {
  // Find the button associated with the removed item and re-enable it
  const buttonToEnable = document.querySelector(`.add-to-cart[data-id="${id}"]`);
  if (buttonToEnable) {
    buttonToEnable.disabled = false;
    buttonToEnable.classList.remove("opacity-50", "cursor-not-allowed");
  }
}



// Function to update the cart header with total items count
const updateCartHeader = (totalItems) => {
  const cartHeader = document.getElementById("cart-header");
  const cartHeader2 = document.getElementById("cart-header2");
  cartHeader.innerText = ` ${totalItems}`;
  cartHeader2.innerText = ` Items: ${totalItems}`;
}

// Function to update the item quantity in the cart
const updateItemQuantity = (id, change) => {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }
    updateCartUI();
    saveCartToLocalStorage();
  }
}

// Function to save the cart to local storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to load the cart from local storage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  try {
    cart = JSON.parse(savedCart) || []; // Fallback to empty array if parsing fails
  } catch (error) {
    console.error("Error parsing cart data from local storage:", error);
    cart = []; // Fallback to empty array if parsing fails
  }

  cart.forEach((item) => {
    console.log(item);
    const buttonToDisable = document.querySelector(`.add-to-cart[data-id="${item?.id}"]`);
  if (buttonToDisable) {
    buttonToDisable.disabled = true;
    buttonToDisable.classList.add("opacity-50", "cursor-not-allowed");
  }
    
  })

  updateCartUI(); // Update UI with loaded cart data
}


