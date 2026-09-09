
const wishlistContainer = document.querySelector("#wishlist-products");
wishlistContainer.innerHTML = wishlist.map(product => {
    return `
        <div class="  wishlist-card flex border border-gray-300 rounded-2xl p-2 items-center hover:transition-transform duration-100 hover:scale-102 ">
            <img src="${product.image}" alt="${product.name}" class="w-28 h-28 object-contain rounded-xl">
            <div class="flex flex-col gap-2 flex-1">
            <p class="border border-gray-300 rounded-3xl text-xs bg-gray-300 font-semibold w-fit px-3">
                ${product.category}</p>
                <h3 class="font-semibold text-slate-900">${product.name}</h3>
                <p class="text-md text-olive-600 font-semibold pl-1">${product.price} SAR </p>
            </div>
             <button data-id="${product.id}" class="remove-btn text-slate-500 hover:text-red-600 transition-colors self-start p-2"
             type="button" label="Remove ${product.name} from wishlist">
             <i class="fa-regular fa-trash-can "></i>
             </button>
        </div>
    `;
}).join("");


const removeButton= document.querySelectorAll(".remove-btn");
removeButton.forEach( button =>{
    button.addEventListener("click" , () =>{
        const productId = Number(button.dataset.id)
        wishlist = wishlist.filter( product => product.id !== productId)
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        button.closest(".wishlist-card").remove();
         showToast("Item removed from wishlist", "remove")
        updateHeaderCounts();
    })
})






