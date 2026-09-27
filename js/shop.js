
const productContainer = document.querySelector("#shop-products")
const pagination = document.querySelector("#pagination");
const productModal = document.querySelector(".product-modal");
const modalSizes = productModal.querySelector(".product-sizes");
const modalColors = productModal.querySelector(".product-colors");
const modalClose = productModal.querySelector(".fa-xmark");
const modalCartBtn = productModal.querySelector(".cart-btn");
const sizeTitle = document.querySelector(".select-size")
const noProducts = document.querySelector("#no-products");

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const productsPerPage = 6;
let currentPage = 1;


const filteredCategory = document.querySelectorAll(
    'input[name="category"]'
);

const filteredSize = document.querySelectorAll(
    'input[name="size"]'
)

const filteredBrand = document.querySelectorAll(
    `input[name="brand"]`
)

const minPrice = document.querySelector("#min-price");
const maxPrice = document.querySelector("#max-price");
const minPriceValue = document.querySelector("#min-price-value");
const maxPriceValue = document.querySelector("#max-price-value");
const priceTrack = document.querySelector("#price-track");
const searchInput = document.querySelector("#search-products")
const sortProducts = document.querySelector("#sort-products");

function applyFilters() {

    const selectedMinPrice = Number(minPrice.value);
    const selectedMaxPrice = Number(maxPrice.value);
    const searchValue = searchInput.value.toLowerCase().trim();

    const categorySelected = [...filteredCategory]
    .find(filter => filter.checked)?.value;

    const sizeSelected = [...filteredSize]
    .filter(filter => filter.checked)
    .map(filter => filter.value)

    const brandSelected = [...filteredBrand]
    .filter(filter => filter.checked)
    .map(filter => filter.value)

    const filteredProducts = products.filter(product =>{
        const categoryMatch = 
        !categorySelected || 
        product.category === categorySelected

        const sizeMatch = 
        sizeSelected.length === 0 ||
        sizeSelected.some(size => 
            product.sizes?.includes(size)
        );

        const brandMatch =
        brandSelected.length === 0 ||
        brandSelected.some(brand =>
            product.brand === brand
        )

        const priceMatch =
        product.price >= selectedMinPrice &&
        product.price <= selectedMaxPrice;

        const searchMatch = 
        product.name.toLowerCase().includes(searchValue)||
        product.category.toLowerCase().includes(searchValue) ||
        product.brand.toLowerCase().includes(searchValue)

        return categoryMatch && sizeMatch && priceMatch && brandMatch && searchMatch;
    })


    const sortValue = sortProducts.value;
    if(sortValue === "price-low"){
        filteredProducts.sort((a,b) => a.price - b.price)
    }

    if(sortValue === "price-high"){
        filteredProducts.sort((a,b) => b.price - a.price)
    }

    if (sortValue === "name-a-z"){
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortValue === "name-z-a"){
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }


  if (filteredProducts.length === 0) {
    noProducts.classList.remove("hidden");
    noProducts.classList.add("flex");
    productContainer.classList.add("hidden");
    pagination.innerHTML = "";

    return;
}

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    noProducts.classList.add("hidden");
    noProducts.classList.remove("flex");
    productContainer.classList.remove("hidden");

    renderProducts(productsToShow, productContainer);

    const productButton = document.querySelectorAll("#shop-products .cart-btn")
    let product = null;
    let selectedSize = null;
    let selectedColor = null;

    productButton.forEach(button =>{
        button.addEventListener("click" , ()=>{
        const productId = Number(button.dataset.id);

         product = products.find(
            product => product.id === productId
        )

        selectedColor = null;
        selectedSize = null;

        productModal.classList.remove("hidden")
        modalSizes.textContent = "";
        modalSizes.style.display = "";
        sizeTitle.classList.remove("hidden");

        if(product.sizes && product.sizes.length > 0){

            product.sizes.forEach(size => {

            const sizeButtons = document.createElement("button")

            sizeButtons.textContent = size;

            sizeButtons.className =
                    "flex border border-olive-400 rounded-full w-8 h-8 text-sm items-center justify-center hover:bg-olive-200";
            
            modalSizes.appendChild(sizeButtons);
        });

        const sizeButton = modalSizes.querySelectorAll("button")

        sizeButton.forEach(button => {
            button.addEventListener("click", ()=>{
                sizeButton.forEach(btn =>{
                     btn.classList.remove("bg-olive-800", "text-white");
                });

                button.classList.add("bg-olive-800", "text-white");
                
                selectedSize = button.textContent;
            })
        });
    }
    
    else {
    modalSizes.style.display = "none";
    sizeTitle.classList.add("hidden")
}

modalClose.addEventListener("click" , ()=>{
    productModal.classList.add("hidden")
})

modalColors.innerHTML = "";

if (product.colors && product.colors.length > 0) {

    product.colors.forEach(color => {
        const colorButton = document.createElement("div");

        colorButton.className =
            "flex cursor-pointer border border-olive-400 rounded-full w-8 h-8 items-center justify-center";

        colorButton.classList.add(color.class);

        colorButton.dataset.color = color.name;
        colorButton.dataset.image = color.image;

        modalColors.appendChild(colorButton);
    });

    const colorButtons = modalColors.querySelectorAll("div");

    colorButtons.forEach(button => {
        button.addEventListener("click", () => {

            colorButtons.forEach(btn => {
                btn.classList.remove("ring-1", "ring-olive-800");
            });

            button.classList.add("ring-1", "ring-olive-800");

            selectedColor = button.dataset.color;
        });
    });
}
    
        });
});


modalCartBtn.addEventListener("click" , ()=>{

    if(product.sizes && product.sizes.length > 0 && !selectedSize){
        showToast("Please select size", "remove");
        return;
    }

    if(!selectedColor){
        showToast("please select color" , "remove");
        return;
    }

    const cartExist = cart.find(item =>{
        return(
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    )
    })

    if(cartExist){
        cartExist.quantity +=1;
    }

    else{
        
        const selectedColorData = product.colors.find(
    color => color.name === selectedColor
);
        cart.push({
            ...product,
            cartId: `${product.id}-${selectedSize || ""}-${selectedColor || ""}`,
            image: selectedColorData.image,
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCounts();
    showToast("Added to cart");
    updateCartButtons();
    productModal.classList.add("hidden");
})

    renderPagination(filteredProducts.length);
    initWishlistButtons();
    updateWishlistButtons();
    updateCartButtons();
    }

    sortProducts.addEventListener("change", resetPagination)
    searchInput.addEventListener("input", resetPagination)

    filteredCategory.forEach(filter =>
        filter.addEventListener("change", resetPagination)
    )

    filteredSize.forEach(filter=>{
        filter.addEventListener("change", resetPagination)
    })

    filteredBrand.forEach(filter=>
        filter.addEventListener("change", resetPagination)
    )

    window.addEventListener("load", () => {
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]')
        .forEach(input => {
        input.checked = false;
        });

        if (category) {
        const categoryRadio = document.querySelector(
            `input[name="category"][value="${category}"]`
        );

        if (categoryRadio) {
            categoryRadio.checked = true;
        }
    }

        minPrice.value = minPrice.min;
    maxPrice.value = maxPrice.max;
    updatePriceSlider();
    applyFilters();
    });

    function updatePriceSlider() {
        let min = Number(minPrice.value);
        let max = Number(maxPrice.value);

        if(min > max){
            min = max;
            minPrice.value = min;
        }

        if(max < min){
            max = min;
            maxPrice.value = max;
        }

        minPriceValue.textContent = `SAR ${min}`;
        maxPriceValue.textContent =`SAR ${max}`;

    const minPercent = 
    ((min - Number(minPrice.min))) / 
    (Number(minPrice.max) - Number(minPrice.min)) * 100;


    const maxPercent =
    ((max - Number(maxPrice.min)))/ 
    (Number(maxPrice.max) - Number(maxPrice.min)) * 100;

    priceTrack.style.left = `${minPercent}%`
    priceTrack.style.width = `${maxPercent - minPercent}%`

    }

    minPrice.addEventListener("input", ()=>{
    updatePriceSlider ()
    resetPagination()
    })
    maxPrice.addEventListener("input",()=>{
    updatePriceSlider ()
    resetPagination()
    })

    updatePriceSlider();

    const clearFilters = document.querySelector("#clear-filters")

    clearFilters.addEventListener("click", ()=>{
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]')
        .forEach(input =>{
            input.checked = false;
        })

    minPrice.value = minPrice.min;
    maxPrice.value = maxPrice.max;
    sortProducts.value = ""
    searchInput.value = ""
    updatePriceSlider();
    currentPage = 1;
    applyFilters();

    })


    function renderPagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        pagination.innerHTML = "";

        if (totalPages <= 1) return;


        const previousButton = document.createElement("button");
        previousButton.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;

        previousButton.disabled = currentPage === 1;

        previousButton.addEventListener("click", () => {
            currentPage--;
            applyFilters();
        });

        pagination.appendChild(previousButton);

        for (let page = 1; page <= totalPages; page++) {

            const pageButton = document.createElement("button");

            pageButton.textContent = page;

            pageButton.className =
                "w-8 h-8 rounded-full border border-gray-300";

            if (page === currentPage) {
                pageButton.classList.add("bg-olive-800", "text-white");
            }

            pageButton.addEventListener("click", () => {
                currentPage = page;
                applyFilters();
            });

            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.innerHTML =
            `<i class="fa-solid fa-chevron-right"></i>`;

        nextButton.disabled = currentPage === totalPages;

        nextButton.addEventListener("click", () => {
            currentPage++;
            applyFilters();
        });

        pagination.appendChild(nextButton);
    }


    function resetPagination() {
        currentPage = 1;
        applyFilters();
    }















