# Novus — Full‑Stack E‑commerce Platform

> Professional, ready-to-paste `README.md` plus supporting documentation (`.env.example` templates, `CONTRIBUTING.md`, `SECURITY.md`, `DEPLOYMENT.md`) for the Novus repository.

---

## 📌 Repository

**GitHub:** `https://github.com/Sadikhal/novus.git`

**Live previews**

* Client: [https://novus-5plg.onrender.com](https://novus-5plg.onrender.com)
* Admin Dashboard: [https://novuss.onrender.com](https://novuss.onrender.com)

**Demo credentials (examples)**

* **Admin:** `novus56@gmail.com` / `Novus@123`
* **Seller (example):** `glowera@gmail.com` / `Glowera@123`
* **Customer (example):** `sanu@gmail.com` / `Sanu@123`

> Note: Account creation uses OTP email verification — check Gmail **Spam** folder for OTPs and order confirmation emails.

---

# README.md

```markdown
# Novus

**Novus** is a production-grade, multi-role e-commerce platform built with modern web technologies. It includes separate interfaces for **Customers**, **Sellers**, and **Admins**, real-time chat, advanced analytics, and secure payments.

## Demo & Repo
- GitHub: https://github.com/Sadikhal/novus.git
- Client preview: https://novus-5plg.onrender.com
- Admin dashboard preview: https://novuss.onrender.com

## Table of Contents
1. Project Overview
2. Key Features
3. Tech Stack
4. Repo Structure
5. Quick Start
6. Environment Variables
7. Running Locally
8. Deploying
9. Architecture Notes
10. Security
11. Troubleshooting
12. Contributing
13. License
14. Contact

## Project Overview
Novus is a full featured e-commerce platform demonstrating modern full-stack engineering, including real-time features, analytics, and a multi-role architecture supporting Customers, Sellers and Admins.

## Key Features
- Multi-role Authentication (Customer / Seller / Admin)
- Real-time chat with Socket.IO (typing indicators, presence)
- Product, Category, Brand management and reviews
- Persistent cart & wishlist (Redux Toolkit + redux-persist)
- Secure Stripe payment integration
- Admin analytics dashboard (Recharts)
- Email (OTP & notifications) via SMTP/SendGrid
- Cloudinary for media uploads

## Tech Stack
**Frontend (Client)**: React 19 + Vite, Redux Toolkit, Tailwind CSS, React Router v7,
React Hook Form, Stripe React

**Admin Dashboard**: React 19 + Vite, Ant Design, Recharts

**Backend**: Node.js + Express, MongoDB + Mongoose, Socket.IO, JWT, bcrypt,
Stripe, Nodemailer

## Repo Structure
```

novus/
├─ client/         # Customer-facing web app (Vite + React)
├─ dashboard/      # Admin dashboard (Vite + React + Antd)
├─ server/         # API server (Express + Socket.IO + Stripe + Mongoose)
├─ README.md
└─ .gitignore

````

## Quick Start (Local Development)
### Prerequisites
- Node.js v18+ and npm
- MongoDB (Atlas or local)
- Stripe account (test keys)
- Cloudinary (optional)
- Email provider credentials (SendGrid, Mailtrap, or SMTP)

### Clone
```bash
git clone https://github.com/Sadikhal/novus.git
cd novus
````

### Server

```bash
cd server
npm install
cp .env.example .env   # edit .env with real values
npm run dev             # or npm start depending on scripts
```

### Client (Customer)

```bash
cd ../client
npm install
cp .env.example .env   # edit values
npm run dev
```

### Dashboard (Admin)

```bash
cd ../dashboard
npm install
cp .env.example .env
npm run dev
```

Visits:

* Client: `http://localhost:5173` (Vite default)
* Dashboard: check console output for port
* API: `http://localhost:5000` (server default)

## Environment variables

See `.env.example` files (project root below) and do **not** commit real secrets.

## Running Tests / Lint

* Add or run test scripts if available in each package's `package.json`.

## Production & Deploy

1. Build frontends: `npm run build` in `client` and `dashboard`.
2. Deploy `server` on Render/Heroku/Railway and serve built static assets or host frontends separately on Vercel/Netlify.
3. Configure production environment variables (Mongo URI, Stripe keys, Cloudinary, Email credentials).

## Architecture Notes

* RESTful API with Socket.IO for real-time features.
* Redux Toolkit + redux-persist for client-side state.
* Modular server structure (controllers/services/models).

## Security

* Keep `.env` secret; use environment variables at host.
* Use HTTPS and secure cookie settings in production.
* Validate & sanitize inputs on the server.
* Use strong `JWT_SECRET` and rotate keys when necessary.

## Troubleshooting

* **Emails not delivered:** check Spam folder or Mailtrap during local dev.
* **Stripe webhooks:** use `stripe-cli` for local testing or expose a publicly reachable endpoint.
* **Socket.IO issues:** verify client uses the correct server URL and CORS settings.

## Contributing

See `CONTRIBUTING.md` in repository.

## License

This project is available under the **MIT License**. Add `LICENSE` file at repo root.

## Contact

Maintainer: Sadikhali P.V.
GitHub: [https://github.com/Sadikhal](https://github.com/Sadikhal)

```
```

---

# `.env.example` templates

```text
# server/.env.example
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/novus?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=SG.xxxx
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
CLIENT_URL=http://localhost:5173
```

```text
# client/.env.example (Vite vars must be prefixed with VITE_)
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUB_KEY=pk_test_xxx
VITE_CLIENT_URL=http://localhost:5173
```

```text
# dashboard/.env.example
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ADMIN_CLIENT_URL=http://localhost:3000
```

---

# CONTRIBUTING.md

```markdown
# Contributing to Novus
Thanks for your interest in contributing! Please follow these guidelines to make the process smooth.

## How to contribute
1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and add tests if applicable
4. Ensure linting and tests pass
5. Commit with meaningful message and push
6. Open a Pull Request describing the change

## Code style
- Follow the existing project ESLint rules
- Use descriptive commit messages

## Reporting bugs
Open an issue with steps to reproduce, expected vs actual behavior, and logs if available.

## Feature requests
Open a discussion or issue with a short proposal and expected benefit.
```

---

# SECURITY.md

```markdown
# Security Policy
If you discover a security vulnerability, please report it privately by opening an issue marked **security** or emailing the maintainer at the address in the repo profile.

## Responsible disclosure
- Provide a clear, reproducible test case
- Do not publicly disclose vulnerabilities until a fix is available

## Production recommendations
- Do not commit secrets
- Use HTTPS and secure cookies
- Rotate API keys and secrets periodically
```

---

# DEPLOYMENT.md (quick guide)

```markdown
# Deployment Guide (Render / Vercel / Netlify)

## Recommended architecture
- Deploy `server` to Render / Railway / Heroku
- Deploy `client` and `dashboard` as static frontends to Vercel / Netlify

## Server (Render)
1. Create a new Web Service on Render
2. Connect GitHub repo and choose `server` directory
3. Set build & start commands (e.g. `npm install && npm run build` and `npm run start` or `npm run dev` for dev)
4. Configure environment variables on Render dashboard (MONGO_URL, STRIPE keys, CLOUDINARY, EMAIL)
5. If using Stripe webhooks, add `STRIPE_WEBHOOK_SECRET` to Render

## Client / Dashboard (Vercel)
1. Create new project, point to `client` or `dashboard` directory
2. Add VITE env vars on Vercel (VITE_API_BASE_URL, VITE_STRIPE_PUB_KEY)
3. Set build command `npm run build` and output directory `dist`

## Notes
- Ensure CORS on server allows frontend origins.
- Use HTTPS in production and set cookie `secure: true`.
```

---

# Example `README` commit checklist

* [ ] Add `README.md` to repo root
* [ ] Add `server/.env.example`, `client/.env.example`, `dashboard/.env.example`
* [ ] Add `CONTRIBUTING.md`, `SECURITY.md`, `DEPLOYMENT.md`
* [ ] Add `LICENSE` (MIT) if desired

---

# Helpful commit message (example)

```
chore(docs): add README, env examples, CONTRIBUTING, SECURITY and DEPLOYMENT guides
```

---

*End of document.*
