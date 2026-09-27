
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function initWishlistButtons() {
const wishListBtn = document.querySelectorAll(".wishlist-btn")
wishListBtn.forEach(item =>{
    item.addEventListener("click", ()=>{
    const productId = Number(item.dataset.id);
    const color = item.dataset.color;
   const product = products.find(
    product => product.id === productId
);

if (!product) return;
    const exist = wishlist.some(
    productItem => productItem?.id === productId &&
    productItem?.color === color
);

 const heartIcon = item.querySelector("i");

    if (!exist){
        const selectedColor = product.colors.find(
            productColor => productColor.name === color,
            
        )

        console.log(productId, color);
        wishlist.push({
            ...product,
            color: color,
            image: selectedColor.image

        });
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
        showToast("Added to wishlist")
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        updateHeaderCounts();
    } 

    else{

    wishlist = wishlist.filter (
        product => product.id !== productId ||
        product.color !== color
    )

    heartIcon.classList.remove("fa-solid")
    heartIcon.classList.add("fa-regular")
    showToast("Removed from wishlist", "remove")
    localStorage.setItem( "wishlist" ,  JSON.stringify(wishlist))
    updateHeaderCounts()
    }
})
}) }


function updateWishlistButtons(){

const wishlistButtons = document.querySelectorAll(".wishlist-btn")

wishlistButtons.forEach(button =>{
    const productID = Number(button.dataset.id)
     const color = button.dataset.color;
    const heartIcon = button.querySelector("i")

    const exist = wishlist.some(
        product => product.id === productID &&
        product.color === color

    )

    if (exist){
        heartIcon.classList.remove("fa-regular")
        heartIcon.classList.add("fa-solid")
    }

    else{
        heartIcon.classList.remove("fa-solid")
        heartIcon.classList.add("fa-regular")
    }

})

}

const toastContainer = document.querySelector("#toast-container")
console.log(toastContainer);
function showToast(message, type ="add", duration = 2000) {
const toast = document.createElement("div")
toast.classList.add(
        "bg-white", "border", "border-gray-200", "shadow-lg", "rounded-xl",
        "px-10", "py-3", "text-md", "font-semibold",
        "opacity-0", "translate-y-2", "transition-all", "duration-300"
    );

       if (type === "remove") {
        toast.classList.add("text-red-600");
    } else {
        toast.classList.add("text-lime-600");
    }

    toastContainer.appendChild(toast);
toast.textContent = message;

    setTimeout(() => {
        toast.classList.remove("opacity-0", "translate-y-2");
    }, 10);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        toast.addEventListener("transitionend", () => {
            toast.remove();
        });

    }, duration);
} 

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function initCartButtons(){
const cartContainer = document.querySelectorAll(".cart-btn")
cartContainer.forEach(button =>{
    button.addEventListener("click", ()=>{
        const cartId = Number(button.dataset.id)
        const cartItem = products.find(
          cartItem => cartItem.id === cartId  
        ) 

        if (!cartItem) return;
    
    const cartExist = cart.some(
        cartProduct => cartProduct.id === cartId
    )

    if(!cartExist){
        cart.push({
            ...cartItem,
            quantity: 1
        });
        localStorage.setItem("cart", JSON.stringify(cart))
        updateHeaderCounts(); 
        showToast("Added to cart")
        button.textContent = "Added to Cart ";
        button.classList.remove("bg-olive-800");
        button.classList.add("bg-olive-500");  
    }
})
})
}


function updateCartButtons() {
    const cartButtons = document.querySelectorAll(".cart-btn");
    cartButtons.forEach(button => {
        const productId = Number(button.dataset.id);

        const cartExist = cart.some(
            product => product.id === productId
        );

        if (cartExist) {
            button.textContent = "Added to Cart";
            button.classList.remove("bg-olive-800");
            button.classList.add("bg-olive-500");
        }
    });
}