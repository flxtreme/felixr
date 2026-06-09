# felixr Blogging App

Welcome to the felixr blogging application. This project is a modern, modular web application designed for publishing and managing blog posts, custom pages, and projects.

## Overview

The application is built using Next.js (App Router), React, and TailwindCSS. It provides:
- A beautiful, responsive public-facing blog and portfolio.
- An intuitive admin dashboard for managing content (posts, pages, tags).
- Seamless dark and light mode theming.
- A vertical slice architecture for high maintainability.

## Architecture & File Structure

The project has been restructured using a vertical slicing architecture. This means the application code is primarily grouped by feature rather than strictly by technical role, promoting better modularity.

For a detailed breakdown of the vertical slice implementation, please refer to the structure documentation:

👉 **[View the File & Folder Structure](FILE_FOLDER_STRUCTURE.md)**
👉 **[View the File Naming Convention](FILE_NAMING_CONVENTION.md)**

## Features

- **Public Views:** Read blog posts, view projects, and custom static pages.
- **Admin Dashboard:** Secure login system with an integrated dashboard to create and edit posts.
- **Feature Modules:** Logic for tags, posts, auth, and admin functionalities are separated into isolated modules.
