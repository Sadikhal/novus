# Novus - Full-Stack E-commerce Platform

![Novus Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=Novus+-+Modern+E-commerce+Platform)

A comprehensive, multi-role e-commerce platform built with modern web technologies, featuring separate interfaces for customers, sellers, and administrators with real-time communication, advanced analytics, and complete shopping experience.

## 🌟 Live Demos

- **Client Application**: [https://novus-5plg.onrender.com](https://novus-5plg.onrender.com)
- **Admin Dashboard**: [https://novuss.onrender.com](https://novuss.onrender.com)

### Demo Credentials

**Admin Access:**
- Email: `novus56@gmail.com`
- Password: `Novus@123`

**Seller Access:**
- Email: `glowera@gmail.com`
- Password: `Glowera@123`

**Customer Access:**
- Email: `sanu@gmail.com`
- Password: `Sanu@123`

> **Note**: For email verification and order confirmations, please check your **spam folder** in Gmail as automated emails might be filtered there.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

### Multi-Role System
- **Customer Interface**: Complete shopping experience with cart, wishlist, and order management
- **Seller Portal**: Product management, order processing, and sales analytics
- **Admin Dashboard**: Comprehensive platform management and analytics

### E-commerce Core
- 🛍️ Product catalog with advanced filtering and search
- 🛒 Shopping cart with persistent storage
- 💝 Wishlist functionality
- 📦 Complete order management system
- ⭐ Product reviews and ratings
- 🏷️ Brand and category management

### Real-time Features
- 💬 Live chat system with Socket.IO
- 🔔 Real-time notifications
- 👁️‍🗨️ Typing indicators and online status
- 📊 Live analytics and dashboard updates

### Payment & Security
- 💳 Stripe payment gateway integration
- 🔐 JWT authentication with role-based access
- 🛡️ Secure password hashing with bcrypt
- 📧 Email verification and password reset

### Advanced Analytics
- 📈 Sales performance metrics
- 👥 User behavior analytics
- 📊 Brand performance tracking
- 📱 Responsive data visualizations

## 🛠️ Tech Stack

### Frontend (Client)
- **React 19** with Vite
- **Redux Toolkit** with Redux Persist
- **Tailwind CSS v4** with DaisyUI
- **React Router v7**
- **Framer Motion** for animations
- **Socket.IO Client** for real-time features
- **React Hook Form** with validation
- **Stripe React** for payments

### Admin Dashboard
- **React 19** with Vite
- **Ant Design** component library
- **Recharts** for data visualization
- Advanced analytics and reporting

### Backend (Server)
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **JWT** authentication
- **Stripe API** integration
- **Nodemailer** for email services
- **Cloudinary** for media management

## 🏗️ Architecture

```
novus/
├── client/                 # Customer-facing React application
├── dashboard/              # Admin dashboard React application
├── server/                 # Express.js backend API
├── packages.json           # Root package.json
└── README.md
```

### Key Directories

**Client Application:**
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Route components
│   ├── redux/             # State management
│   ├── routes/            # Route definitions
│   └── utils/             # Utility functions
```

**Admin Dashboard:**
```
dashboard/
├── src/
│   ├── components/        # Admin components
│   ├── pages/             # Dashboard pages
│   └── redux/             # Admin state management
```

**Backend Server:**
```
server/
├── controllers/           # Route controllers
├── models/               # MongoDB models
├── routes/               # API routes
├── middleware/           # Custom middleware
└── utils/                # Server utilities
```

## ⚙️ Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas or local MongoDB instance
- Stripe account for payments

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Sadikhal/novus.git
cd novus
```

2. **Install dependencies for all projects**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install dashboard dependencies
cd ../dashboard
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Set up environment variables**
Create `.env` files in each project directory with the required variables (see [Environment Variables](#environment-variables))

4. **Start the development servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

**Terminal 3 - Dashboard:**
```bash
cd dashboard
npm run dev
```

The applications will be available at:
- Client: http://localhost:5173
- Dashboard: http://localhost:5174
- Server: http://localhost:5000

## 🔧 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_SERVICE=Gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_SOCKET_URL=http://localhost:5000
```

### Dashboard (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_TOKEN=your_admin_token
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (Seller/Admin)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Real-time Features
- WebSocket connections for live chat
- Real-time notifications
- Online status tracking

## 🚀 Deployment

### Using Render (Current Deployment)

1. **Backend Deployment**
   - Connect your GitHub repository to Render
   - Set root directory to `server`
   - Add environment variables
   - Deploy

2. **Client Deployment**
   - Create a static site on Render
   - Set root directory to `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Dashboard Deployment**
   - Create a static site on Render
   - Set root directory to `dashboard`
   - Build command: `npm run build`
   - Publish directory: `dist`

### Environment-Specific Builds
```bash
# Production build
npm run build

# Preview build
npm run preview
```

## 🤝 Contributing

We welcome contributions to Novus! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks conventions
- Use Redux Toolkit for state management
- Implement responsive design with Tailwind CSS
- Write clean, documented code
- Test all features thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: sadikhalder1234@gmail.com
- GitHub Issues: [Create an issue](https://github.com/Sadikhal/novus/issues)
- Documentation: [Project Wiki](https://github.com/Sadikhal/novus/wiki)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Ant Design](https://ant.design/) for admin components
- [Stripe](https://stripe.com/) for payment processing
- [Socket.IO](https://socket.io/) for real-time features

---

<div align="center">

**Built with ❤️ using Modern Web Technologies**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>
