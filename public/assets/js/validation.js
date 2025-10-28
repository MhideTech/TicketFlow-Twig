document.addEventListener("DOMContentLoaded", () => {
  // Attach validation to all forms with the 'needs-validation' class
  document.querySelectorAll("form.needs-validation").forEach((form) => {
    form.addEventListener(
      "submit",
      function (event) {
        if (!validateForm(this)) {
          event.preventDefault(); // Prevent form submission if validation fails
          event.stopPropagation();
        }
        this.classList.add("was-validated"); // Add class to show validation styles
      },
      false
    );

    // Add real-time validation on input change/blur
    this.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("input", () => validateInput(input));
      input.addEventListener("blur", () => validateInput(input));
    });
  });
});

/**
 * Validates an entire form.
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateForm(form) {
  let isValid = true;
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  return isValid;
}

/**
 * Validates a single input element based on its attributes.
 * @param {HTMLElement} input - The input element to validate.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
function validateInput(input) {
  const value = input.value.trim();
  const name = input.name;
  let errorMessage = "";

  // Clear previous errors
  clearError(input);

  // Required check
  if (input.hasAttribute("required") && value === "") {
    errorMessage = `${capitalize(name)} is required.`;
    displayError(input, errorMessage);
    return false;
  }

  // Type-specific validation (e.g., email, password length)
  if (input.type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = `Please enter a valid email address.`;
      displayError(input, errorMessage);
      return false;
    }
  }

  if (name === "password" && input.hasAttribute("minlength")) {
    const minLength = parseInt(input.getAttribute("minlength"), 10);
    if (value.length < minLength) {
      errorMessage = `Password must be at least ${minLength} characters long.`;
      displayError(input, errorMessage);
      return false;
    }
  }

  // Custom validation (e.g., confirm password)
  if (input.hasAttribute("data-confirm")) {
    const targetInput = document.querySelector(
      `[name="${input.getAttribute("data-confirm")}"]`
    );
    if (targetInput && value !== targetInput.value) {
      errorMessage = `Passwords do not match.`;
      displayError(input, errorMessage);
      return false;
    }
  }

  // Add more validation rules as needed, mirroring Zod schemas

  return true;
}

/**
 * Displays an error message next to the input.
 * @param {HTMLElement} input - The input element.
 * @param {string} message - The error message.
 */
function displayError(input, message) {
  let errorElement = input.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains("invalid-feedback")) {
    errorElement = document.createElement("div");
    errorElement.className = "invalid-feedback text-red-500 text-sm mt-1";
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }
  errorElement.textContent = message;
  input.classList.add("border-red-500"); // Add error styling
}

function clearError(input) {
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains("invalid-feedback")) {
    errorElement.remove();
  }
  input.classList.remove("border-red-500");
}

function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
