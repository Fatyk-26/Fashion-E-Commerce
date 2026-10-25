
const ordersLoading = document.querySelector("#orders-loading");
const ordersError = document.querySelector("#orders-error");
const ordersEmpty = document.querySelector("#orders-empty");
const ordersList = document.querySelector("#orders-list");

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatPrice(price) {
    return `${Number(price).toFixed(2)} SAR`;
}

function getStatusStyle(status) {
    const styles = {
        pending: "bg-yellow-50 text-yellow-700",
        confirmed: "bg-blue-50 text-blue-700",
        processing: "bg-purple-50 text-purple-700",
        shipped: "bg-indigo-50 text-indigo-700",
        delivered: "bg-green-50 text-green-700",
        cancelled: "bg-red-50 text-red-700"
    };

    return styles[status] || "bg-gray-100 text-gray-700";
}

async function loadOrders() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        sessionStorage.setItem("redirectAfterLogin", "orders.html");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            "https://fashion-e-commerce-4le4.onrender.com/api/orders/my-orders",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.setItem("redirectAfterLogin", "orders.html");

            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Unable to load your orders.");
        }

        const orders = data.orders || [];

        ordersLoading.classList.add("hidden");

        if (orders.length === 0) {
            ordersEmpty.classList.remove("hidden");
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <article class="bg-white border border-gray-200 rounded-2xl p-5 md:p-7">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
                    <div>
                        <p class="text-sm text-gray-500">Order Number</p>
                        <p class="font-semibold text-slate-900 mt-1 break-all">
                            ${order._id}
                        </p>
                        <p class="text-sm text-gray-500 mt-2">
                            ${formatDate(order.createdAt)}
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <span class="inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(order.orderStatus)}">
                            ${order.orderStatus}
                        </span>

                        <span class="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700">
                            ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                        </span>
                    </div>
                </div>

                <div class="py-5 flex flex-col gap-4">
                    ${order.items.map(item => `
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 shrink-0 rounded-lg bg-gray-50 overflow-hidden">
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                    class="w-full h-full object-contain">
                            </div>

                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-slate-900">
                                    ${item.name}
                                </p>

                                <p class="text-sm text-gray-500 mt-1">
                                    Qty: ${item.quantity}
                                    ${item.color ? ` · Color: ${item.color}` : ""}
                                    ${item.size ? ` · Size: ${item.size}` : ""}
                                </p>
                            </div>

                            <p class="text-sm font-semibold whitespace-nowrap">
                                ${formatPrice(item.price * item.quantity)}
                            </p>
                        </div>
                    `).join("")}
                </div>

                <div class="border-t border-gray-100 pt-5 flex justify-between items-center gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Total Amount</p>
                        <p class="text-lg font-bold text-slate-900 mt-1">
                            ${formatPrice(order.total)}
                        </p>
                    </div>

                    <p class="text-sm text-gray-500">
                        Payment: ${order.paymentStatus}
                    </p>
                </div>
            </article>
        `).join("");

    } catch (error) {
        ordersLoading.classList.add("hidden");
        ordersError.textContent = error.message;
        ordersError.classList.remove("hidden");
    }
}

loadOrders();
