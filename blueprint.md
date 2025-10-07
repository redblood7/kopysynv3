# Kopysynk Consulting Website Blueprint

## Overview

This document outlines the blueprint for the Kopysynk Consulting website, a modern, responsive, and feature-rich web application designed to showcase the company's services, engage users, and facilitate course enrollment. The website is built using HTML, CSS, and JavaScript, with Firebase for backend services like authentication and database management.

## Implemented Features

### Design and Layout

-   **Modern Aesthetics**: The website features a dark-themed, professional design with a consistent color scheme, typography, and layout across all pages.
-   **Responsive Design**: The layout is fully responsive and optimized for various devices, including desktops, tablets, and mobile phones.
-   **Navigation**: A clear and intuitive navigation bar is present on all pages, providing easy access to different sections of the website.
-   **Responsive Login Button**: A login button is included in the header, which is responsive and adapts to different screen sizes.
-   **SVG Logo**: A sleek, scalable SVG logo has been created and integrated into the header of all pages.

### Core Pages

-   **Home Page (`index.html`)**: The landing page of the website, featuring a hero section, featured courses, and latest articles to engage users.
-   **About Page (`about.html`)**: Provides information about Kopysynk Consulting, its mission, and its team.
-   **Courses Page (`courses.html`)**: Lists all available courses with detailed descriptions, images, and an "Add to Cart" option.
-   **Articles Page (`articles.html`)**: Displays a collection of articles with links to individual article pages.
-   **Contact Page (`contact.html`)**: Includes a contact form for users to send inquiries.
-   **Login/Signup Pages (`login.html`, `signup.html`)**: User authentication pages for signing in or creating a new account.

### E-commerce and Payment

-   **Shopping Cart (`cart.html`)**: A fully functional shopping cart that allows users to add, remove, and view courses before proceeding to payment.
-   **Payment Gateway (`payment.html`)**: A comprehensive payment page with multiple payment options, including:
    -   Credit/Debit Card
    -   UPI (with QR code generation)
    -   Netbanking
-   **Payment Confirmation (`payment-successful.html`)**: A page that confirms successful payment and enrollment.

### User and Wallet Functionality

-   **User Authentication**: Firebase-powered user authentication for a secure and personalized experience.
-   **User Profile**: Authenticated users can see their username and a logout option.
-   **Kopysynk Wallet (`wallet.html`)**: A personal wallet for users to store and manage their balance.
    -   **Add Money**: Users can add money to their wallet through the payment gateway.
    -   **Wallet Balance**: The wallet balance is displayed in the header and on the wallet page, updating in real-time after transactions.

## Current Plan and Steps

### Objective: Create and Integrate a New Company Logo

The goal was to create a professional SVG logo for Kopysynk Consulting and integrate it into the website's header.

### Steps Taken

1.  **Create SVG Logo (`logo.svg`)**:
    -   Designed and created a new SVG logo that represents the company's focus on IT and data.
2.  **Update HTML Files**:
    -   Replaced the plain text logo with the new SVG logo in the header of the following files:
        -   `index.html`
        -   `about.html`
        -   `courses.html`
        -   `articles.html`
        -   `contact.html`
        -   `cart.html`
        -   `login.html`
        -   `wallet.html`

This change enhances the brand identity of the website, providing a more professional and polished look.
