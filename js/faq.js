
const faqBtns = document.querySelectorAll(".faq-btn");

faqBtns.forEach(btn =>{
    btn.addEventListener("click", ()=>{
    const faqAnswer = btn.nextElementSibling;
    faqAnswer.classList.toggle("hidden");

    const faqArrow = btn.querySelector(".faq-arrow")
    faqArrow.classList.toggle("fa-chevron-up");
    faqArrow.classList.toggle("fa-chevron-down");

    })
});