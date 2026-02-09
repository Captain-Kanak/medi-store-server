# 🧩 Multi-Seller Medicine Store – SERVER

A robust, multi-role e-commerce backend built for a specialized Pharmacy Marketplace. This system enables Admins to manage categories, Sellers to list medications, and Customers to purchase healthcare products and leave reviews for medicine with real-time stock management.

---

## 📌 Overview

This backend system facilitates a structured medical marketplace:

- Unified Authentication: Powered by Better Auth for secure, session-based authentication.
- Role-Based Access Control (RBAC): Distinct permissions for ADMIN, SELLER, and CUSTOMER.
- Admin Management: Only Admins can define the medicine taxonomy (Categories).
- Seller Inventory: Sellers manage their own medicine listings, stock, and brand-specific pricing.
- Transactional Orders: Atomic checkout process using Prisma Transactions to ensure data integrity between orders and stock levels.
- Clean Architecture: Modular service-controller pattern built with TypeScript and Express.

---

## 🛠 Technology Stack

- Runtime: Node.js & TypeScript
- Framework: Express.js
- Database: PostgreSQL (Neon DB)
- ORM: Prisma
- Authentication: Better Auth

---

## 🔐 Authentication & Authorization

### Better Auth Integration

The system has moved away from manual JWT handling to Better Auth, providing:

1. Session Management: Secure server-side sessions.
2. Role Injection: User roles are baked into the session metadata.
3. Cross-Origin Security: Built-in protection against CSRF and session hijacking.

### Role-Based Access Control (RBAC)

- **ADMIN** – Manage Categories, Block/Unblock Users, View All Orders, Manage all Inventory.
- **SELLER** – Create/Update/Delete own Medicines, Track own Sales, View Orders, Update Order Status.
- **CUSTOMER** – Browse Medicines, Manage Profile, Cart, Place Orders, Track Status, Leave Reviews.

---

## 🔒 Security Considerations

- Atomic Transactions: Stock is decremented using prisma.$transaction to prevent over-selling.
- Price Integrity: Order totals are validated against DB prices to prevent frontend price manipulation.
- Unique Constraints: @@unique([name, brand]) prevents duplicate catalog entries.
- Security Headers: Better Auth handles secure cookie management and session validation.

---

## 🗄️ Database Schema

