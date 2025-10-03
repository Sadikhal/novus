# Novus - Full-Stack E-commerce Platform

Novus is a comprehensive, multi-role e-commerce platform designed to provide a seamless shopping experience for customers, efficient management tools for sellers, and powerful oversight capabilities for administrators. Built with modern web technologies, it features real-time communication, advanced analytics, secure payment processing, and a complete end-to-end e-commerce workflow. The platform emphasizes scalability, security, and user-centric design, making it suitable for enterprise-grade applications.

This project demonstrates full-stack development expertise, including real-time application architecture, modular code organization, and integration of third-party services.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Features

Novus offers a robust set of features tailored to different user roles:

### Multi-Role System
- **Customer Interface**: Product browsing, search, cart management, wishlist, checkout, and order tracking.
- **Seller Interface**: Product CRUD operations, inventory management, order fulfillment, and brand analytics.
- **Admin Interface**: User management, content moderation, system-wide analytics, and performance monitoring.

### Real-Time Communication
- Live chat with Socket.IO for instant messaging between customers and sellers.
- Typing indicators, online status tracking, and real-time notifications.

### E-commerce Core
- Advanced product management with categories, brands, reviews, and ratings.
- Shopping cart persistence and wishlist functionality.
- Secure checkout with address validation and delivery tracking.

### Payment and Security
- Integrated Stripe payment gateway for secure transactions.
- JWT-based authentication, bcrypt password hashing, and role-based access control (RBAC).

### Analytics and Reporting
- Real-time dashboards with charts for sales, user engagement, and brand performance.
- Daily, weekly, and monthly metrics using Recharts.

### Content Management
- Dynamic banners, announcements, and event scheduling.
- Media handling with Cloudinary for image uploads and optimization.

### Additional Highlights
- Responsive, mobile-first design.
- Email notifications via Nodemailer (with OTP verification for registrations).
- Optimized performance with lazy loading, caching, and Vite builds.

## Tech Stack

### Frontend (Client)
- React 19 with Vite for fast development and builds.
- Redux Toolkit with Redux Persist for state management.
- Tailwind CSS v4 with DaisyUI for styling.
- React Router v7 for navigation.
- Framer Motion for animations.
- Socket.IO Client for real-time features.
- React Hook Form with Zod for validation.
- Stripe React for payments.
- Additional libraries: Radix UI, React Quill, React Image Crop, Swiper.

### Admin Dashboard
- React 19 with Vite.
- Ant Design for UI components.
- Recharts for data visualization.
- Socket.IO Client for real-time updates.

### Backend (Server)
- Node.js with Express.js.
- MongoDB with Mongoose ODM.
- Socket.IO for real-time communication.
- JWT and Bcrypt for authentication.
- Stripe API for payments.
- Nodemailer for emails.
- Cloudinary for file management.
- Additional: CORS, Cookie-Parser.

### Dependencies
The project uses npm for package management. Key packages include:

**Server:**
- `@sendgrid/mail`, `bcrypt`, `bcryptjs`, `cookie-parser`, `cors`, `crypto`, `dotenv`, `express`, `http`, `jsonwebtoken`, `mongoose`, `nodemailer`, `nodemon`, `socket.io`, `stripe`.

**Dashboard:**
- `@hookform/resolvers`, `@radix-ui/react-*` (various), `@reduxjs/toolkit`, `@tailwindcss/vite`, `antd`, `axios`, `class-variance-authority`, `cloudinary`, `date-fns`, `emoji-picker-react`, `framer-motion`, `lucide-react`, `moment`, `react`, `react-calendar`, `react-datepicker`, `react-dom`, `react-hook-form`, `react-icons`, `react-image-crop`, `react-quill-new`, `react-redux`, `react-router-dom`, `react-select`, `react-time-picker`, `recharts`, `redux-persist`, `socket.io-client`, `swiper`, `tailwind-merge`, `tailwindcss`, `zod`.

