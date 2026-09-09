const header = document.querySelector("#header");

fetch("./header.html")
    .then(response => response.text())
    .then(data => {
        header.innerHTML = data;
        updateHeaderCounts();
        searchFieldHeader();

    });


function updateHeaderCounts() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlistCount = document.querySelector("#wishlist-count");
    const cartCount = document.querySelector("#cart-count");

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }

    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}


function searchFieldHeader(){
    const searchContainer = document.querySelector(".search-field")
    const searchResult = document.querySelector("#search-results")
    
    searchContainer.addEventListener("input", ()=>{
    const searchInputValue = searchContainer.value.toLowerCase().trim();
    const filteredProduct = products.filter(product => 
            product.name.toLowerCase().includes(searchInputValue) || 
            product.category.toLowerCase().includes(searchInputValue)
        );

        if(searchInputValue === ""){
            searchResult.innerHTML = "";
            searchResult.classList.add("hidden");
            return;
        }

        if(filteredProduct.length === 0){
            searchResult.innerHTML = 
            `
             <p class="px-3 py-2 text-sm text-gray-500"> 
             No products found
             </p> `
        }

        else {
            searchResult.innerHTML = filteredProduct.map( product =>
                `<div
                    class="search-result px-3 py-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center "
                     data-id="${product.id}" >
                     <img src="${product.image}" alt="${product.name}" class="w-25 h-20 rounded-sm">
                     ${product.name}
                        
                        </div>`
            ) .join("");

            const resultItem = searchResult.querySelectorAll(".search-result")
            resultItem.forEach(item =>{
                item.addEventListener("click", ()=>{
                    const productId = Number(item.dataset.id)
                    const product = products.find(
                        product => product.id === productId
                    )

                    console.log(product) // I should link it to the product shop page later
                    searchContainer.value = product.name;
                    searchResult.classList.add("hidden");
                })
            })

        }

         searchResult.classList.remove("hidden");
    })

    let searchIndex = -1
    searchContainer.addEventListener("keydown" , (event)=>{
    const resultItem = searchResult.querySelectorAll(".search-result")

    if(event.key === "ArrowDown"){
        event.preventDefault();
        searchIndex++;
        if(searchIndex >= resultItem.length){
            searchIndex = 0;
        } 
    }

    if (event.key === "ArrowUp"){
        event.preventDefault();
        searchIndex--;
        if(searchIndex < 0 ){
            searchIndex = resultItem.length -1
        }
    }

    resultItem.forEach(item =>
        item.classList.remove("bg-gray-100")
    )

    if(resultItem[searchIndex]){
        resultItem[searchIndex].classList.add("bg-gray-100")
    }

    if(event.key === "Enter" && resultItem[searchIndex]){
         event.preventDefault();
        resultItem[searchIndex].click();
    }

    if(event.key === "Escape"){
    searchResult.classList.add("hidden");
    }
    });
}



