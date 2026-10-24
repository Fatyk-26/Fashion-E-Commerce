
const token = sessionStorage.getItem("token");
const profileForm = document.querySelector("#profile-form");
const addressForm = document.querySelector("#address-form");
const profileMessage = document.querySelector("#profile-message");
const addressMessage = document.querySelector("#address-message");

async function loadAccount() {
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    const user = data.user;


    document.querySelector("#account-name").textContent = user.name;
    document.querySelector("#profile-name").value = user.name;
    document.querySelector("#profile-email").value = user.email;
    document.querySelector("#profile-phone").value = user.phone || "";
    document.querySelector("#address-country").value =
      user.address?.country || "";

    document.querySelector("#address-city").value =
      user.address?.city || "";

    document.querySelector("#address-district").value =
      user.address?.district || "";

    document.querySelector("#address-street").value =
      user.address?.street || "";

    document.querySelector("#address-postal").value =
      user.address?.postalCode || "";
      
    sessionStorage.setItem("user", JSON.stringify(user));

  } catch (error) {
    console.error("Error loading account:", error);
  }
}

function showMessage(element, message, isSuccess) {
  element.textContent = message;
  element.classList.remove(
    "hidden",
    "text-green-600",
    "text-red-600"
  );

  element.classList.add(
    isSuccess ? "text-green-600" : "text-red-600"
  );
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  showMessage(profileMessage, "", true);

  const name = document.querySelector("#profile-name").value.trim();
  const phone = document.querySelector("#profile-phone").value.trim();

  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showMessage(
        profileMessage,
        data.message || "Failed to update profile.",
        false
      );
      return;
    }

    await loadAccount();

    showMessage(
      profileMessage,
      "Personal information updated successfully!",
      true
    );

  } catch (error) {
    console.error("Profile update error:", error);

    showMessage(
      profileMessage,
      "Unable to connect to the server.",
      false
    );
  }
});


addressForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(addressMessage, "", true);

  const address = {
    country: document.querySelector("#address-country").value.trim(),
    city: document.querySelector("#address-city").value.trim(),
    district: document.querySelector("#address-district").value.trim(),
    street: document.querySelector("#address-street").value.trim(),
    postalCode: document.querySelector("#address-postal").value.trim()
  };

  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/address",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(address)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showMessage(
        addressMessage,
        data.message || "Failed to save address.",
        false
      );
      return;
    }

    await loadAccount();

    showMessage(
      addressMessage,
      "Shipping address saved successfully!",
      true
    );

  } catch (error) {
    console.error("Address update error:", error);

    showMessage(
      addressMessage,
      "Unable to connect to the server.",
      false
    );
  }
});


loadAccount();