**ERD Link:** [ERD Link](https://drawsql.app/teams/lazy-programmer-2/diagrams/medi-store)

### User

| Field         | Description               |
| ------------- | ------------------------- |
| id            | UUID (primary key)        |
| name          | String (required)         |
| email         | String (required)         |
| emailVerified | Boolean (false)           |
| image         | String?                   |
| role          | ADMIN / SELLER / CUSTOMER |
| phone         | String?                   |
| address       | String?                   |
| isBlocked     | Boolean (false)           |
| createdAt     | Record creation time      |
| updatedAt     | Last update time          |

### Category

| Field       | Description          |
| ----------- | -------------------- |
| id          | UUID (primary key)   |
| name        | String (unique)      |
| description | String?              |
| createdAt   | Record creation time |
| updatedAt   | Last update time     |

### Medicine

| Field       | Description          |
| ----------- | -------------------- |
| id          | UUID (primary key)   |
| name        | String (required)    |
| brand       | String (required)    |
| price       | Float (required)     |
| stock       | Int (required)       |
| description | String (required)    |
| image       | String (required)    |
| dosage      | String (required)    |
| expiryDate  | DateTime (required)  |
| categoryId  | String (foreign key) |
| sellerId    | String (foreign key) |
| createdAt   | Record creation time |
| updatedAt   | Last update time     |

### CartItem

| Field      | Description          |
| ---------- | -------------------- |
| id         | UUID (primary key)   |
| userId     | String (foreign key) |
| medicineId | String (foreign key) |
| quantity   | Int (required)       |

### Order

| Field           | Description                                            |
| --------------- | ------------------------------------------------------ |
| id              | UUID (primary key)                                     |
| totalPrice      | Float (required)                                       |
| status          | PENDING / PROCESSING / SHIPPED / DELIVERED / CANCELLED |
| shippingAddress | String (required)                                      |
| paymentMethod   | String (Cash on Delivery)                              |
| customerId      | String (foreign key)                                   |
| createdAt       | Record creation time                                   |
| updatedAt       | Last update time                                       |

### OrderItem

| Field      | Description          |
| ---------- | -------------------- |
| id         | UUID (primary key)   |
| quantity   | Int (required)       |
| price      | Float (required)     |
| orderId    | String (foreign key) |
| medicineId | String (foreign key) |
| createdAt  | Record creation time |
| updatedAt  | Last update time     |

### Review

| Field      | Description          |
| ---------- | -------------------- |
| id         | UUID (primary key)   |
| rating     | Int (required)       |
| comment    | String (required)    |
| customerId | String (foreign key) |
| medicineId | String (foreign key) |
| createdAt  | Record creation time |

---

## 🔗 API Endpoints

### Authentication (Managed by Better Auth)

| Method | Endpoint                | Access | Description           |
| ------ | ----------------------- | ------ | --------------------- |
| POST   | /api/auth/sign-up/email | Public | Sign Up User          |
| POST   | /api/auth/sign-in/email | Public | Sign In Verified User |

---

### User

| Method | Endpoint   | Access                    | Description             |
| ------ | ---------- | ------------------------- | ----------------------- |
| GET    | /api/users | ADMIN                     | Get Users Metrics       |
| PATCH  | /api/users | CUSTOMER / SELLER / ADMIN | Update User Information |

---

### Category

| Method | Endpoint        | Access | Description        |
| ------ | --------------- | ------ | ------------------ |
| POST   | /api/categories | ADMIN  | Create Category    |
| GET    | /api/categories | Public | Get all Categories |

---

### Medicine

| Method | Endpoint           | Access         | Description           |
| ------ | ------------------ | -------------- | --------------------- |
| POST   | /api/medicines     | SELLER         | Add Medicine          |
| GET    | /api/medicines     | Public         | Get all Medicines     |
| GET    | /api/medicines/:id | Public         | Get Medicine by id    |
| PATCH  | /api/medicines/:id | SELLER / ADMIN | Update Medicine by id |
| DELETE | /api/medicines/:id | SELLER / ADMIN | Delete Medicine by id |

---

### Cart

| Method | Endpoint   | Access   | Description              |
| ------ | ---------- | -------- | ------------------------ |
| GET    | /api/carts | CUSTOMER | Get all Cart Items       |
| POST   | /api/carts | CUSTOMER | Add to Cart (upsert)     |
| PATCH  | /api/carts | CUSTOMER | Update Medicine Quantity |
| DELETE | /api/carts | CUSTOMER | Delete Cart Item         |

### Order

| Method | Endpoint            | Access                    | Description               |
| ------ | ------------------- | ------------------------- | ------------------------- |
| GET    | /api/orders         | CUSTOMER / SELLER / ADMIN | Get all Orders            |
| GET    | /api/orders/metrics | CUSTOMER / SELLER / ADMIN | Get all Orders Metrics    |
| POST   | /api/orders         | CUSTOMER                  | Place Order               |
| PATCH  | /api/orders/:id     | CUSTOMER / SELLER         | Update Order Status by id |

---

### Review

| Method | Endpoint     | Access   | Description               |
| ------ | ------------ | -------- | ------------------------- |
| POST   | /api/reviews | CUSTOMER | Leave Review for Medicine |

---

## ⚙️ Installation & Setup

Prerequisites:

- Node.js (v20.19+)
- PostgreSQL / (Neon DB)
- pnpm

Clone Repository:

```bash
git clone < repository link >
cd < project directory >
```

Install Dependencies:

```bash
pnpm install
```

Environment Variables:
Create a `.env` file in the root of your project and add the following:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/db?sslmode=verify-full"
PORT=5000
NODE_ENV === "development"
BETTER_AUTH_SECRET="better_auth_secret"
BETTER_AUTH_URL="http://localhost:5000"
ORIGIN_URL="http://localhost:3000"
APP_USER="user_gmail"
APP_PASS="app_pass"
GOOGLE_CLIENT_ID="google_client_id"
GOOGLE_CLIENT_SECRET="google_client_secret"
```

---

Run Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

---

Start Server:

```bash
pnpm dev
```

---

## 👤 Author

- Kanak Ray
- Full Stack Developer
- (Node.js · Express.js · TypeScript · PostgreSQL · Prisma)

---

## 📄 License

This project is intended for educational and demonstration purposes.
