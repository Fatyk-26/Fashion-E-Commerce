
const faqBtns = document.querySelectorAll(".faq-btn");
const contactForm = document.querySelector("#form")
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const subjectInput = document.querySelector("#subject")
const msgInput = document.querySelector("#message")
const nameError = document.querySelector("#name-error")
const subjectError = document.querySelector("#subject-error")
const msgError = document.querySelector("#msg-error")
const emailError = document.querySelector("#email-error")
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

emailjs.init({
    publicKey: "SOitmkafTWbd4OTVA"
});

faqBtns.forEach(btn =>{
    btn.addEventListener("click", ()=>{
    const faqAnswer = btn.nextElementSibling;
    faqAnswer.classList.toggle("hidden");

    const faqArrow = btn.querySelector(".faq-arrow")
    faqArrow.classList.toggle("fa-chevron-up");
    faqArrow.classList.toggle("fa-chevron-down");

    })
});


function validForm(){
    let isValid = true;
    const name = nameInput.value.trim();

    if(name === ""){
        nameError.textContent = "Please enter your name";
        nameError.classList.remove("hidden");
        isValid = false;
    } else {
        nameError.classList.add("hidden");
    }

    const subject = subjectInput.value.trim();

    if(subject === ""){
        subjectError.textContent = "Please enter the subject";
        subjectError.classList.remove("hidden");
        isValid = false;
    } else {
        subjectError.classList.add("hidden");
    }

    const message = msgInput.value.trim()

    if(message === ""){
        msgError.textContent = "Please enter the message"
        msgError.classList.remove("hidden");
        isValid = false;
    } else {
        msgError.classList.add("hidden")
    }

    const email = emailInput.value.trim();
    if(email === ""){
        emailError.textContent = "Please enter your email"
        emailError.classList.remove("hidden")
        isValid = false;
    } 

   else if(!emailRegex.test(email)){
    emailError.textContent = "Please enter a valid email address";
    emailError.classList.remove("hidden");
    isValid = false;
} else {
    emailError.classList.add("hidden");
}

    return isValid;
}

contactForm.addEventListener("submit", async (event) => {
event.preventDefault();
const isValid = validForm()
if (!isValid) return;

try {
    await emailjs.sendForm(
        "service_w5fq0qi",
        "template_jw2gwy3",
        contactForm
        );

        showToast("Message sent successfully!");
        contactForm.reset();

    } catch (error) {
        console.error(error);
        showToast("Failed to send message", "remove");
    }
})