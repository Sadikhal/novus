[# Novus - Full-Stack E-commerce Platform 🛍️

![Novus Banner](https://via.placeholder.com/1200x400/2563EB/FFFFFF?text=NOVUS+E-COMMERCE+PLATFORM)
*A comprehensive, multi-role e-commerce solution built with cutting-edge technologies*

## 🌟 Live Demos

| Platform | Link | Status |
|----------|------|---------|
| 🛒 **Client Application** | [https://novus-5plg.onrender.com](https://novus-5plg.onrender.com) | ✅ Live |
| 📊 **Admin Dashboard** | [https://novuss.onrender.com](https://novuss.onrender.com) | ✅ Live |
| 🖥️ **GitHub Repository** | [https://github.com/Sadikhal/novus.git](https://github.com/Sadikhal/novus.git) | 🔄 Active |

---

## 🚀 Quick Start

### Test Credentials

#### 👑 Admin Access
```bash
Email: novus56@gmail.com
Password: Novus@123
```

#### 🏪 Seller Access
```bash
Email: glowera@gmail.com
Password: Glowera@123
```

#### 👤 Customer Access
```bash
Email: sanu@gmail.com
Password: Sanu@123
```

> **📧 Email Note**: For OTP verification and order confirmations, please check your **SPAM folder** in Gmail as automated emails might be filtered there.

---

## ✨ Key Features

### 🎯 Multi-Role Architecture
- **👤 Customers** - Complete shopping experience
- **🏪 Sellers** - Product management & analytics
- **👑 Admins** - Platform oversight & management

### 🔄 Real-Time Communication
- 💬 Live chat with Socket.IO
- ⏰ Typing indicators
- 🟢 Online status tracking
- 🔔 Real-time notifications

### 🛍️ Advanced E-commerce
- 📦 Product catalog with advanced filtering
- 🛒 Persistent shopping cart
- ❤️ Wishlist functionality
- 📊 Order tracking & history
- ⭐ Review & rating system

### 💳 Secure Payments
- 🔒 Stripe payment integration
- 💳 Multiple payment methods
- 📋 Transaction history
- 🛡️ Secure checkout process

### 📊 Analytics & Insights
- 📈 Sales performance metrics
- 👥 User behavior analytics
- 🏪 Brand performance tracking
- 📊 Real-time data visualization

### 🎨 Modern UI/UX
- 📱 Mobile-first responsive design
- 🎭 Smooth animations with Framer Motion
- 🎯 Professional Ant Design components
- 🎨 Tailwind CSS with DaisyUI

---

## 🛠️ Technology Stack

### Frontend (Client)
| Technology | Purpose |
|------------|---------|
| **React 19** + Vite | Core framework & build tool |
| **Redux Toolkit** + Persist | State management |
| **Tailwind CSS v4** + DaisyUI | Styling & components |
| **React Router v7** | Navigation & routing |
| **Framer Motion** | Animations & transitions |
| **Socket.IO Client** | Real-time features |
| **React Hook Form** | Form management & validation |
| **Stripe React** | Payment processing |

### Admin Dashboard
| Technology | Purpose |
|------------|---------|
| **React 19** + Vite | Core framework |
| **Ant Design** | UI component library |
| **Recharts** | Data visualization |
| **Advanced Analytics** | Performance metrics |

### Backend (Server)
| Technology | Purpose |
|------------|---------|
| **Node.js** + Express.js | Server runtime & framework |
| **MongoDB** + Mongoose | Database & ODM |
| **Socket.IO** | Real-time communication |
| **JWT** + bcrypt | Authentication & security |
| **Stripe API** | Payment processing |
| **Nodemailer** | Email services |
| **Cloudinary** | Media management |

---

## 🏗️ Project Structure

```
novus/
├── 🖥️ client/                 # Customer-facing React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── routes/          # Page components
│   │   ├── store/           # Redux store configuration
│   │   └── utils/           # Utility functions
│
├── 📊 dashboard/            # Admin dashboard React application
│   ├── src/
│   │   ├── components/      # Dashboard components
│   │   ├── pages/           # Admin pages
│   │   └── charts/          # Analytics & charts
│
├── 🔧 server/               # Backend Node.js application
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
│
└── 📚 Documentation
```

---

## ⚡ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud)
- **Stripe Account**
- **Cloudinary Account**

### 1. Clone Repository
```bash
git clone https://github.com/Sadikhal/novus.git
cd novus
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Configure environment variables
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# STRIPE_SECRET_KEY=your_stripe_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password

# Start development server
npm run dev
```

### 3. Client Application
```bash
cd client

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Configure environment variables
# VITE_API_URL=your_backend_api_url
# VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Start development server
npm run dev
```

### 4. Admin Dashboard
```bash
cd dashboard

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Configure environment variables
# VITE_API_URL=your_backend_api_url

# Start development server
npm run dev
```

---

## 🔧 Core Functionalities

### 👥 User Management
- ✅ Multi-role registration & authentication
- ✅ Email verification with OTP
- ✅ Profile management with addresses
- ✅ Password reset functionality
- ✅ Real-time online status

### 📦 Product System
- ✅ CRUD operations for products
- ✅ Category & brand management
- ✅ Inventory tracking
- ✅ Advanced search & filtering
- ✅ Review & rating system

### 🛒 Shopping Experience
- ✅ Persistent shopping cart
- ✅ Wishlist functionality
- ✅ Multi-step checkout process
- ✅ Order tracking & history
- ✅ Delivery status updates

### 💬 Real-time Features
- ✅ Live chat between users & sellers
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Real-time notifications
- ✅ Help desk system

### 📊 Analytics
- ✅ Sales performance metrics
- ✅ User engagement analytics
- ✅ Brand performance tracking
- ✅ Real-time dashboard updates
- ✅ Comprehensive reporting

---

## 🛡️ Security Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 🎯 Role-based access control
- 🌐 CORS protection
- ✅ Input validation & sanitization
- 💳 Secure payment processing with Stripe

## ⚡ Performance Optimizations

- 🚀 Vite for fast builds & HMR
- 💾 Redux with persistence
- 📦 Lazy loading & code splitting
- 🖼️ Image optimization with Cloudinary
- 🗃️ Efficient database queries
- 🔄 Real-time data synchronization

---

## 🚀 Deployment

The application is configured for deployment on **Render.com**. Each component has its own deployment configuration.

### Environment Variables

#### Server (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=your_client_url
DASHBOARD_URL=your_dashboard_url
```

#### Client (.env)
```env
VITE_API_URL=your_backend_api_url
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sadik Ali** 
- 📧 Email: novus56@gmail.com
- 💼 GitHub: [@Sadikhal](https://github.com/Sadikhal)

---

## 🙏 Acknowledgments

- **React Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS framework
- **Ant Design** - Comprehensive component library
- **Stripe** - Payment processing API
- **Socket.IO** - Real-time communication
- **Vite** - Fast build tool

---

<div align="center">

### ⭐ **If you find this project helpful, don't forget to give it a star!**

**Built with ❤️ using Modern Web Technologies**

---
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8.17-47A248?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwindcss)

</div>
](https://gitdocs1.s3.amazonaws.com/digests/sadikhal-novus.git/393d4a80-46e1-4e24-bbae-41135399059b.txt)
