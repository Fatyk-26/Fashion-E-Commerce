
function renderProducts(products , productContainer){
productContainer.innerHTML = products.map(product =>{
    return `
        <div class="border border-gray-300 rounded-2xl p-5 ">
        <div class="relative">
        <a href="product-details.html?id=${product.id}">
        <img class="w-full h-60 object-cover " src="${product.colors[0].image}" alt="${product.name}">
        </a>
        <span data-id="${product.id}" data-color="${product.colors[0].name}" class=" wishlist-btn absolute top-1 right-1 bg-white text-slate-900 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:bg-olive-800 hover:text-white">
        <i class="fa-regular fa-heart"> </i>
        </span>
        </div>
        <span class="border border-gray-300 rounded-3xl text-xs px-3 bg-gray-300 font-semibold ">${product.category}</span>
        <h3 class="font-semibold text-slate-900 py-1">${product.name}</h3>
        <div class="product-rating text-sm text-yellow-300 flex gap-1 py-1 "></div>
        <p class="text-xs py-1">Our collection brings together modern trends, timeless elegance, and carefully selected pieces designed to make every look feel special.
        </p>
        <p class="text-md text-olive-500 font-bold pb-2">${product.price} SAR</p>
        <button data-id="${product.id}" class=" cart-btn bg-olive-800 px-6 py-1 rounded-2xl block mx-auto text-white hover:opacity-85 " type="button">
        <i class="fa-solid fa-cart-shopping mr-2"></i>
        Add to cart
        </button>
        </div>
    `;
}).join("");

const ratingContainer = productContainer.querySelectorAll(".product-rating")
ratingContainer.forEach((container, index ) =>{
    renderRating(products[index].rating, container)
});

}

function renderRating(rating, container) {
    container.innerHTML = "";
    for(let i = 1; i <= 5; i++){
        const star = document.createElement("i");

        if(i <= rating){
            star.className = "fa-solid fa-star";
        } else {
            star.className = "fa-regular fa-star";
        }

        container.appendChild(star);
    }
}

