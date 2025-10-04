# Novus — Full-Stack E-commerce Platform 🛍️

![Novus Banner](https://res.cloudinary.com/dftleqqgr/image/upload/v1759568258/Novus_mtkevp.jpg)

**A production-ready, multi-role e-commerce platform** (Customer, Seller, Admin) with real-time chat, analytics, secure payments and modern frontend tooling — built with React, Node.js, MongoDB, Socket.IO and Stripe.

---

## 🔗 Live Demos & Repo

| Platform              |                                                                   Link |   Status  |
| --------------------- | ---------------------------------------------------------------------: | :-------: |
| Client (Customer app) |     [https://novus-5plg.onrender.com](https://novus-5plg.onrender.com) |   ✅ Live  |
| Admin Dashboard       |             [https://novuss.onrender.com](https://novuss.onrender.com) |   ✅ Live  |
| GitHub Repository     | [https://github.com/Sadikhal/novus](https://github.com/Sadikhal/novus) | 🔄 Active |

> **Email note:** OTP / confirmation emails for demo accounts may end up in Gmail's **Spam** folder. Check there if you don't receive email immediately.

---

## 📌 Table of Contents

1. [Project Overview](#project-overview)
2. [Demo Credentials (demo-only)](#demo-credentials-demo-only)
3. [Highlights & Key Features](#highlights--key-features)
4. [Tech Stack](#tech-stack)
5. [Repository Structure](#repository-structure)
6. [Screenshots](#screenshots)
7. [Getting Started (Local Dev)](#getting-started-local-dev)
8. [Environment Variables (.env.example)](#environment-variables-envexample)
9. [Run & Build Commands](#run--build-commands)
10. [Deployment (production tips)](#deployment-production-tips)
11. [Security & Best Practices](#security--best-practices)
12. [Contributing](#contributing)
13. [License & Author](#license--author)

---

# Project Overview

**Novus** is a full-featured e-commerce platform demonstrating modern full-stack engineering: separated client and admin frontends, an API server with real-time features, persistent state and Stripe payments. The platform is built for production-readiness, extensibility and good developer DX (Vite, Redux Toolkit, modular server code).

Use cases: multi-seller marketplace, internal company store, proof-of-concept for production e-commerce apps.

---

# Demo Credentials (demo-only)

> **Important:** These accounts are demo-only and should be rotated or removed before publishing production data.

* **Admin**

  * Email: `novus56@gmail.com`
  * Password: `Novus@123`

* **Seller (example)**

  * Email: `glowera@gmail.com`
  * Password: `Glowera@123`

* **Customer (example)**

  * Email: `sanu@gmail.com`
  * Password: `Sanu@123`

If you plan to publish the repository publicly, remove or clearly mark these credentials as demo-only in a dedicated `DEMO_CREDENTIALS.md` and consider rotating them often.

---

# Highlights & Key Features

* **Multi-Role System**: Customers, Sellers, Admins with role-based access control.
* **Real-time Communication**: Socket.IO chat, typing indicators, online presence, real-time notifications.
* **E-commerce Core**: Product CRUD, categories, brands, inventory, reviews & ratings, search & filters.
* **Shopping Experience**: Persistent cart (redux-persist), wishlist, multi-step checkout, order lifecycle & tracking.
* **Payments**: Stripe integration (client + server) with secure payment workflow.
* **Admin Analytics**: Recharts-based dashboards, sales & brand analytics, filtering by date ranges.
* **Media & Content**: Cloudinary integration, banner management, announcements, events.
* **Modern UI**: Tailwind CSS (mobile-first), DaisyUI & Ant Design for admin, Framer Motion animations.
* **Security**: JWT, bcrypt hashing, input validation, otp verification and CORS protections.
* **Dev DX**: Vite for fast HMR & builds, ESLint integration, modular code structure.

---

# Tech Stack

**Frontend (Client)**

* React 19 + Vite
* Redux Toolkit + redux-persist
* Tailwind CSS v4 + DaisyUI
* React Router v7, React Hook Form, Zod , cloudinary
* Socket.IO Client, Stripe React SDK, React Quill

**Admin Dashboard**

* React 19 + Vite
* Ant Design, Recharts

**Backend**

* Node.js + Express.js
* MongoDB + Mongoose
* Socket.IO (real-time)
* JWT auth, bcrypt password hashing
* Stripe, Nodemailer (email), Cloudinary (media)

---

# Repository Structure (high-level)

```
novus/
├── client/         # Customer React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── redux/
│   │   └── routes/
├── dashboard/      # Admin React app (Vite + Antd)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── redux/
│   │   └── routes/
├── server/         # API server (Express, Mongoose, Socket.IO)
│   ├── controllers/
│   ├── lib/
│   ├── models/
│   ├── routes/
│   ├── mailtrap/
│   ├── middleware/
├── docs/           # screenshots, architecture diagrams (recommended)
├── .github/        # CI workflows (optional)
└── README.md
```

---

# Screenshots

* Homepage
  ![Home](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569222/Screenshot_239_dkab1f.png)

* Homepage / Products
  ![products](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569222/Screenshot_240_zlyhzr.png)

* Product Details
  ![Product](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569221/Screenshot_241_yptazn.png)

*messages
  ![messages](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569219/Screenshot_242_zwwnst.png)

* Admin Dashboard (Sales Analytics)
  ![Dashboard](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569218/Screenshot_238_d5hj3m.png)
  ![Dashboard](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569218/Screenshot_238_d5hj3m.png)

*admin/brands
   ![brand](https://res.cloudinary.com/dftleqqgr/image/upload/v1759569218/Screenshot_243_aqyjbz.png)
---

# Getting Started (Local Development)

## Prerequisites

* Node.js v18+
* npm (or pnpm/yarn)
* MongoDB (local or Atlas)
* Stripe account (test keys)
* Cloudinary account (optional)
* SMTP/SendGrid/Mailtrap for emails

## Clone repository

```bash
git clone https://github.com/Sadikhal/novus.git
cd novus
```

### 1) Backend (server)

```bash
cd server
npm install
cp .env.example .env
# edit server/.env with your values (see .env example below)
npm run dev
# or for production: npm start
```

Server default: `http://localhost:5000` (check server console for exact port).

### 2) Client (customer app)

```bash
cd ../client
npm install
cp .env.example .env
# edit client/.env with your values
npm run dev
```

Vite will show the local dev URL (usually `http://localhost:5173`).

### 3) Dashboard (admin)

```bash
cd ../dashboard
npm install
cp .env.example .env
# edit dashboard/.env with your values
npm run dev
```

---

# Environment Variables (`.env.example`)

Create `.env` files by copying the `.env.example` in each package and filling values. Standardize var names across code.

### server/.env.example

```env
MONGO_URL = 
ADMIN_ID = 68a86258dfa0348dcf288c11
PORT = 3002
JWT_KEY=
CLIENT_URL = http://localhost:5173
DASHBOARD_URL = http://localhost:5174
STRIPE = 
NODE_ENV= production
SMTP_MAIL=
SENDGRID_API_KEY =

```

### client/.env.example (Vite — must start with VITE_)

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_CLIENT_URL=http://localhost:5173
```

### dashboard/.env.example

```env
VITE_UPLOAD_LINK =
VITE_BASE_URL = http://localhost:3002/api
VITE_SOCKET_URL = http://localhost:3002
VITE_ADMIN_ID = 68a86258dfa0348dcf288c11
VITE_STRIPE_PUBLISH_KEY = 
```

> **Security note:** Never commit `.env` with secrets. Use `.env.example` for placeholders only.

---

# Run & Build Commands

**Server**

```bash
# dev
cd server
node app.js

# build & start (production)
npm run build
npm start
```

**Client**

```bash
cd client
npm run dev    # dev
npm run build  # production build -> dist/
```

**Dashboard**

```bash
cd dashboard
npm run dev
npm run build
```

---

# Deployment (production tips)

Recommended hosting patterns:

* **Server (API + Socket.IO)**: Deploy on Render / Railway / DigitalOcean / Heroku / AWS Elastic Beanstalk. Ensure web sockets are supported and configure NODE_ENV=production.
* **Frontend (client & dashboard)**: Deploy as static apps to Vercel / Netlify (point to `client` and `dashboard` builds separately).
* **Stripe **: Provide a public URL for the  endpoint and set `STRIPE` AND `STRIPE_PUBLISH_KEY` in production env.
* **Environment & secrets**: Configure `MONGODB_URI`, `STRIPE`, `CLOUDINARY_*`, and `EMAIL_*` in host settings.
* **CORS**: Whitelist your frontend origins in server CORS config (CLIENT_URL, DASHBOARD_URL).
* **HTTPS**: Always use HTTPS in production and set secure cookies.

---

# Security & Best Practices

* **Secrets:** Never commit `.env` or credentials to Git. Use secret management from your host (Render/Vercel).
* **Passwords:** Store only salted bcrypt hashes. Use strong `JWT_KEY` and rotate keys periodically.
* **Cookies:** Use secure, httpOnly cookies in production with `SameSite` restrictions.
* **Validation:** Validate and sanitize all user input on server-side (use zod, express-validator or custom middleware).
* **File uploads:** Limit file size and validate MIME types for uploads to Cloudinary.
* **Email safety:** Use Mailtrap for local testing; do not send test emails to real users.

---

# Contributing

Thanks for your interest in contributing! Please follow the workflow below:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Make changes & add tests where applicable
4. Run linters and tests: `npm run lint`, `npm test` (if configured)
5. Commit & push: `git commit -m "feat: add awesome feature"` & `git push origin feature/awesome-feature`
6. Open a Pull Request with a clear description and screenshots if UI changes

---


# License & Author

**License:** MIT — add `LICENSE` file at repo root.

**Author / Maintainer:** Sadik Ali

* GitHub: [https://github.com/Sadikhal](https://github.com/Sadikhal)
* Email: [sadikhalikvr@gmail.com](mailto:sadikhalikvr@gmail.com)

---
