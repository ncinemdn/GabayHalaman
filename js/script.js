function scrollDown() {
  window.scrollBy({
    top: window.innerHeight,
    behavior: "smooth"
  });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

const cartList = document.getElementById("cartList");
if (cartList) {
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} – ₱${item.price}`;
    cartList.appendChild(li);
  });
}
