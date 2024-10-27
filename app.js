// Function to toggle the visibility of the mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden");
}

// Cart-related variables and elements
const cart = []; // Array to store items added to the cart
const cartSidebar = document.getElementById("cart-sidebar"); // Sidebar element for the cart
const cartItemsContainer = document.getElementById("cart-items-container"); // Container for items in the cart
const cartTotal = document.getElementById("cart-total"); // Element to display total cart amount

// Function to open the cart sidebar
function openCart() {
  cartSidebar.classList.remove("translate-x-full"); // Removes 'translate-x-full' to make sidebar visible
}

// Function to close the cart sidebar
function closeCart() {
  cartSidebar.classList.add("translate-x-full"); // Adds 'translate-x-full' to hide the sidebar
}

// Function to open the cart sidebar
function openCart() {
  cartSidebar.classList.remove("translate-x-full"); // Removes 'translate-x-full' to make sidebar visible
}

// Event listener to close the cart when the close button is clicked
document.getElementById("close-cart").addEventListener("click", closeCart);

// Event listener to open the cart when the cart button is clicked
document.getElementById("open-cart-button").addEventListener("click", openCart);

// Adds event listeners to all "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (event) => {
    // Disable the button to prevent multiple clicks
    button.disabled = true;
    button.classList.add("opacity-50"); // Optional: to visually indicate the button is disabled

    // Fetch item details
    const itemId = event.target.getAttribute("data-id");
    const itemCard = event.target.closest(".p-6");
    const itemName = itemCard.querySelector("h3").innerText;
    const itemPrice = parseFloat(
      itemCard.querySelector("p").innerText.replace("$", "")
    );

    // Example of how to add an item to the cart with image URL
    const itemImage = itemCard.querySelector("img").getAttribute("src"); // Assuming you have an image element in your item card
    addItemToCart(itemId, itemName, itemPrice, itemImage);
  });
});

// Function to add an item to the cart
function addItemToCart(id, name, price, imageUrl) {
  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity if item already exists
  } else {
    cart.push({ id, name, price, quantity: 1, imageUrl }); // Add new item to the cart with image URL
  }
  updateCartUI(); // Refresh the UI
  openCart(); // Open the cart sidebar after adding an item
}



function updateCartUI() {

  cartItemsContainer.innerHTML = ""; // Clear previous cart items
  let total = 0;
  let totalItems = 0; // Variable to hold the total number of items

  // Loop through cart items to display each one
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalItems += item.quantity; // Update totalItems with the quantity of the current item

    // Cart item HTML structure with image, title, price, and quantity controls
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
        <p class="font-medium text-sm text-gray-900">$${itemTotal.toFixed(2)}</p>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem); // Add the item to the cart container


    // Update the event listener for DELETE button in updateCartUI
cartItem.querySelector(".delete-item").addEventListener("click", (event) => {
  const button = event.target; // Get the button element that was clicked
  deleteItemFromCart(item.id, button); // Pass the button to enable it again after deletion
});


  });

  cartTotal.innerText = `$${total.toFixed(2)}`; // Update the subtotal
  updateCartHeader(totalItems); // Update the header with the total items count

  // Add event listeners for increase and decrease buttons
  cartItemsContainer
    .querySelectorAll(".increase-quantity")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.getAttribute("data-id");
        updateItemQuantity(itemId, 1); // Increase quantity
      });
    });

  cartItemsContainer
    .querySelectorAll(".decrease-quantity")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.getAttribute("data-id");
        updateItemQuantity(itemId, -1); // Decrease quantity
      });
    });
}




// Function to delete an item from the cart
function deleteItemFromCart(id, button) {
  // Find the index of the item to delete
  const itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1); // Remove the item from the cart
  }

  // Enable the button after deletion
  if (button) {
    button.disabled = false;
    button.classList.remove("opacity-50"); // Optional: to visually indicate the button is re-enabled
  }
  
  updateCartUI(); // Refresh the UI after deletion
}



// Optionally, update the header showing total items in cart
function updateCartHeader(totalItems) {
  const cartHeader = document.getElementById("cart-header");
  cartHeader.innerText = totalItems; // Update the total items count in the header
}

// Function to update the cart header
function updateCartHeader(totalItems) {
  const cartHeader = document.getElementById("cart-header");
  const cartHeader2 = document.getElementById("cart-header2");
  cartHeader.innerText = ` ${totalItems}`;
  cartHeader2.innerText = ` Items: ${totalItems}`;
}

// Function to update the item quantity in the cart
function updateItemQuantity(id, change) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += change; // Adjust quantity
    if (item.quantity <= 0) {
      // Remove item from cart if quantity is 0
      cart.splice(cart.indexOf(item), 1);
    }
    updateCartUI(); // Refresh the UI
  }
}
