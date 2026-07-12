# 🍔 Foodie — Food Ordering App

A full-stack food ordering application built with **React + Vite** (frontend) and **Node.js + Express + MySQL** (backend), with **Razorpay** payment integration.

---

## 📁 Project Structure

```
food-ordering-app/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/             # Centralized configuration & DB pool
│   │   │   ├── config.js       # All environment variables (PORT, JWT, DB, Razorpay)
│   │   │   └── db.js           # MySQL connection pool
│   │   ├── controllers/        # Thin request/response handlers (MVC)
│   │   │   ├── authController.js
│   │   │   ├── menuController.js
│   │   │   └── paymentController.js
│   │   ├── database/           # Schema & setup scripts
│   │   │   ├── schema.sql      # Table definitions
│   │   │   └── setup.js        # DB initialisation runner
│   │   ├── middleware/         # Express middleware
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   ├── errorHandler.js    # Global error handler
│   │   │   ├── security.js        # Helmet, rate-limit, compression
│   │   │   └── validate.js        # Request payload validators
│   │   ├── models/             # SQL data access layer
│   │   │   ├── catalogModel.js # In-memory restaurant & food catalog
│   │   │   ├── orderModel.js   # Order persistence (MySQL)
│   │   │   └── userModel.js    # User queries (MySQL)
│   │   ├── routes/             # Express routers
│   │   │   ├── authRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   └── paymentRoutes.js
│   │   ├── services/           # Business logic layer
│   │   │   ├── authService.js  # Password hashing, JWT generation
│   │   │   ├── orderService.js # Cart validation & totals
│   │   │   └── paymentStore.js # In-memory pending payment cache
│   │   ├── utils/              # Shared utilities
│   │   │   ├── catchAsync.js   # Async error-wrapping HOF
│   │   │   └── errors.js       # Custom AppError classes
│   │   └── app.js              # Express app (middlewares, routes)
│   ├── server.js               # Entry point — boots DB + server
│   ├── package.json
│   └── .env.example
│
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── components/
    │   │   ├── common/         # CartSidebar, AuthModal
    │   │   ├── layout/         # Navbar, Header
    │   │   └── ui/             # Alert, RestaurantCard, MenuItemCard
    │   ├── constants/          # api.js, storage.js
    │   ├── context/            # NoticeContext, AuthContext, CartContext
    │   ├── pages/              # Home.jsx
    │   ├── styles/             # index.css (Tailwind)
    │   ├── utils/              # format.js (currency formatter)
    │   └── App.jsx             # Context providers wrapper
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- MySQL database (local or Railway)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/food-ordering-app.git
cd food-ordering-app
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and Razorpay keys
npm install
```

### 3. Initialize the Database
```bash
npm run db:setup
```

### 4. Start the Backend
```bash
npm run dev          # Development (with hot reload)
npm start            # Production
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev          # Development server on http://localhost:5173
npm run build        # Production build
```

---

## ⚙️ Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `your_secret_here` |
| `JWT_EXPIRES_IN` | JWT token expiry | `24h` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `DATABASE_URL` | Full MySQL connection URL (Railway) | `mysql://user:pass@host/db` |
| `DB_HOST` | MySQL host (local) | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_NAME` | MySQL database name | `cravingdash` |
| `RAZORPAY_KEY_ID` | Razorpay test key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret | `your_secret` |

---

## 🚢 Railway Deployment

1. Push to GitHub
2. Create a new Railway project and connect the repository
3. Add a **MySQL** service from Railway's service catalog
4. Set the environment variables listed above in the Railway dashboard
5. Railway auto-sets `DATABASE_URL`, `MYSQLHOST`, `MYSQLPORT`, etc. — these are all handled
6. Set the start command: `npm start`
7. Build the frontend first: `cd frontend && npm run build` — the backend serves the compiled `dist/`

---

## 🔐 Security Features

- **Helmet** — sets secure HTTP response headers
- **CORS** — restricts cross-origin requests to `CLIENT_URL`
- **Rate Limiting** — 100 requests per 15 minutes per IP on all `/api` routes
- **Compression** — gzip response compression
- **JWT Authentication** — stateless, signed tokens for all protected routes
- **Password Hashing** — `crypto.scrypt` with per-user random salt
- **Timing-safe comparison** — prevents timing attacks on password and payment signature verification
- **Input Validation** — server-side validation middleware before all controllers
- **Parameterized Queries** — all SQL uses `mysql2` prepared statements

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | — |
| `POST` | `/api/auth/login` | Authenticate and receive JWT | — |
| `POST` | `/api/auth/logout` | Invalidate session | Optional |

### Menu
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/restaurants` | List all restaurants | — |
| `GET` | `/api/food` | List food items (filter by `restaurantId`, `search`, `category`) | — |

### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/payments/order` | Create Razorpay order | ✅ JWT |
| `POST` | `/api/payments/verify` | Verify signature & save order | ✅ JWT |

---

## 🛠️ Development Scripts

### Backend
```bash
npm run dev         # Start with hot reload (node --watch)
npm start           # Production start
npm run db:setup    # Initialize database schema
```

### Frontend
```bash
npm run dev         # Vite dev server
npm run build       # Production bundle
```
