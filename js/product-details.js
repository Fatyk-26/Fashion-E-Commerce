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
const relatedProducts = document.querySelector("#related-products")
const relatedPrev = document.querySelector("#related-prev");
const relatedNext = document.querySelector("#related-next");
const imagePrev = document.querySelector(".image-prev");
const imageNext = document.querySelector(".image-next");
const detailsOrigin = document.querySelector("#details-origin");
const detailstColor = document.querySelector("#details-color");
const detailstModel= document.querySelector("#details-model");
const detailsGender = document.querySelector("#details-gender");
const detailsHeader = document.querySelector(".product-details-header");
const detailsContent = document.querySelector(".product-details-content");
const detailsArrow = document.querySelector(".product-details-arrow");
const highlightHeader = document.querySelector(".product-highlights-header");
const highlightContent = document.querySelector(".product-highlights-content");
const highlightArrow = document.querySelector(".product-highlights-arrow");

detailsHeader.addEventListener("click", ()=>{
    detailsContent.classList.toggle("hidden");
    detailsArrow.classList.toggle("fa-chevron-up")
    detailsArrow.classList.toggle("fa-chevron-down")
})

highlightHeader.addEventListener("click", ()=>{
    highlightContent.classList.toggle("hidden")
    highlightArrow.classList.toggle("fa-chevron-up")
    highlightArrow.classList.toggle("fa-chevron-down")
})


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

function renderRelatedProducts(products, container) {
    container.innerHTML = products.map(product => {
        return `
        <div class="border border-gray-300 rounded-2xl p-2 w-64 shrink-0 ">
        <div class="relative">
        <a href="product-details.html?id=${product.id}">
        <img class="w-full h-68 object-cover " src="${product.colors[0].image}" alt="${product.name}">
        </a>
        <span data-id="${product.id}" data-color="${product.colors[0].name}" class=" wishlist-btn absolute top-1 right-1 bg-white text-slate-900 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:bg-olive-800 hover:text-white"><i class="fa-regular fa-heart"></i></span>
        </div>
        <span class="border border-gray-300 rounded-3xl text-xs px-3 bg-gray-300 font-semibold ">${product.category}</span>

        <h3 class="font-semibold text-slate-900 py-1">${product.name}</h3>
        <p class="text-xs py-1 line-clamp-1">Our collection brings together modern trends, timeless elegance, and carefully selected pieces designed to make every look feel special.</p>
        <p class="text-md text-olive-500 font-bold pb-2">${product.price} SAR</p>
        </div>
        `;
    }).join("");
}

const related = products.filter(product =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id
    );

    renderRelatedProducts(
        related,
        relatedProducts
    );

    relatedNext.addEventListener("click", () => {
    relatedProducts.scrollBy({
        left: 270,
        behavior: "smooth"
    });
});

relatedPrev.addEventListener("click", () => {
    relatedProducts.scrollBy({
        left: -270,
        behavior: "smooth"
    });
});

let selectedColor = null;
let selectedColorData = null;

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

const defaultColor = currentProduct.colors[0];
selectedColor = defaultColor.name;
selectedColorData = defaultColor;
detailsOrigin.textContent = selectedColorData.details.origin;
detailstColor.textContent = selectedColorData.details.color;
detailstModel.textContent = selectedColorData.details.model;
detailsGender.textContent = selectedColorData.details.gender;
wishlistBtn.dataset.color = defaultColor.name
productMainImage.src = defaultColor.image;

productThumbnails.forEach((thumbnail, index) => {
    const image = defaultColor.thumbnails[index];

    if (image) {
        thumbnail.src = image;
        thumbnail.alt = currentProduct.name;
        thumbnail.classList.remove("hidden");
    } else {
        thumbnail.classList.add("hidden");
    }
});

// To handle the image change when clicking on thumbnails, swiping, or using arrow keys, we can implement the following logic:

let currentImageIndex = 0;

function changeProductImage(index) {
    const images = [
        selectedColorData.image,
        ...selectedColorData.thumbnails
    ];

    currentImageIndex = (index + images.length) % images.length;
    productMainImage.src = images[currentImageIndex];
}

productThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
        const image = selectedColorData.thumbnails[index];

        if (!image) return;

        changeProductImage(index);
    });
});

let touchStartX = 0;
let touchStartY = 0;

productMainImage.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

productMainImage.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;

    const differenceX = touchEndX - touchStartX;
    const differenceY = touchEndY - touchStartY;

    if (
        Math.abs(differenceX) < 50 ||
        Math.abs(differenceX) < Math.abs(differenceY)
    ) {
        return;
    }

    if (differenceX < 0) {
        changeProductImage(currentImageIndex + 1);

    } else {
        changeProductImage(currentImageIndex - 1);
    }
}, { passive: true });


document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        changeProductImage(currentImageIndex + 1);
    }

    if (event.key === "ArrowLeft") {
        changeProductImage(currentImageIndex - 1);
    }
});

const colorButtons = document.querySelectorAll(".product-colors > div");

colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const color = button.dataset.color;
        selectedColor = color;
        wishlistBtn.dataset.color = selectedColor
        updateWishlistButtons();

        productColorField.innerHTML = `Color: ${selectedColor}`;

       selectedColorData = currentProduct.colors.find(
            color => color.name === selectedColor
        );

        detailsOrigin.textContent = selectedColorData.details.origin;
        detailstColor.textContent = selectedColorData.details.color;
        detailstModel.textContent = selectedColorData.details.model;
        detailsGender.textContent = selectedColorData.details.gender;

        
        currentImageIndex = 0;
        productMainImage.src = selectedColorData.image;

        productThumbnails.forEach((thumbnail, index) => {
            const image = selectedColorData.thumbnails[index];

            if (image) {
                thumbnail.src = image;
                thumbnail.alt = currentProduct.name;
                thumbnail.classList.remove("hidden");
            } else {
                thumbnail.classList.add("hidden");
            }
        });
    });
});


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
            image: selectedColorData.image,
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
});

sizeGuideLink.href = `guide.html?type=${currentProduct.category.toLowerCase()}`;
console.log(sizeGuideLink.href);
}

initWishlistButtons();
updateWishlistButtons();
