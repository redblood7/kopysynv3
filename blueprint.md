# Project Blueprint

## Overview
This project is a framework-less web application utilizing modern HTML, CSS, and JavaScript. It incorporates Firebase for authentication and database services, though a temporary client-side authentication system using `localStorage` has been implemented for testing purposes. The application aims to provide a responsive and accessible user experience with a focus on modern web standards and aesthetics.

## Project Outline

### Authentication (Temporary - `localStorage` based)
*   **Signup:** Users can create new accounts. Credentials (email, password, username) are stored in the browser's `localStorage` as a JSON array.
*   **Login:** Users can log in with stored credentials. A successful login sets `loggedInUser` in `sessionStorage`.
*   **Logout:** Clears `loggedInUser` from `sessionStorage`.
*   **User State:** The `main.js` now checks `sessionStorage` for `loggedInUser` to display a welcome message and logout option, bypassing Firebase Authentication for this temporary setup.

### Features
*   **Navigation:** (Details about navigation bar, links, etc.)
*   **Courses:** (Details about course listing, individual course pages)
*   **Cart:** (Details about adding/removing items, checkout process)
*   **Payment:** (Details about payment methods, success/failure handling)
*   **Articles:** (Details about blog-like articles)
*   **Contact/About/Policies:** (Standard informational pages)

### Design & Style
*   **Responsive Layout:** The application is designed to adapt to various screen sizes.
*   **Modern CSS:** Utilizes Baseline CSS features for styling.
*   **Typography:** Expressive and relevant fonts with emphasis on hierarchy.
*   **Color Palette:** Vibrant and energetic color scheme.
*   **Visual Effects:** Subtle noise texture, multi-layered drop shadows for depth, glow effects on interactive elements.
*   **Iconography:** Incorporates icons for enhanced understanding and navigation.

### Accessibility (A11Y) Standards
*   The application aims to be accessible to a wide range of users, considering different physical and mental abilities, age groups, and learning styles. (Specific implementations would be detailed here if known).

---

## Current Requested Change: Remove Duplicate Login Icons and Maintain UI Alignment

### Plan:
Identify and remove redundant login icons from the header across all HTML pages. The `main.js` dynamically populates the `user-state` container with a login/logout button, which is the intended single point of interaction. All other static login icons will be removed to maintain a clean and aligned UI.

### Steps:

1.  **Examine all HTML files for duplicate login icons**: Reviewed `index.html`, `about.html`, `articles.html`, `courses.html`, `contact.html`, `cart.html`, `wallet.html`, `login.html`, `signup.html`, `login-success.html`, `signup-success.html`, `payment.html`, `payment-successful.html`, `privacy-policy.html`, `refund-policy.html`, `digital-delivery-policy.html`.
2.  **Remove duplicate login icons**: Located and removed any `<a>` tags or `<li>` elements that act as login buttons or icons but are not part of the dynamically managed `user-state` list. Ensured that only the `user-state` container (managed by `main.js`) is responsible for displaying the login/logout option.
3.  **Verify UI alignment**: After modifying the HTML files, ensured that the header and navigation remain visually consistent and correctly aligned across all pages, especially around the user state area.

**Status: Completed**
All duplicate login icons have been removed, and UI alignment has been verified across all pages. The user authentication flow is now consistently handled by the dynamically populated `user-state` container.