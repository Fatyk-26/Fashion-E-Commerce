
const registerForm = document.querySelector("#register-form");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmPasswordError = document.querySelector("#confirm-password-error");
const termsError = document.querySelector("#terms-error");
const registerMessage = document.querySelector("#register-message");


document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.parentElement.querySelector("input");
    const icon = button.querySelector("i");

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    icon.classList.toggle("fa-eye", !isHidden);
    icon.classList.toggle("fa-eye-slash", isHidden);

    button.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    );
  });
});


registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
    const terms = document.querySelector("#terms").checked;

    registerMessage.classList.add("hidden");

    if (!validateForm(name, email, password, confirmPassword, terms)) {
        return;
    }

    try {
        const response = await fetch("https://fashion-e-commerce-4le4.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            registerMessage.textContent = data.message || "Registration failed.";
            registerMessage.classList.remove("hidden");
            registerMessage.classList.add("text-red-600");
            return;
        }

        registerMessage.textContent = "Account created successfully!";
        registerMessage.classList.remove("hidden", "text-red-600");
        registerMessage.classList.add("text-green-600");
        registerForm.reset();

    } catch (error) {
        console.error("Registration error:", error);
        registerMessage.textContent = "Unable to connect to the server.";
        registerMessage.classList.remove("hidden");
        registerMessage.classList.add("text-red-600");
    }
});

function validateForm(name, email, password, confirmPassword, terms) {
    let isValid = true;

    if (name === "") {
        nameError.textContent = "Name is required!";
        nameError.classList.remove("hidden");
        isValid = false;
    } else {
        nameError.classList.add("hidden");
    }

    if (email === "") {
        emailError.textContent = "Email is required!";
        emailError.classList.remove("hidden");
        isValid = false;
    } else {
        emailError.classList.add("hidden");
    }

    if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters";
        passwordError.classList.remove("hidden");
        isValid = false;
    } else {
        passwordError.classList.add("hidden");
    }

    if (confirmPassword !== password) {
        confirmPasswordError.textContent = "Passwords do not match";
        confirmPasswordError.classList.remove("hidden");
        isValid = false;
    } else {
        confirmPasswordError.classList.add("hidden");
    }

    if (!terms) {
        termsError.textContent = "Please accept the Terms & Conditions";
        termsError.classList.remove("hidden");
        isValid = false;
    } else {
        termsError.classList.add("hidden");
    }

    return isValid;
}
