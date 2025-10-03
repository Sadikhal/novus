# Novus

**Enterprise-grade multi-role e‑commerce platform** — Customer, Seller and Admin interfaces, real-time communication, analytics, Stripe payments, and a full-featured shopping experience.

---

## Project Overview

Novus is a modular, scalable e‑commerce platform built with modern web technologies. It demonstrates a production-minded full‑stack architecture, combining a React + Vite frontend, a React Admin Dashboard, and a Node.js + Express backend with MongoDB. Real‑time features are implemented with Socket.IO and media is handled through Cloudinary. The platform supports role-based access control (Customer, Seller, Admin), a complete product lifecycle, order processing, and analytics.

**Live previews**

* Client (storefront): `https://novus-5plg.onrender.com`
* Dashboard (admin): `https://novuss.onrender.com`

**Demo accounts**

* Admin: `novus56@gmail.com` / `Novus@123` (Admin panel)
* Seller example: `glowera@gmail.com` / `Glowera@123`
* Customer example: `sanu@gmail.com` / `Sanu@123`

> When creating accounts or orders the app may send verification or order emails — check the Spam folder in Gmail if you do not see them in your inbox.

---

## Key Features

* Multi‑role user system (Customer, Seller, Admin)
* Product CRUD with categories & brands
* Cart, Wishlist, Checkout flow with Stripe integration
* Order lifecycle and delivery tracking
* Reviews & ratings
* Real‑time chat, typing indicators, online presence (Socket.IO)
* Analytics dashboard (Recharts) and sales reports
* Image upload & cropping (Cloudinary + react-image-crop)
* Rich text content (React Quill)
* Responsive UI with Tailwind CSS, Ant Design for admin

---

## Tech Stack

* **Frontend (Client)**: React 19, Vite, Redux Toolkit, React Hook Form, Tailwind CSS, Framer Motion, React Router v7
* **Admin Dashboard**: React 19, Vite, Ant Design, Recharts
* **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO
* **Auth & Security**: JWT, bcrypt
* **Payments**: Stripe
* **Email**: Nodemailer (or SendGrid as configured)
* **Media**: Cloudinary
* **Dev tooling**: ESLint, Nodemon, Vite

---

## Repository Structure (high level)

```
novus/
├─ client/           # React storefront (Vite)
├─ dashboard/        # React admin dashboard (Vite + Antd)
└─ server/           # Express API + Socket.IO
```

> See the repository for more granular folder structure and component organization.

---

## Getting Started — Local Development

> These instructions assume you have Node.js (v18+ recommended) and npm installed.

### 1. Clone the repository

```bash
git clone https://github.com/Sadikhal/novus.git
cd novus
```

### 2. Install dependencies

Install per-package (client, dashboard, server):

```bash
# from repo root (if using workspaces) or from each package folder
cd client && npm install
cd ../dashboard && npm install
cd ../server && npm install
```

### 3. Environment variables

Create `.env` files for each package using the example below. Replace placeholder values with your own credentials.

**server/.env.example**

```
NODE_ENV=development
PORT=3002
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/novus?retryWrites=true&w=majority
JWT_KEY=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=unsigned_preset_name
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
CLIENT_URL=http://localhost:5173
```

**client/.env (example)**

```
VITE_API_URL=http://localhost:3002/api
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**dashboard/.env (example)**

```
VITE_API_URL=http://localhost:3002/api
```

> Keep secrets out of source control. Use `.env.local` or secret management for production deployments.

### 4. Start the apps (development)

Open three terminals (client, dashboard, server) and run:

```bash
# server (API)
cd server
npm run dev        # runs nodemon or equivalent

# client (storefront)
cd ../client
npm run dev        # Vite dev server (default: http://localhost:5173)

# dashboard (admin)
cd ../dashboard
npm run dev        # Vite dev server (another port)
```

### 5. Build / Preview (production)

```bash
# Build client & dashboard
cd client && npm run build
cd ../dashboard && npm run build

# Start server in production mode
cd ../server
npm start           # or node dist/index.js depending on setup
```

---

## Environment & Deployment Notes

* **MongoDB Atlas**: Recommended for production. Ensure IP whitelist and proper credentials.
* **Cloudinary**: Set up unsigned upload preset if you use client-side uploads; otherwise use signed server uploads.
* **Stripe**: Configure webhook endpoints (for order/payment status updates) and set `STRIPE_WEBHOOK_SECRET` for webhook verification.
* **Emails**: You can configure Mailtrap, SendGrid or another SMTP provider. Test in staging.
* **Render / Vercel / Heroku**: The app has been previewed on Render — adjust build/start commands per service. Ensure environment variables are set in the deployment dashboard and that the server allows CORS from your client URL.

---

## Common Scripts (example)

> Confirm actual scripts in each package's `package.json`. Typical commands:

* `npm run dev` — start development server
* `npm run build` — build for production
* `npm run preview` — preview a build (Vite)
* `npm start` — start production server

---

## Testing & Quality

* ESLint is configured. Run `npm run lint` if configured in each package.
* Add unit/integration tests (Jest / React Testing Library) as needed.

---

## Troubleshooting

* **Emails not received**: Check Spam folder. If using Mailtrap, verify credentials.
* **CORS issues**: Ensure `CLIENT_URL` is included in server CORS allowed origins.
* **Image uploads failing**: Verify Cloudinary credentials and upload preset.
* **Stripe webhooks**: When testing locally, use `stripe-cli` or ngrok to forward webhooks to your local server.

---

## Contribution Guidelines

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Commit changes with clear messages.
3. Open a pull request describing the change and rationale.
4. Add tests and ensure ESLint passes.

Please be respectful and include descriptive commit messages. For major architectural changes, open an issue first.

---

## Security & Best Practices

* Do not commit `.env` or secrets. Use `.gitignore`.
* Rotate API keys if they are compromised.
* Validate and sanitize user input on both client and server.
* Use HTTPS in production and secure cookies for JWT tokens.

---

## License

MIT — see `LICENSE` file.

---

## Acknowledgements

Built with ❤️ using React, Node, MongoDB, and many open-source libraries.

---

## Contact

Repository: `https://github.com/Sadikhal/novus.git`
For questions or help, open an issue in the repository or message the maintainer.
