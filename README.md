# QuickBite — Online Food Ordering System

A full-stack food ordering web application built for the **CMJD Assignment**. Customers can browse the menu, manage a cart, place orders, and track order history. Admins have a dedicated dashboard to manage food items, categories, orders, and users.

---

## Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.2.0**
- **Spring Security** (JWT-based stateless authentication)
- **Spring Data JPA** / **Hibernate**
- **MySQL 8** (production) · **H2** (in-memory, available for local dev)
- **JJWT 0.12.3** for token generation and validation
- **Lombok 1.18.38**
- **Maven** (wrapper included)

### Frontend
- **React 18** with **TypeScript**
- **Vite 5** (build tool)
- **React Router DOM 6**
- **Axios** (API client)
- **Tailwind CSS 3**
- **react-hot-toast** (notifications)
- **react-icons**

---

## Project Structure

```
Food-Ordering-System-main/
├── backend/                        # Spring Boot application
│   ├── src/main/java/com/foodorder/
│   │   ├── controller/             # REST controllers
│   │   │   ├── AuthController.java
│   │   │   ├── CartController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── FoodItemController.java
│   │   │   ├── OrderController.java
│   │   │   ├── PaymentController.java
│   │   │   └── UserController.java
│   │   ├── dto/                    # Request / response DTOs
│   │   ├── entity/                 # JPA entities
│   │   │   ├── User, Cart, CartItem
│   │   │   ├── Category, FoodItem
│   │   │   ├── Order, OrderItem
│   │   │   └── Payment
│   │   ├── enums/                  # Role, OrderStatus, PaymentStatus, FoodItemStatus
│   │   ├── exception/              # GlobalExceptionHandler + custom exceptions
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── security/               # JWT filter, JwtUtils, SecurityConfig
│   │   └── service/                # Business logic + AdminAccountInitializer
│   └── src/main/resources/
│       ├── application.properties
│       └── schema-mysql.sql
│
└── frontend/                       # React + Vite application
    ├── public/images/              # Static assets (quickbite-logo.png)
    └── src/
        ├── api/                    # axiosClient.ts, services.ts
        ├── components/layout/      # Navbar.tsx, Footer.tsx
        ├── context/                # AuthContext.tsx, CartContext.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── MenuPage.tsx
        │   ├── CartPage.tsx
        │   ├── OrdersPage.tsx
        │   └── AdminPage.tsx
        └── types/
```

---

## Features

### Customer
- Register and log in (JWT authentication)
- Browse all available food items; filter by category or search by name
- Add items to cart, update quantities, and remove items
- Place an order with a delivery address and optional special instructions
- View order history with status and payment details
- Cancel a pending order

### Admin
- Manage **Food Items** — create, edit, toggle availability (AVAILABLE / UNAVAILABLE), delete
- Manage **Categories** — create, edit, delete
- View and update **Order** statuses (PLACED → PREPARING → DELIVERED / CANCELLED)
- View all registered **Users** and delete accounts

### System
- Two predefined admin accounts are seeded automatically on startup
- Role-based access control via Spring Security method-level annotations (`@PreAuthorize`)
- Global exception handling with structured JSON error responses
- Rotating log files written to `logs/food-ordering.log`

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Java | 21 |
| Maven | 3.x (wrapper included — no install needed) |
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8.x |

---

## Getting Started

### 1. Database Setup

Create the database (the application can also create it automatically via the JDBC URL):

```sql
CREATE DATABASE food_ordering_db;
```

### 2. Backend Configuration

