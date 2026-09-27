const productContainer = document.querySelector("#featured-products")
const featuredProducts = products.slice(0, 6);
renderProducts(featuredProducts , productContainer)

const cartButtons = productContainer.querySelectorAll(".cart-btn");

cartButtons.forEach(button => {
    button.remove();
});

initWishlistButtons();
updateWishlistButtons();

let subscribers = JSON.parse(localStorage.getItem("subscribers")) || []
const emailInput = document.querySelector("#email-input")
const subscribeForm = document.querySelector(".subscribe-form")
const returnMsg = document.querySelector(".error-msg")

function newsSubscribe(){
   const email = emailInput.value.trim();
   if (email === ""){
    return "The field is empty, please enter your email!"
   }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    return "Please enter valid email address";
}

const emailExist = subscribers.includes(email);

if(emailExist){
    return "This email is already subscribed!";
}

    subscribers.push(email)
    localStorage.setItem("subscribers", JSON.stringify(subscribers))
    showToast("Subscribed Successfully!");
    emailInput.value= "";
    return "";
}

subscribeForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    const subscribemsg = newsSubscribe()
    returnMsg.textContent = subscribemsg
})











































