
function renderProducts(products , productContainer){
productContainer.innerHTML = products.map(product =>{
    return `
        <div class="border border-gray-300 rounded-2xl p-5 ">
        <div class="relative">
        <img class="w-full h-72 object-cover " src="${product.image}" alt="${product.name}">
        <span data-id="${product.id}" class=" wishlist-btn absolute top-1 right-1 bg-white text-slate-900 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:bg-olive-800 hover:text-white"><i class="fa-regular fa-heart"></i></span>
        </div>
        <span class="border border-gray-300 rounded-3xl text-xs px-3 bg-gray-300 font-semibold ">${product.category}</span>
        <h3 class="font-semibold text-slate-900 py-1">${product.name}</h3>
        <p class="text-xs py-1">Our collection brings together modern trends, timeless elegance, and carefully selected pieces designed to make every look feel special.</p>
        <p class="text-md text-olive-500 font-bold pb-2">${product.price} SAR</p>
        <button data-id="${product.id}" class=" cart-btn bg-olive-800 px-6 py-1 rounded-2xl block mx-auto text-white hover:opacity-85 " type="button"><i class="fa-solid fa-cart-shopping mr-2"></i>Add to cart</button>
        </div>
    `;
}).join("");
}


