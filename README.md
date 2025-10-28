# TicketFlow - Twig Version

This project is a Twig-based re-implementation of the TicketFlow application, originally built with React. The goal is to maintain identical UI/UX, functionality, and design system, leveraging Twig for templating, vanilla JavaScript for client-side interactivity, and a conceptual PHP/Symfony backend for routing and data logic.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- **PHP**: Version 8.1 or higher.
- **Composer**: PHP dependency manager.
- **Node.js & npm/yarn**: For Tailwind CSS compilation.
- **Symfony CLI** (optional, but recommended for local server).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url> project
    cd project
    ```

2.  **Install PHP dependencies (Symfony):**

    ```bash
    composer install
    ```

3.  **Install Node.js dependencies (Tailwind CSS):**
    ```bash
    npm install # or yarn install
    ```

### Build & Serve

1.  **Compile Tailwind CSS:**

    ```bash
    npm run dev # for development with watch
    # or
    npm run build # for production build
    ```

    This will generate `public/assets/css/tailwind.css`.

2.  **Start the PHP Development Server:**
    Using Symfony CLI:

    ```bash
    symfony serve
    ```

    Or using PHP's built-in server:

    ```bash
    php -S 127.0.0.1:8000 -t public/
    ```

    The application should now be accessible at `http://127.0.0.1:8000`.

## 💡 Key Architectural Changes

### Templating

- **React Components -> Twig Templates**: Each React component (`.jsx`) has been translated into a corresponding Twig template (`.twig`).
- **Layout Inheritance**: `templates/base.twig` serves as the main layout, extended by all page templates.
- **Component Inclusion**: Twig's `{% include %}` and `{% embed %}` are used for modularity.

### Styling

- **Tailwind CSS**: The same Tailwind CSS configuration and utility classes are used, compiled via Node.js scripts.

### State & Logic

- **Zustand Replacement**: Global state management is now handled by server-side data passed to Twig templates. Client-side interactivity uses vanilla JavaScript. For complex shared client-side state, a custom event system or simple global object in JavaScript would be implemented.
- **react-hook-form & Zod Replacement**:
  - **Server-side Validation**: Handled by the PHP backend (e.g., Symfony's Validator component).
  - **Client-side Validation**: Re-implemented in `src/js/validation.js` using vanilla JavaScript to provide immediate user feedback, mirroring the original validation rules and messages.

### Notifications

- **react-hot-toast Replacement**: A custom vanilla JavaScript toast notification system (`src/js/toast.js`) has been created to replicate the visual style and functionality of `react-hot-toast`.

### Icons

- **lucide-react Replacement**: Lucide icons are integrated as inline SVGs using a Twig macro (`_lucide_icon.twig`) for reusability and easy styling.
