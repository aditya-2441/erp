# ERP System

**Note:** This is a personal learning project built to explore web development concepts. It was primarily developed with the assistance of AI and is not currently hosted online.

## 📖 About the Project

This project is a web-based Enterprise Resource Planning (ERP) dashboard prototype. Based on the project structure, it is designed to manage various administrative aspects of an organization or educational institution, including admissions, finance, and general administration tasks.

## 🛠️ Tech Stack

This application is built using a modern front-end stack:

* **React** (User Interface)
* **Vite** (Build Tool and Development Server)
* **JavaScript / JSX** (Logic and Components)
* **CSS** (Styling)

## 📁 Project Structure

The repository is organized into a modular React architecture:

* **`package.json` & `package-lock.json**`: Manages project dependencies and scripts.


* **`vite.config.js`**: Configuration for the Vite bundler.


* **`src/`**: The main source code directory, which includes:


* **`components/`**: Reusable UI elements like `Header.jsx` and `Layout.jsx`.


* **`context/`**: Manages global state, specifically authentication via `AuthContext.jsx`.


* **`data/`**: Contains mock data or configuration files like `rolesData.js`.


* **`pages/`**: Contains the main route views for the application:


* `AdministrationPage.jsx`

* `AdmissionPage.jsx`

* `DashboardHomePage.jsx`

* `FinancePage.jsx`

* `HomePage.jsx`






## 🚀 How to Run Locally

Since this project is not hosted, you can run it on your local machine to explore the code and interface:

1. **Clone or Download** the repository to your local machine.
2. **Navigate** to the project folder in your terminal.
3. **Install Dependencies**: Run `npm install` (or `yarn install`) to download the required packages.
4. **Start the Development Server**: Run `npm run dev` (standard for Vite projects) to launch the app.
5. **View the App**: Open the provided local host link (usually `http://localhost:5173`) in your browser.
