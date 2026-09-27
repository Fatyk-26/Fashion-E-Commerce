
const wishlistContainer = document.querySelector("#wishlist-products");
const wishlistEmpty = document.querySelector("#wishlist-empty")
const removeAllWishlist = document.querySelector("#remove-all-wishlist")

function updateWishlistState(){
    if (wishlist.length === 0){
        wishlistEmpty.classList.remove("hidden")
    }

    else{
        wishlistEmpty.classList.add("hidden")
    }
}
updateWishlistState();

wishlistContainer.innerHTML = wishlist.map(product => {
    return `
        <div class="  wishlist-card flex gap-2 border border-gray-300 rounded-2xl p-2 items-center hover:transition-transform duration-100 hover:scale-102 ">
            <a href="product-details.html?id=${product.id}" >
            <img src="${product.image}" alt="${product.name}" 
             class="w-28 h-28 object-cover rounded-xl">
             </a>
            <div class="flex flex-col gap-2 flex-1">
            <p class="border border-gray-300 rounded-3xl text-xs bg-gray-300 font-semibold w-fit px-3">
                ${product.category}</p>
                <a href="product-details.html?id=${product.id}">
                <h3 class="font-semibold text-slate-900">${product.name}</h3></a>
                <p class="text-md text-olive-600 font-semibold pl-1">${product.price} SAR </p>
            </div>
             <button data-id="${product.id}"  data-color="${product.color}"  class="remove-btn text-slate-500 hover:text-red-600 transition-colors self-start p-2"
             type="button" aria-label="Remove ${product.name} from wishlist">
             <i class="fa-regular fa-trash-can "></i>
             </button>
        </div>
    `;
}).join("");


removeAllWishlist.addEventListener("click", () => {

    if(wishlist.length === 0){
        showToast("There are no products to remove" , "remove")
    }
else{


    wishlist = [];
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    wishlistContainer.innerHTML = "";
    updateHeaderCounts();
    updateWishlistState();
    showToast("All items removed from wishlist", "remove");
}
});


const removeButton= document.querySelectorAll(".remove-btn");
removeButton.forEach( button =>{
    button.addEventListener("click" , () =>{
        const productId = Number(button.dataset.id)
        const color = button.dataset.color;
        wishlist = wishlist.filter( product => product.id !== productId || product.color !== color)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        button.closest(".wishlist-card").remove();
        showToast("Item removed from wishlist", "remove")
        updateHeaderCounts();
        updateWishlistState();
    })
})






