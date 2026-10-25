
const resetForm = document.querySelector("#reset-password-form");
const emailInput = document.querySelector("#email");
emailInput.value = sessionStorage.getItem("resetEmail") || "";
const codeInput = document.querySelector("#code");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const message = document.querySelector("#message");
const resetBtn = document.querySelector("#reset-password-btn");

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const code = codeInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  message.classList.add("hidden");
  message.textContent = "";

  if (!/^\d{6}$/.test(code)) {
    showMessage("Please enter the 6-digit reset code.", false);
    return;
  }

  if (password.length < 8) {
    showMessage("Password must be at least 8 characters.", false);
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", false);
    return;
  }

  resetBtn.disabled = true;
  resetBtn.textContent = "Resetting...";

  try {
    const response = await fetch(
      "https://fashion-e-commerce-4le4.onrender.com/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          code,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Unable to reset password.", false);
      return;
    }

    showMessage(
      "Password reset successfully! Redirecting to login...",
      true
    );

    resetForm.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (error) {
    console.error("Reset password error:", error);
    showMessage(
      "Unable to connect to the server. Please try again.",
      false
    );
  } finally {
    resetBtn.disabled = false;
    resetBtn.textContent = "Reset Password";
  }
});

function showMessage(text, success) {
  message.textContent = text;
  message.classList.remove(
    "hidden",
    "text-red-600",
    "text-green-600"
  );
  message.classList.add(success ? "text-green-600" : "text-red-600");
}
