// src/js/toast.js

/**
 * Custom Toast Notification System (mimicking react-hot-toast)
 * Uses vanilla JavaScript and Tailwind CSS for styling.
 */

const TOAST_TIMEOUT = 5000; // Default toast display duration
const TOAST_CONTAINER_ID = "toast-container";

/**
 * Generates a unique ID for a toast.
 * @returns {string} Unique ID.
 */
function generateToastId() {
  return "toast-" + Math.random().toString(36).substr(2, 9);
}

/**
 * Creates a toast element with specified content and type.
 * @param {string} message - The main message of the toast.
 * @param {object} [options={}] - Options for the toast.
 * @param {string} [options.type='default'] - Type of toast ('default', 'success', 'error', 'warning', 'info', 'loading').
 * @param {string} [options.description] - Optional description for the toast.
 * @param {number} [options.duration=TOAST_TIMEOUT] - How long the toast should display.
 * @param {boolean} [options.closeButton=false] - Whether to show a close button.
 * @param {string} [options.actionLabel] - Label for an action button.
 * @param {function} [options.onAction] - Callback for the action button.
 * @returns {HTMLElement} The created toast element.
 */
function createToastElement(message, options = {}) {
  const {
    type = "default",
    description,
    closeButton = false,
    actionLabel,
    onAction,
  } = options;

  const toastId = generateToastId();
  const toastEl = document.createElement("div");
  toastEl.id = toastId;
  toastEl.className = `
        relative flex items-center justify-between gap-4 p-4 mb-3 rounded-lg shadow-md
        transition-all duration-300 ease-out transform translate-y-0 opacity-100
        ${getToastClasses(type)}
    `;
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");

  let iconSvg = "";
  switch (type) {
    case "success":
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>`;
      break;
    case "error":
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
      break;
    case "warning":
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
      break;
    case "info":
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
      break;
    case "loading":
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;
      break;
    default:
      iconSvg = ""; // No icon for default
  }

  toastEl.innerHTML = `
        <div class="flex items-center gap-2">
            ${iconSvg}
            <div>
                <p class="font-semibold text-sm">${message}</p>
                ${
                  description
                    ? `<p class="text-xs opacity-80">${description}</p>`
                    : ""
                }
            </div>
        </div>
        <div class="flex items-center gap-2">
            ${
              actionLabel
                ? `<button class="px-3 py-1 text-xs font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">${actionLabel}</button>`
                : ""
            }
            ${
              closeButton
                ? `<button class="p-1 rounded-full hover:bg-gray-200 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`
                : ""
            }
        </div>
    `;

  if (closeButton) {
    toastEl
      .querySelector("button:last-child")
      ?.addEventListener("click", () => dismissToast(toastId));
  }
  if (actionLabel && onAction) {
    toastEl
      .querySelector("button:first-of-type")
      ?.addEventListener("click", () => {
        onAction();
        dismissToast(toastId);
      });
  }

  return toastEl;
}

/**
 * Gets Tailwind CSS classes based on toast type.
 * @param {string} type - The type of toast.
 * @returns {string} Tailwind CSS classes.
 */
function getToastClasses(type) {
  switch (type) {
    case "success":
      return "bg-success text-success-foreground";
    case "error":
      return "bg-error text-error-foreground";
    case "warning":
      return "bg-warning text-warning-foreground";
    case "info":
      return "bg-accent text-accent-foreground";
    case "loading":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-card text-card-foreground border border-border";
  }
}

/**
 * Appends a toast to the container and sets a timeout for dismissal.
 * @param {HTMLElement} toastEl - The toast element to display.
 * @param {number} duration - How long the toast should display.
 */
function displayToast(toastEl, duration) {
  const container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    console.error("Toast container not found!");
    return;
  }

  container.prepend(toastEl); // Add new toasts at the top

  // Animate in
  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateY(0)";
  });

  if (duration !== Infinity) {
    setTimeout(() => dismissToast(toastEl.id), duration);
  }
}

/**
 * Dismisses a toast with an animation.
 * @param {string} id - The ID of the toast to dismiss.
 */
function dismissToast(id) {
  const toastEl = document.getElementById(id);
  if (toastEl) {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateY(100%)"; // Animate out downwards
    toastEl.style.height = "0"; // Collapse height
    toastEl.style.marginBottom = "0"; // Remove margin
    toastEl.style.paddingTop = "0";
    toastEl.style.paddingBottom = "0";

    setTimeout(() => {
      toastEl.remove();
    }, 300); // Match transition duration
  }
}

/**
 * Global toast object to expose API.
 */
window.toast = {
  _show: (message, options) => {
    const toastEl = createToastElement(message, options);
    displayToast(toastEl, options.duration || TOAST_TIMEOUT);
    return toastEl.id;
  },
  default: function (message, options) {
    return this._show(message, { ...options, type: "default" });
  },
  success: function (message, options) {
    return this._show(message, { ...options, type: "success" });
  },
  error: function (message, options) {
    return this._show(message, { ...options, type: "error" });
  },
  warning: function (message, options) {
    return this._show(message, { ...options, type: "warning" });
  },
  info: function (message, options) {
    return this._show(message, { ...options, type: "info" });
  },
  loading: function (message, options) {
    const id = this._show(message, {
      ...options,
      type: "loading",
      duration: Infinity,
    });
    return {
      id: id,
      success: (newMessage, newOptions) => {
        const toastEl = document.getElementById(id);
        if (toastEl) {
          toastEl.innerHTML = createToastElement(newMessage, {
            ...newOptions,
            type: "success",
          }).innerHTML;
          toastEl.className = toastEl.className.replace(
            /bg-\w+-\d+ text-\w+-\w+/,
            getToastClasses("success")
          );
          setTimeout(
            () => dismissToast(id),
            newOptions?.duration || TOAST_TIMEOUT
          );
        }
      },
      error: (newMessage, newOptions) => {
        const toastEl = document.getElementById(id);
        if (toastEl) {
          toastEl.innerHTML = createToastElement(newMessage, {
            ...newOptions,
            type: "error",
          }).innerHTML;
          toastEl.className = toastEl.className.replace(
            /bg-\w+-\d+ text-\w+-\w+/,
            getToastClasses("error")
          );
          setTimeout(
            () => dismissToast(id),
            newOptions?.duration || TOAST_TIMEOUT
          );
        }
      },
      dismiss: () => dismissToast(id),
    };
  },
  promise: function (promise, messages, options) {
    const loadingId = this.loading(messages.loading, options);
    promise
      .then((data) => {
        loadingId.success(messages.success(data), options);
      })
      .catch((error) => {
        loadingId.error(messages.error(error), options);
      });
    return loadingId.id;
  },
  dismiss: dismissToast,
  // For compatibility with react-hot-toast's top-level call
  _call: function (message, options) {
    if (typeof message === "string") {
      return this.default(message, options);
    }
    // Handle custom components if needed, but for now, just default
    return this.default("Custom content toast", options);
  },
};

// Make toast globally accessible
window.toast = window.toast._call;
for (const key in window.toast._call) {
  if (typeof window.toast._call[key] === "function") {
    window.toast[key] = window.toast._call[key];
  }
}
