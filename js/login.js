
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const togglePassword = document.querySelector("#toggle-password");
const passwordIcon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  passwordIcon.classList.toggle("fa-eye", !isHidden);
  passwordIcon.classList.toggle("fa-eye-slash", isHidden);
  togglePassword.setAttribute(
    "aria-label",
    isHidden ? "Hide password" : "Show password"
  );
});


loginForm.addEventListener("submit", async (event) => {
event.preventDefault();
const email = emailInput.value.trim().toLowerCase();
const password = passwordInput.value;

    emailError.classList.add("hidden");
    passwordError.classList.add("hidden");

    let isValid = true;

    if (!email) {
        emailError.textContent = "Please enter your email";
        emailError.classList.remove("hidden");
        isValid = false;
    }

    if (!password) {
        passwordError.textContent = "Please enter your password";
        passwordError.classList.remove("hidden");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    try {
        const response = await fetch("https://fashion-e-commerce-4le4.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            passwordError.textContent = data.message || "Login failed";
            passwordError.classList.remove("hidden");
            return;
        }

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        
const redirectPage = sessionStorage.getItem("redirectAfterLogin");

sessionStorage.removeItem("redirectAfterLogin");

window.location.href = redirectPage || "./index.html";


    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to the server.");
    }
});
