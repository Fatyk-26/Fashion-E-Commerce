const params = new URLSearchParams(window.location.search)
const productId = Number(params.get("id"));
const currentProduct = products.find(product => product.id === productId)
const productName = document.querySelector(".product-name");
const productPrice = document.querySelector(".product-price");
const productRating = document.querySelector(".product-rating");
const productMainImage = document.querySelector(".product-main-image");
const productThumbnails = document.querySelectorAll(".product-thumbnail");
const productSizes = document.querySelector(".product-sizes");
const parentSize = document.querySelector(".parent-size")
const sizeLine = document.querySelector(".size-line")
const productColors = document.querySelector(".product-colors");
const productDescription = document.querySelector(".product-description");
const productSizeField = document.querySelector(".product-size-field");
const productColorField = document.querySelector(".product-color-field");
const sizeGuideLink = document.querySelector(".size-guide-link")

if(currentProduct){
    renderRating(currentProduct.rating, productRating);
    const wishlistBtn = document.querySelector(".wishlist-btn");
    wishlistBtn.dataset.id = currentProduct.id;
    productName.textContent = currentProduct.name;
    productPrice.textContent = `${currentProduct.price} SAR`

    productMainImage.src = currentProduct.image;
    productMainImage.alt = currentProduct.name;

    productDescription.textContent = currentProduct.description;

    let selectedSize = null;
    productSizes.innerHTML ="";

    if (currentProduct.sizes && currentProduct.sizes.length > 0) {
    currentProduct.sizes.forEach(size => {
        const sizeButton = document.createElement("button");

        sizeButton.textContent = size;
        sizeButton.className =
            "flex border border-olive-400 rounded-full w-8 h-8 text-sm items-center justify-center hover:bg-olive-200";

        productSizes.appendChild(sizeButton);
    });
} else {
    sizeLine.style.display= "none";
    parentSize.style.display= "none";
    productSizes.style.display = "none";
}

const sizeButtons = document.querySelectorAll(".product-sizes button");

sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(btn => {
            btn.classList.remove("bg-olive-800", "text-white");
        });

        button.classList.add("bg-olive-800", "text-white");

        selectedSize = button.textContent;
        productSizeField.innerHTML = `Size: ${selectedSize}`
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
         productColorField.innerHTML = `Color: ${selectedColor}`
        
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


    if (!selectedColor) {
        showToast("Please select color", "remove");
        return;
    }

    if ( currentProduct.sizes && currentProduct.sizes.length > 0 && !selectedSize){
        showToast("Please select size ", "remove");
        return;
    }

   const cartExist = cart.find(
    item =>
        item.id === currentProduct.id &&
        item.size === selectedSize &&
        item.color === selectedColor
);
    if (!cartExist) {

        cart.push({
            ...currentProduct,
            cartId: `${currentProduct.id}-${selectedSize || ""}-${selectedColor || ""}`,
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        });
}
         else{
       cartExist.quantity += 1 
    }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateHeaderCounts();
        showToast("Added to cart");
        cartBtn.textContent = "Added to Cart";
        cartBtn.classList.remove("bg-olive-800");
        cartBtn.classList.add("bg-olive-500");
        
});

sizeGuideLink.href = `guide.html?type=${currentProduct.category.toLowerCase()}`;
console.log(sizeGuideLink.href);
}






initWishlistButtons();
updateWishlistButtons();
