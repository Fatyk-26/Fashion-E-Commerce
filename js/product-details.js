const params = new URLSearchParams(window.location.search)
const productId = Number(params.get("id"));
const currentProduct = products.find(product => product.id === productId)
const productName = document.querySelector(".product-name");
const productPrice = document.querySelector(".product-price");
const productRating = document.querySelector(".product-rating");
const productMainImage = document.querySelector(".product-main-image");
const productThumbnails = document.querySelectorAll(".product-thumbnail");
const productSizes = document.querySelector(".product-sizes");
const productColors = document.querySelector(".product-colors");
const productDescription = document.querySelector(".product-description");




if(currentProduct){
    const wishlistBtn = document.querySelector(".wishlist-btn");
wishlistBtn.dataset.id = currentProduct.id;
    productName.textContent = currentProduct.name;
    productPrice.textContent = `${currentProduct.price} SAR`

    productMainImage.src = currentProduct.image;
    productMainImage.alt = currentProduct.name;

    productDescription.textContent = currentProduct.description;

    productRating.innerHTML = ""

    for(let i= 1 ; i<= 5 ; i++){
        const star = document.createElement("i")

        if(i <= currentProduct.rating){
             star.className = "fa-solid fa-star";
        } else {
           star.className = "fa-regular fa-star";
        }

        productRating.appendChild(star)
    }

    let selectedSize = null;
    productSizes.innerHTML ="";

    if(currentProduct.sizes){
        currentProduct.sizes.forEach(size =>{
            const sizeButton = document.createElement("button")
             sizeButton.textContent = size;
             sizeButton.className =
              "flex border border-olive-400 rounded-full w-8 h-8 text-sm items-center justify-center hover:bg-olive-200";
              productSizes.appendChild(sizeButton);
        })
    }

    const sizeButtons = document.querySelectorAll(".product-sizes button");

sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(btn => {
            btn.classList.remove("bg-olive-800", "text-white");
        });

        button.classList.add("bg-olive-800", "text-white");

        selectedSize = button.textContent;
    });
});


let selectedColor = null;
    productColors.innerHTML = "";
    
    if(currentProduct.colors){

    currentProduct.colors.forEach(color => {
    const colorButton = document.createElement("div");

    colorButton.className =
    "flex cursor-pointer border border-olive-400 rounded-full w-8 h-8 text-sm items-center justify-center";

    colorButton.classList.add(color.class);

    colorButton.dataset.color = color.name;
    colorButton.dataset.image = color.image;

    productColors.appendChild(colorButton);

    });
}

const colorButtons = document.querySelectorAll(".product-colors > div");

colorButtons.forEach(button => {
    button.addEventListener("click", () => {

        const image = button.dataset.image;
        const color = button.dataset.color;

        productMainImage.src = image;
         selectedColor = color;
    });
});

productThumbnails.forEach(thumbnail => {
thumbnail.src = currentProduct.image;
thumbnail.alt = currentProduct.name;
});

productThumbnails.forEach(thumbnail =>
    thumbnail.addEventListener("click" ,()=>{
productMainImage.src = thumbnail.src;
    })

)

const cartBtn = document.querySelector(".cart-btn");

cartBtn.addEventListener("click", () => {

    if (!selectedSize || !selectedColor) {
        showToast("Please select size and color", "remove");
        return;
    }

   const cartExist = cart.some(
    item =>
        item.id === currentProduct.id &&
        item.size === selectedSize &&
        item.color === selectedColor
);

    if (!cartExist) {

        cart.push({
            ...currentProduct,
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        updateHeaderCounts();
        showToast("Added to cart");

        cartBtn.textContent = "Added to Cart";
        cartBtn.classList.remove("bg-olive-800");
        cartBtn.classList.add("bg-olive-500");
    }
});


}


initWishlistButtons();
updateWishlistButtons();
