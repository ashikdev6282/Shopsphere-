# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




# 🛍️ ShopSphere – Full-Stack E-Commerce Web Application

ShopSphere is a modern, production-ready e-commerce platform built using **React, Redux Toolkit, and Firebase**.  
It includes **real-time user ↔ admin chat**, role-based access, and a smooth, responsive UI designed for scalability.

🔗 **Live Demo:** shopsphere-lime.vercel.app  
📦 **Frontend:** React + Redux Toolkit  
🔥 **Backend:** Firebase (Auth + Firestore)

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Email & Password authentication
- Google OAuth login
- Role-based access control (User / Admin)
- Protected routes
- Secure Firestore rules

### 🛒 E-Commerce Functionality
- Product listing & detailed product pages
- Cart with persistence
- Wishlist management
- Order placement & order history
- Product reviews & ratings
- User profile management

### 💬 Real-Time User ↔ Admin Support Chat
- Firestore real-time messaging
- Typing indicators (User ↔ Admin)
- Unread message count
- Read receipts
- Message notifications
- Online / offline admin presence

### 🧑‍💼 Admin Dashboard
- Admin-only protected routes
- Customer management
- Real-time support chat panel
- Unread chat badges
- Order & product management (extendable)

### 🎨 UI / UX Enhancements
- Fully responsive design
- Smooth animations using Framer Motion
- SweetAlert2 confirmations
- Skeleton loaders
- Clean, modern UI
- Mobile-friendly navigation

---

## 🧰 Tech Stack

| Technology | Purpose |
|---------|---------|
| React | Frontend framework |
| Redux Toolkit | State management |
| Firebase Authentication | User authentication |
| Cloud Firestore | Real-time database |
| Tailwind CSS / CSS | Styling |
| Framer Motion | Animations |
| SweetAlert2 | Alerts & confirmations |
| Vercel | Deployment |

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
