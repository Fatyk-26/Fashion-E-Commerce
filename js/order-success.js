
const orderNumber = document.querySelector("#order-number");
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (orderId) {
    orderNumber.textContent = orderId;
} else {
    orderNumber.textContent = "Order confirmation";
}
