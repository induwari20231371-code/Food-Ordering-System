# 🍔 FoodOrder - Online Food Ordering System

A modern full-stack web application for ordering food online with admin management capabilities. Built with React, Spring Boot, and Tailwind CSS.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Dependencies](#dependencies)
- [Database Configuration](#database-configuration)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Admin Credentials](#admin-credentials)
- [Project Structure](#project-structure)

---

## 🎯 Project Overview

**FoodOrder** is a complete food ordering system with:
- **Customer Features**: Browse menu, add items to cart, place orders, track order status
- **Admin Features**: Manage food items, categories, orders, and user accounts
- **Security**: JWT-based authentication with role-based access control (ADMIN/CUSTOMER)
- **Database**: H2 in-memory database with auto-seeding

### Key Features
✅ User registration and authentication  
✅ Food item catalog with categories  
✅ Shopping cart management  
✅ Order placement with delivery tracking  
✅ Admin panel for food/order/user management  
✅ Responsive design for mobile and desktop  
✅ Order cancellation and payment management  

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **React Router 6.21.0** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **React Hot Toast 2.4.1** - Notifications
- **React Icons 4.12.0** - Icon library

### Backend
- **Spring Boot 3.2.0** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database ORM
- **MySQL 8.0+** - Relational database with persistent storage
- **JWT (JSON Web Tokens)** - Token-based authentication
- **Maven 3.8+** - Build tool
- **Java 21** - Runtime

---

## 🚀 Project Setup

### Prerequisites
- **Node.js 16+** and **npm** (for frontend)
- **Java 21** (for backend)
- **Maven 3.8+** (for building backend)
- **Git** (for version control)

### Clone Repository
```bash
git clone <repository-url>
cd food-ordering-system
```

### Project Structure
```
food-ordering-system/
├── backend/                 # Spring Boot API
│   ├── src/
│   │   ├── main/java/com/foodorder/
│   │   │   ├── controller/         # REST endpoints
│   │   │   ├── service/            # Business logic
│   │   │   ├── entity/             # JPA entities
│   │   │   ├── repository/         # Data access
│   │   │   ├── security/           # JWT & CORS config
│   │   │   ├── exception/          # Custom exceptions
│   │   │   └── FoodOrderingApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql            # Database seed data
│   └── pom.xml
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── pages/          # Page components (HomePage, CartPage, etc.)
│   │   ├── components/     # Reusable components (Navbar, Footer)
│   │   ├── context/        # React Context (AuthContext, CartContext)
│   │   ├── api/            # API client & services
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── postcss.config.js
│
└── README.md
```

---

## 📦 Dependencies

### Frontend Dependencies

Install via: `npm install`

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "axios": "^1.6.2",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^4.12.0"
}
```

### Backend Dependencies

Managed in `backend/pom.xml`:
- `spring-boot-starter-web` - Web framework
- `spring-boot-starter-data-jpa` - ORM
- `spring-boot-starter-security` - Security
- `spring-boot-starter-validation` - Input validation
- `mysql-connector-j` - MySQL JDBC driver
- `jjwt-api` & `jjwt-impl` - JWT tokens
- `lombok` - Boilerplate reduction
- `jakarta.persistence-api` - JPA API

---

## 🗄️ Database Configuration

### Prerequisites
- **MySQL 8.0+** must be installed and running on your system
- Create a MySQL user or use `root` account

### Database Setup
- **Type**: MySQL (Persistent relational database)
- **Auto-initialization**: Enabled via `createDatabaseIfNotExist=true`
- **Schema**: Auto-created via Hibernate (JPA)
- **Credentials**: Configurable in `application.properties`

### Connection Details
**Default Configuration** (in `backend/src/main/resources/application.properties`):
```properties
# MySQL Connection
spring.datasource.url=jdbc:mysql://localhost:3306/food_ordering_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Puleesha_i
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**To use different credentials:**
1. Open `backend/src/main/resources/application.properties`
2. Update `spring.datasource.username` and `spring.datasource.password`
3. Ensure MySQL user has permission to create/drop databases
4. Restart backend

### Database Schema
The schema is automatically created with these main tables:

| Table | Purpose |
|-------|---------|
| `users` | Store user accounts (ADMIN/CUSTOMER role) |
| `categories` | Food categories (Pizza, Burgers, etc.) |
| `food_items` | Individual menu items with prices |
| `carts` | Shopping carts per user |
| `cart_items` | Items in cart with quantities |
| `orders` | Customer orders with status tracking |
| `order_items` | Line items in each order |
| `payments` | Payment records per order |

### Data Persistence
- All data is **permanently stored** in MySQL database
- Data **persists across application restarts**
- Database is automatically created if it doesn't exist
- Schema is automatically updated on application startup via Hibernate

---

## 🏃 How to Run

### Option 1: Run Both Services (Recommended)

#### Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

#### Terminal 2 - Frontend
```bash
cd frontend
npm install          # First time only
npm run dev
```
Frontend will start on `http://localhost:3001`

### Option 2: Production Build

#### Build Backend JAR
```bash
cd backend
mvn clean package
java -jar target/food-ordering-system-1.0.0.jar
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Verify Services

| Service | URL | Health Check |
|---------|-----|--------------|
| Frontend | http://localhost:3001 | Should load FoodOrder home page |
| Backend API | http://localhost:8080/api | Try `/api/categories` |
| MySQL Database | localhost:3306 | Verify connection using `mysql -u root -p` |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "0771234567"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {...}
  }
}
```

#### Sign In
```
POST /auth/signin
Content-Type: application/json

{
  "email": "admin1@foodorder.com",
  "password": "Admin@123"
}

Response: Same as register
```

### Category Endpoints

#### Get All Categories (Public)
```
GET /categories
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Burgers",
      "description": "Delicious burgers...",
      "imageUrl": null,
      "foodItems": [...]
    }
  ]
}
```

#### Create Category (Admin Only)
```
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Snacks",
  "description": "Light snacks",
  "imageUrl": "url"
}
```

### Food Item Endpoints

#### Get All Available Items (Public)
```
GET /food-items/available
```

#### Get Items by Category
```
GET /food-items/category/{categoryId}
```

#### Create Food Item (Admin Only)
```
POST /food-items
Authorization: Bearer <token>

{
  "name": "Cheeseburger",
  "description": "Juicy beef patty...",
  "price": 450.00,
  "categoryId": 1,
  "imageUrl": "url",
  "status": "AVAILABLE"
}
```

### Cart Endpoints (Requires Authentication)

#### Get User Cart
```
GET /cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```
POST /cart/items
Authorization: Bearer <token>

{
  "foodItemId": 1,
  "quantity": 2
}
```

#### Update Cart Item
```
PUT /cart/items/{itemId}
Authorization: Bearer <token>

{
  "quantity": 3
}
```

#### Remove from Cart
```
DELETE /cart/items/{itemId}
Authorization: Bearer <token>
```

#### Clear Cart
```
DELETE /cart
Authorization: Bearer <token>
```

### Order Endpoints (Requires Authentication)

#### Place Order
```
POST /orders
Authorization: Bearer <token>

{
  "deliveryAddress": "123 Main St, Colombo",
  "specialInstructions": "No onions",
  "paymentMethod": "CASH_ON_DELIVERY"
}
```

#### Get User Orders
```
GET /orders
Authorization: Bearer <token>
```

#### Get Order Details
```
GET /orders/{orderId}
Authorization: Bearer <token>
```

#### Cancel Order
```
PUT /orders/{orderId}/cancel
Authorization: Bearer <token>
```

### Payment Endpoints (Requires Authentication)

#### Process Payment
```
POST /payments/{orderId}
Authorization: Bearer <token>
```

### Admin Endpoints (Admin Only)

#### Get All Users
```
GET /admin/users
Authorization: Bearer <token>
```

#### Get All Orders
```
GET /admin/orders
Authorization: Bearer <token>
```

#### Update Order Status
```
PUT /admin/orders/{orderId}
Authorization: Bearer <token>

{
  "status": "PREPARING"
}
```

---

## 👤 Admin Credentials

Two predefined admin accounts for system management:

| Email | Password | Role |
|-------|----------|------|
| admin1@foodorder.com | Admin@123 | ADMIN |
| admin2@foodorder.com | Admin@456 | ADMIN |

**Note**: Regular users cannot self-register as admin. Admin accounts are system-managed only.

---

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based auth
- **Role-Based Access**: ADMIN vs CUSTOMER roles
- **CORS Configuration**: Frontend on 3001, Backend on 8080
- **Password Hashing**: BCrypt encryption
- **Protected Routes**: Frontend route guards for authenticated pages

---

## 🧪 Testing the Application

### Customer Flow
1. Navigate to http://localhost:3001
2. Click "Sign Up" and create account
3. Browse "Menu", add items to cart
4. Go to cart, enter address, place order
5. View order in "My Orders" page

### Admin Flow
1. Navigate to http://localhost:3001/login
2. Enter admin credentials (see [Admin Credentials](#admin-credentials))
3. Click "admin1@foodorder.com" from the provided list
4. Access Admin Panel to manage items/categories/orders

---

## 🛠️ Troubleshooting

### MySQL Connection Issues
```bash
# Verify MySQL is running
mysql -u root -p

# Check if database exists
SHOW DATABASES;

# If database doesn't exist, Spring will create it automatically
```

### Backend won't connect to MySQL
- Verify MySQL server is running
- Check username/password in `application.properties`
- Ensure MySQL user has required permissions
- Verify port 3306 is not blocked

### Backend won't start
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux

# Kill process and restart
```

### Frontend won't connect to backend
- Verify backend is running on `http://localhost:8080`
- Check CORS settings in `SecurityConfig.java`
- Ensure axios baseURL is set to `http://localhost:8080/api`

### Database schema not created
- Check MySQL user permissions (needs CREATE, DROP, ALTER)
- Verify database user can create/alter tables
- Check logs for Hibernate DDL errors

---

## 📝 Notes

- Database data is **persisted in MySQL** across application restarts
- Schema auto-created and updated via Hibernate DDL
- Two admin accounts are auto-seeded on first run
- Delivery fee is fixed at LKR 200
- Images stored as URLs (not uploaded to server)
- All customer data, orders, and payments stored permanently in database

---

## 👨‍💼 Project Information

**Course**: CMJD (Comprehensive Modern Java Development)  
**Batch**: 112/113  
**Institute**: IJSE (Institute of Java Software Engineering)  
**Year**: 2024

---

## 📄 License

This project is part of CMJD coursework. All rights reserved.

---

## 🤝 Support

For issues or questions, please contact:
- **Email**: info@foodorder.lk
- **Phone**: +94 77 123 4567
- **Address**: 123 Food Street, Colombo, Sri Lanka

---

**Happy Ordering! 🍕🍔🍜**
