# 🚗 AutoBid: The Premier Online Car Auction Platform

**AutoBid** is a dynamic full-stack web application designed for a streamlined, secure, and engaging **car auction** experience. Users can list their vehicles for sale, and prospective buyers can browse, bid, and connect with sellers to acquire their next car.

## 🔗 Live Links

| Component | Link |
| :--- | :--- |
| **Client Side** (Live App) | $\rightarrow$ [https://agrotrade-a35fe.web.app/](https://agrotrade-a35fe.web.app/) |
| **Server Side** (API Endpoint) | $\rightarrow$ [https://autobid-server-eosin.vercel.app/](https://autobid-server-eosin.vercel.app/) |
| **Client/Server Repository** | $\rightarrow$ [https://github.com/nomayen31/AutoBid](https://github.com/nomayen31/AutoBid) |

## 🔑 Demo Login

To explore the application's features without creating a new account, use the following credentials:

* **Email:** `demo@gmail.com`
* **Password:** `@Demo123#$%@@`

---

## ✨ Key Features & Functionality

This platform is built around core auction and user management functionalities, fulfilling all assignment requirements:

* **Secure Authentication & Validation:** Robust **Email/Password** and **Google Social Login** with strong password validation (Uppercase, Lowercase, minimum 6 characters).
* **Car Listing (Add Task):** Sellers can post a new car for auction, specifying details like **Title, Category, Deadline,** and **Budget (Starting Bid)** through a dedicated **protected route**.
* **Dynamic Auction Browsing:** Users can browse all active car listings. The **Featured Tasks Section** on the Home Page highlights 6 cars with the **most recent deadlines**.
* **Complete CRUD Operations:** Users have full control over their posted listings, allowing them to **Create, Read, Update,** and **Delete** an auction from the **My Posted Cars** protected route.
* **Protected Routes:** Essential pages like **Add Car**, **Car Details**, and **My Posted Cars** are secure, redirecting unauthenticated users to the login page.
* **User-Friendly Notifications:** All success, error, and confirmation messages are displayed using **Toast** or **Sweet Alert** for a non-intrusive user experience.

---

## 💻 Technologies Used

The **AutoBid** application is a **MERN stack** project, using modern libraries for a robust architecture.

### Frontend (Client-Side)

| Package/Technology | Purpose |
| :--- | :--- |
| **React** | Core library for building the user interface. |
| **React Router DOM** | For handling client-side routing and private routes. |
| **Firebase** | Used for user authentication and hosting. |
| **Tailwind CSS** | Utility-first framework for rapid and responsive styling. |
| **React-Toastify/SweetAlert2** | For displaying custom success and error messages. |

### Backend (Server-Side)

| Package/Technology | Purpose |
| :--- | :--- |
| **Node.js / Express.js** | Runtime and framework for the RESTful API. |
| **MongoDB / Mongoose** | NoSQL database for data storage and ODM. |
| **Vercel** | Used for reliable server-side deployment. |
| **Dotenv** | To secure all configuration keys and credentials (MongoDB URI, etc.). |

---

## ⚙️ Setup and Installation

To get a copy of this project running on your local machine, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/nomayen31/AutoBid.git](https://github.com/nomayen31/AutoBid.git)
    cd AutoBid
    ```
2.  **Install Dependencies:**
    Navigate to both the client and server folders (if separated) and run:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in your server directory and a `.env.local` (or similar) in your client directory. Store your **MongoDB credentials** and **Firebase configuration keys** securely within them.
4.  **Run the Application:**
    Start both the client and server locally:
    ```bash
    # In the server directory
    npm start 

    # In the client directory (e.g., for Vite)
    npm run dev 
    ```
