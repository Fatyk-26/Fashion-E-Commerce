
const productContainer = document.querySelector("#featured-products")
renderProducts(products , productContainer)
initWishlistButtons();
updateWishlistButtons();
initCartButtons();
updateCartButtons();

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

    renderProducts(filteredProducts, productContainer)
    initWishlistButtons();
    updateWishlistButtons();
    initCartButtons();
    updateCartButtons();
    }

sortProducts.addEventListener("change", applyFilters)

searchInput.addEventListener("input", applyFilters)


filteredCategory.forEach(filter =>
    filter.addEventListener("change", applyFilters)
)

filteredSize.forEach(filter=>{
    filter.addEventListener("change", applyFilters)
})

filteredBrand.forEach(filter=>
    filter.addEventListener("change", applyFilters)
)

window.addEventListener("load", () => {
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]')
    .forEach(input => {
      input.checked = false;
    });

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
   applyFilters()
})
maxPrice.addEventListener("input",()=>{
updatePriceSlider ()
   applyFilters()
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
  applyFilters();

})





















