const header = document.querySelector("#header");
fetch("./header.html")
    .then(response => response.text())
    .then(data => {
    header.innerHTML = data;
    updateHeaderCounts();
    updateAuthHeader();
    setupLogout();
    searchFieldHeader();
    setupMobileMenu()
    });


function updateHeaderCounts() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlistCount = document.querySelector("#wishlist-count");
    const cartCount = document.querySelector("#cart-count");
    const mobileWishlistCount = document.querySelector("#mobile-wishlist-count");
    const mobileCartCount = document.querySelector("#mobile-cart-count");

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    if (mobileWishlistCount) {
        mobileWishlistCount.textContent = wishlist.length;
    }       

    if (mobileCartCount) {
        mobileCartCount.textContent = cart.length;
    }   
}


function searchFieldHeader() {
    const searchContainers = document.querySelectorAll(".search-field");

    searchContainers.forEach(searchContainer => {
        const searchResult = searchContainer.parentElement.querySelector(
            "#search-results, .mobile-search-results"
        );

        if (!searchResult) return;

        let searchIndex = -1;

        searchContainer.addEventListener("input", () => {
            const searchInputValue = searchContainer.value.toLowerCase().trim();

            if (searchInputValue === "") {
                searchResult.innerHTML = "";
                searchResult.classList.add("hidden");
                searchIndex = -1;
                return;
            }

            const filteredProduct = products.filter(product =>
                product.name.toLowerCase().includes(searchInputValue) ||
                product.category.toLowerCase().includes(searchInputValue)
            );

            if (filteredProduct.length === 0) {
                searchResult.innerHTML = `
                    <p class="px-3 py-2 text-sm text-gray-500">
                        No products found
                    </p>`;
            } else {
                searchResult.innerHTML = filteredProduct.map(product => `
                    <div class="search-result px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"
                         data-id="${product.id}">
                        <div class="w-20 h-20 shrink-0 overflow-hidden rounded-sm">
                            <img src="${product.colors[0].image}"
                                 alt="${product.name}"
                                 class="w-full h-full object-cover">
                        </div>
                        ${product.name}
                    </div>
                `).join("");

                searchResult.querySelectorAll(".search-result").forEach(item => {
                    item.addEventListener("click", () => {
                        const productId = Number(item.dataset.id);
                        window.location.href = `product-details.html?id=${productId}`;
                    });
                });
            }

            searchResult.classList.remove("hidden");
            searchIndex = -1;
        });

        searchContainer.addEventListener("keydown", event => {
            const resultItems = searchResult.querySelectorAll(".search-result");

            if (!resultItems.length) {
                if (event.key === "Escape") {
                    searchResult.classList.add("hidden");
                }
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                searchIndex = (searchIndex + 1) % resultItems.length;
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                searchIndex = (searchIndex - 1 + resultItems.length) % resultItems.length;
            } else if (event.key === "Enter" && resultItems[searchIndex]) {
                event.preventDefault();
                resultItems[searchIndex].click();
                return;
            } else if (event.key === "Escape") {
                searchResult.classList.add("hidden");
                return;
            }

            resultItems.forEach(item => item.classList.remove("bg-gray-100"));

            if (resultItems[searchIndex]) {
                resultItems[searchIndex].classList.add("bg-gray-100");
            }
        });
    });
}

function updateAuthHeader() {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const loginLink = document.querySelector("#login-link");
    const registerLink = document.querySelector("#register-link");
    const userInfo = document.querySelector("#user-info");
    const userName = document.querySelector("#user-name");
    const mobileLoginLink = document.querySelector("#mobile-login-link");
    const mobileRegisterLink = document.querySelector("#mobile-register-link");
    const mobileUserInfo = document.querySelector("#mobile-user-info");
    const mobileUserName = document.querySelector("#mobile-user-name");
    const mobileAccountIcon = document.querySelector("#mobile-account-icon");

    if (token && user) {
        loginLink.classList.add("hidden");
        registerLink.classList.add("hidden");

        userInfo.classList.remove("hidden");
        userInfo.classList.add("flex");
        userName.textContent = `Hi, ${user.name}`;

        mobileLoginLink.classList.add("hidden");
        mobileRegisterLink.classList.add("hidden");

        mobileUserInfo.classList.remove("hidden");
        mobileUserInfo.classList.add("flex");

        mobileAccountIcon.classList.remove("hidden");

    } else {
        loginLink.classList.remove("hidden");
        registerLink.classList.remove("hidden");

        userInfo.classList.add("hidden");
        userInfo.classList.remove("flex");

        mobileLoginLink.classList.remove("hidden");
        mobileRegisterLink.classList.remove("hidden");

        mobileUserInfo.classList.add("hidden");
        mobileUserInfo.classList.remove("flex");

        mobileAccountIcon.classList.add("hidden");
    }
}

function setupLogout() {
    const logoutButtons = document.querySelectorAll(
        "#logout-btn, #mobile-logout-btn"
    );

    logoutButtons.forEach(button => {
        button.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            window.location.href = "index.html";
        });
    });
}

function setupMobileMenu() {
    const menuToggle = document.querySelector("#menu-toggle");
    const mobileDropdown = document.querySelector("#mobile-dropdown");

    if (!menuToggle || !mobileDropdown) return;

    menuToggle.addEventListener("click", () => {
        const isHidden = mobileDropdown.classList.toggle("hidden");

        menuToggle.setAttribute("aria-expanded", String(!isHidden));
    });
}