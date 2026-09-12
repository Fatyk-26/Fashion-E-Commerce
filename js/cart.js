
const cartMain = document.querySelector("#cart-products")
const cartEmpty = document.querySelector("#cart-empty")

function updateCartEmptyState() {
    if (cart.length === 0) {
        cartEmpty.classList.remove("hidden");
    } else {
        cartEmpty.classList.add("hidden");
    }
}
updateCartEmptyState()
cartMain.innerHTML = cart.map (product =>{
   return `
    <div class="cart-card grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b border-gray-200 py-3">
        <div class="flex items-center gap-3">
    <img 
        src="${product.image}" 
        alt="${product.name}" 
        class="w-20 h-20 object-contain rounded-xl"
    >

    <div class="flex flex-col">
        <h3 class="font-semibold text-slate-900">
            ${product.name}
        </h3>

        <div class="flex flex-col gap-2 text-xs text-gray-500 mt-1">
            <span>Color: ${product.color || ""}</span>
            ${product.size ? `<span>Size: ${product.size}</span>` : ""}
        </div>
    </div>
</div>

     
        <p class="text-sm text-olive-600 font-semibold"> ${product.price} SAR
        </p>

        <div>
            <div class="w-24 border rounded-xl text-sm font-semibold flex items-center justify-evenly py-1">
                <button class="decrease-btn"  data-id="${product.id}"
                type="button"> -
                </button>

                <span class="quantity-value"> ${product.quantity}
                </span>

                <button class="increase-btn" data-id="${product.id}"
                    type="button"> +
                </button>
            </div>
        </div>

    
        <div class="flex items-center justify-between gap-3">
            <p class="subtotal-section text-sm font-semibold"> ${product.price * product.quantity} SAR
            </p>

            <button data-cart-id="${product.cartId}" class="removeCart-btn text-slate-500 hover:text-red-600 transition-colors"
                type="button"  aria-label="Remove ${product.name} from cart">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    </div>
`;
}).join("");

updateCartTotal();

const removeCart = document.querySelectorAll(".removeCart-btn")
removeCart.forEach(button =>{
    button.addEventListener("click", ()=>{
       const cartId = button.dataset.cartId
       cart = cart.filter(product => product.cartId !== cartId)
        console.log(cart)
        localStorage.setItem("cart", JSON.stringify(cart))
        button.closest(".cart-card").remove();

showToast("Item removed from cart", "remove");
updateHeaderCounts();
updateCartTotal();
updateCartEmptyState();
    })
})


const increaseQuntity = document.querySelectorAll(".increase-btn");
const decreaseQuantity = document.querySelectorAll(".decrease-btn");
increaseQuntity.forEach(button =>{
    button.addEventListener("click", ()=>{
        const productId = Number(button.dataset.id)
        const product = cart.find (product => product.id === productId)
        product.quantity++;
        const mainCard = button.closest(".cart-card");
        const quantityElement = mainCard.querySelector(".quantity-value");
        quantityElement.textContent = product.quantity
        const subTotal = mainCard.querySelector(".subtotal-section")
        subTotal.textContent = `${product.price * product.quantity} SAR `
        localStorage.setItem("cart", JSON.stringify(cart))
        updateCartTotal()
    })

})


decreaseQuantity.forEach(button=>{
    button.addEventListener("click", ()=>{
    const productId = Number(button.dataset.id)
    const product = cart.find (product => product.id === productId)
    if(product.quantity > 1){
      product.quantity--;  
    }
    const mainCard = button.closest(".cart-card");
    const quantityElement = mainCard.querySelector(".quantity-value");
    quantityElement.textContent = product.quantity
    const subTotal = mainCard.querySelector(".subtotal-section")
    subTotal.textContent = `${product.price * product.quantity} SAR`
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartTotal()
})
})


function updateCartTotal() {

    const subtotal = cart.reduce((accumulator, product) => {
        return accumulator + (product.price * product.quantity);
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;
    const cartSubtotal = document.querySelector("#cart-subtotal");
    const cartTotal = document.querySelector("#cart-total");
    cartSubtotal.textContent = `${subtotal} SAR`;
    cartTotal.textContent = `${total} SAR`;
}


      

       

    