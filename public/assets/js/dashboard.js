// src/js/dashboard.js

/**
 * Client-side JavaScript for Dashboard interactivity.
 * This file would contain logic for:
 * - Opening/closing modals (e.g., for Create/Edit Ticket).
 * - Handling AJAX form submissions for ticket CRUD (if desired, otherwise full page reloads).
 * - Dynamic filtering/sorting of tickets without full page reloads.
 * - Any interactive elements on the dashboard (e.g., chart updates, real-time data).
 */

document.addEventListener("DOMContentLoaded", () => {
  // Example: Modal toggle logic
  const ticketModal = document.getElementById("ticket-modal");
  const openModalBtn = document.getElementById("open-ticket-modal");
  const closeModalBtn = document.getElementById("close-ticket-modal");

  openModalBtn?.addEventListener("click", () =>
    ticketModal?.classList.remove("hidden")
  );
  closeModalBtn?.addEventListener("click", () =>
    ticketModal?.classList.add("hidden")
  );
});
