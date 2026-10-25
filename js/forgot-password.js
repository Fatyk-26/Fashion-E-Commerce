
const forgotPasswordForm = document.querySelector("#forgot-password-form");
const emailInput = document.querySelector("#email");
const message = document.querySelector("#message");
const sendCodeBtn = document.querySelector("#send-code-btn");

forgotPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  message.classList.add("hidden");
  message.textContent = "";
  sendCodeBtn.disabled = true;
  sendCodeBtn.textContent = "Sending...";

  try {
    const response = await fetch("https://fashion-e-commerce-4le4.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

message.classList.remove("hidden", "text-red-600", "text-green-600");

if (response.ok) {
  message.textContent = data.message || "Check your email for the reset code.";
  message.classList.add("text-green-600");

  sessionStorage.setItem("resetEmail", email);

  setTimeout(() => {
    window.location.href = "reset-password.html";
  }, 1500);

} else {
  message.textContent = data.message || "Failed to send reset code.";
  message.classList.add("text-red-600");
}

  } catch (error) {
    message.textContent = "Unable to connect to the server, Please try again.";
    message.classList.remove("hidden", "text-green-600");
    message.classList.add("text-red-600");

    console.error("Forgot password error:", error);

  } finally {
    sendCodeBtn.disabled = false;
    sendCodeBtn.textContent = "Send Reset Code";
  }
});
