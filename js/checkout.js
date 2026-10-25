
const checkoutForm = document.querySelector("#checkout-form");
const checkoutItems = document.querySelector("#checkout-items");
const checkoutEmpty = document.querySelector("#checkout-empty");
const checkoutTotals = document.querySelector("#checkout-totals");
const checkoutError = document.querySelector("#checkout-error");
const checkoutSuccess = document.querySelector("#checkout-success");
const placeOrderBtn = document.querySelector("#place-order-btn");
const fullNameInput = document.querySelector("#full-name");
const checkoutEmailInput = document.querySelector("#checkout-email");

const API_URL = "https://fashion-e-commerce-4le4.onrender.com/api";

async function fillUserInformation() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        sessionStorage.setItem("redirectAfterLogin", "checkout.html");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.setItem("redirectAfterLogin", "checkout.html");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load your account information.");
        }

        const data = await response.json();
        const user = data.user;

        fullNameInput.value = user.name || "";
        checkoutEmailInput.value = user.email || "";
        document.querySelector("#phone").value = user.phone || "";
        document.querySelector("#address").value =
            user.address?.street || "";
        document.querySelector("#city").value =
            user.address?.city || "";

    } catch (error) {
        console.error("Checkout profile error:", error);

        checkoutError.textContent =
            "Unable to load your account information. Please refresh the page.";

        checkoutError.classList.remove("hidden");
    }
}

function renderCheckout() {
    const currentCart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const hasItems = currentCart.length > 0;

    checkoutEmpty.classList.toggle("hidden", hasItems);
    checkoutTotals.classList.toggle("hidden", !hasItems);
    checkoutForm.classList.toggle("hidden", !hasItems);

    if (!hasItems) {
        checkoutItems.innerHTML = "";
        document.querySelector("#checkout-subtotal").textContent = "0 SAR";
        document.querySelector("#checkout-total").textContent = "0 SAR";

        return;
    }

    checkoutItems.innerHTML = currentCart.map(item => `
        <div class="flex items-center gap-3">
            <div class="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="64"
                    height="64"
                    class="w-16 h-16 object-contain"
                    loading="lazy">
            </div>

            <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">
                    ${item.name}
                </p>

                <p class="text-xs text-gray-500 mt-1">
                    Qty: ${item.quantity}
                </p>

                ${item.color ? `
                    <p class="text-xs text-gray-500">
                        Color: ${item.color}
                    </p>
                ` : ""}

                ${item.size ? `
                    <p class="text-xs text-gray-500">
                        Size: ${item.size}
                    </p>
                ` : ""}
            </div>

            <p class="text-sm font-semibold whitespace-nowrap">
                ${(Number(item.price) * Number(item.quantity)).toFixed(2)} SAR
            </p>
        </div>
    `).join("");

    const subtotal = currentCart.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    document.querySelector("#checkout-subtotal").textContent =
        `${subtotal.toFixed(2)} SAR`;

    document.querySelector("#checkout-total").textContent =
        `${subtotal.toFixed(2)} SAR`;
}

checkoutForm.addEventListener("submit", async event => {
    event.preventDefault();

    checkoutError.classList.add("hidden");
    checkoutSuccess.classList.add("hidden");

    const currentCart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (currentCart.length === 0) {
        checkoutError.textContent = "Your cart is empty.";
        checkoutError.classList.remove("hidden");
        renderCheckout();
        return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
        sessionStorage.setItem("redirectAfterLogin", "checkout.html");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData(checkoutForm);

    const shippingAddress = {
        name: (formData.get("name") || "").trim(),
        phone: (formData.get("phone") || "").trim(),
        address: (formData.get("address") || "").trim(),
        city: (formData.get("city") || "").trim()
    };

    const paymentMethod = formData.get("paymentMethod");

    if (
        !shippingAddress.name ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city
    ) {
        checkoutError.textContent =
            "Please complete all shipping information.";

        checkoutError.classList.remove("hidden");
        return;
    }

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing Order...";

    try {
        const addressResponse = await fetch(`${API_URL}/auth/address`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                phone: shippingAddress.phone,
                country: "Saudi Arabia",
                city: shippingAddress.city,
                street: shippingAddress.address,
            })
        });

        const addressData = await addressResponse.json();
        if (addressResponse.status === 401 ||
            addressResponse.status === 403) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.setItem("redirectAfterLogin", "checkout.html");
            window.location.href = "login.html";
            return;
        }

        if (!addressResponse.ok) {
            throw new Error(
                addressData.message || "Failed to save shipping address."
            );
        }

        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                items: currentCart.map(item => ({
                    id: item.id,
                    quantity: Number(item.quantity),
                    color: item.color || "",
                    size: item.size || "",
                    image: item.image || ""
                })),
                shippingAddress,
                paymentMethod
            })
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.setItem("redirectAfterLogin", "checkout.html");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Could not place your order.");
        }
        
        localStorage.setItem("cart", JSON.stringify([]));

        if (typeof cart !== "undefined" && Array.isArray(cart)) {
            cart.length = 0;
        }

        if (typeof updateHeaderCounts === "function") {
            updateHeaderCounts();
        }

        window.location.href =
            `order-success.html?id=${encodeURIComponent(data.order._id)}`;

    } catch (error) {
        console.error("Checkout error:", error);

        checkoutError.textContent =
            error.message || "Something went wrong. Please try again.";

        checkoutError.classList.remove("hidden");

    } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Place Order";
    }
});

fillUserInformation();
renderCheckout();
