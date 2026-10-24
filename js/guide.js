
const colthingGuide = document.querySelector("#clothing-guide")
const shoesGuide = document.querySelector("#shoes-guide")

const guideParams = new URLSearchParams(window.location.search) 
const type = guideParams.get("type")

if(type === "clothing"){
    shoesGuide.classList.add("hidden")
}

else if ( type === "shoes"){
    colthingGuide.classList.add("hidden")
}