**Client:**
- `@headlessui/react`, `@radix-ui/react-*` (various), `@reduxjs/toolkit`, `@stripe/react-stripe-js`, `@stripe/stripe-js`, `@tailwindcss/vite`, `axios`, `class-variance-authority`, `clsx`, `cmdk`, `daisyui`, `date-fns`, `dompurify`, `emoji-picker-react`, `framer-motion`, `lodash`, `lucide-react`, `moment`, `react`, `react-countup`, `react-datepicker`, `react-dom`, `react-hook-form`, `react-icons`, `react-image-crop`, `react-multi-carousel`, `react-quill-new`, `react-redux`, `react-remove-scroll`, `react-responsive`, `react-router-dom`, `react-scripts`, `recharts`, `redux-persist`, `socket.io-client`, `swiper`, `tailwind-merge`, `tailwindcss`.

## Architecture

The project is structured into three main directories:
- **client**: Customer-facing frontend.
- **dashboard**: Admin and seller dashboard.
- **server**: Backend API and real-time server.

This modular setup allows for independent development and scaling. The backend uses RESTful APIs for data exchange, with Socket.IO for real-time events. Data is stored in MongoDB with optimized schemas for products, orders, users, and more.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- Stripe account (for payment testing)
- Cloudinary account (for image uploads)
- Mailtrap or SendGrid account (for email testing)
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/Sadikhal/novus.git
cd novus
```

Install dependencies for each component:

### Backend (Server)
```bash
cd server
npm install
```

### Client (Customer Frontend)
```bash
cd ../client
npm install
```

### Dashboard (Admin/Seller)
```bash
cd ../dashboard
npm install
```

## Configuration

Create `.env` files in each directory based on the provided examples (or infer from code). Key variables include:

**Server `.env`**:
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret for JWT tokens.
- `STRIPE_SECRET_KEY`: Stripe API key.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials.
- `NODEMAILER_USER`, `NODEMAILER_PASS`: Email service credentials.
- `PORT`: Server port (default: 5000).

**Client `.env`**:
- `VITE_API_URL`: Backend API base URL (e.g., `http://localhost:5000`).
- `VITE_STRIPE_PUBLIC_KEY`: Stripe public key.
- `VITE_SOCKET_URL`: Socket.IO server URL.

**Dashboard `.env`**:
- Similar to client, with API and Socket URLs.

Note: Ensure CORS is configured in the backend to allow origins from client and dashboard.

## Running the Application

Start each component in separate terminals:

### Backend
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Client
```bash
cd client
npm run dev  # Vite development server
```

### Dashboard
```bash
cd dashboard
npm run dev  # Vite development server
```

The client will be available at `http://localhost:5173`, dashboard at `http://localhost:5174` (ports may vary).

## Usage

### Role-Based Access
- **Customer**: Register/login via client interface. Add products to cart, checkout with Stripe (test mode).
- **Seller**: Create an account as a seller, manage brands/products, and handle orders via dashboard.
- **Admin**: Oversee users, analytics, and content via dashboard.

### Test Accounts
- **Admin**: Email: `novus56@gmail.com`, Password: `Novus@123`
- **Seller**: Email: `glowera@gmail.com`, Password: `Glowera@123` (or create your own).
- **Customer**: Email: `sanu@gmail.com`, Password: `Sanu@123` (or register new).

### Important Notes
- **OTP/Email Verification**: Emails (e.g., OTPs, order confirmations) may land in the spam folder. Check spam in Gmail or your email client.
- **Payments**: Use Stripe test cards (e.g., 4242 4242 4242 4242) for checkout.
- **Real-Time Features**: Ensure Socket.IO connects properly; test chat and notifications with multiple browser sessions.

## Demo

- **Customer Preview**: [https://novus-5plg.onrender.com](https://novus-5plg.onrender.com)
- **Dashboard Preview**: [https://novuss.onrender.com](https://novuss.onrender.com)

Note: Hosted on Render; initial load may take time due to free tier cold starts.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Ensure code adheres to ESLint standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