Open `backend/src/main/resources/application.properties` and update the database credentials if they differ from the defaults:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/food_ordering_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
```

These values can also be supplied via environment variables:

```
DB_URL      — full JDBC connection string
DB_USER     — database username
DB_PASSWORD — database password
```

### 3. Start the Backend

```bash
cd backend
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```

The API starts on **http://localhost:8080**.

Hibernate will create/update tables automatically (`ddl-auto=update`). The `schema-mysql.sql` script runs after that to apply any MySQL-specific fixes.

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173** and proxies `/api` requests to the backend.

---

## Default Admin Accounts

Two admin accounts are seeded automatically every time the application starts:

| Name | Email | Password |
|------|-------|----------|
| System Admin 1 | admin1@quickbite.com | Admin@123 |
| System Admin 2 | admin2@quickbite.com | Admin@456 |

> **Note:** Do not use these credentials in a production deployment.

---

## API Reference

All endpoints are prefixed with `/api`. The backend runs on port `8080`.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Register a new customer account |
| POST | `/auth/signin` | Public | Log in and receive a JWT |
| GET | `/auth/me` | Bearer token | Get the currently authenticated user |

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | List all categories |
| GET | `/categories/{id}` | Public | Get category by ID |
| POST | `/categories` | Admin | Create a new category |
| PUT | `/categories/{id}` | Admin | Update a category |
| DELETE | `/categories/{id}` | Admin | Delete a category |

### Food Items — `/api/food-items`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/food-items` | Public | List all food items |
| GET | `/food-items/available` | Public | List available items only |
| GET | `/food-items/{id}` | Public | Get food item by ID |
| GET | `/food-items/category/{categoryId}` | Public | Items by category |
| GET | `/food-items/search?name=` | Public | Search by name |
| POST | `/food-items` | Admin | Create a food item |
| PUT | `/food-items/{id}` | Admin | Update a food item |
| DELETE | `/food-items/{id}` | Admin | Delete a food item |

### Cart — `/api/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | Customer | Get current cart |
| POST | `/cart/items` | Customer | Add item to cart |
| PUT | `/cart/items/{cartItemId}?quantity=` | Customer | Update item quantity |
| DELETE | `/cart/items/{cartItemId}` | Customer | Remove item from cart |
| DELETE | `/cart` | Customer | Clear the entire cart |

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Customer | Place an order |
| GET | `/orders` | Customer / Admin | Customers see their own orders; admins see all |
| GET | `/orders/{orderId}` | Customer / Admin | Get order by ID |
| PUT | `/orders/{orderId}/status?status=` | Admin | Update order status |
| POST | `/orders/{orderId}/cancel` | Customer | Cancel an order |

**Order statuses:** `PLACED` · `PREPARING` · `DELIVERED` · `CANCELLED`

### Payments — `/api/payments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/payments` | Admin | List all payments |
| GET | `/payments/{id}` | Admin | Get payment by ID |
| GET | `/payments/order/{orderId}` | Admin | Get payment for an order |
| POST | `/payments/order/{orderId}/process` | Admin | Process a payment |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | Authenticated | Get own profile |
| GET | `/users` | Admin | List all users |
| GET | `/users/{id}` | Admin | Get user by ID |
| DELETE | `/users/{id}` | Admin | Delete a user |

---

## Authentication

All protected requests must include the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are returned by `/api/auth/signin` and are valid for **24 hours** (86 400 000 ms).

---

## Available Scripts

### Backend

```bash
./mvnw spring-boot:run    # Run in development mode
./mvnw clean package      # Build a runnable JAR
./mvnw test               # Run tests
```

### Frontend

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Build for production (output: dist/)
npm run preview   # Preview the production build locally
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mysql://localhost:3306/food_ordering_db?...` | Full JDBC connection string |
| `DB_USER` | `root` | Database username |
| `DB_PASSWORD` | *(set in application.properties)* | Database password |
| `app.jwt.secret` | *(set in application.properties)* | 256-bit hex secret for signing JWTs |
| `app.jwt.expiration` | `86400000` | Token lifetime in milliseconds |

---

## Roles

| Role | Capabilities |
|------|-------------|
| `CUSTOMER` | Browse menu, manage cart, place/cancel orders, view own order history |
| `ADMIN` | Full CRUD on food items and categories; view and update all orders; view and delete users; process payments |

New accounts registered via `/api/auth/signup` are always assigned the `CUSTOMER` role. Admin accounts are seeded at startup only.
