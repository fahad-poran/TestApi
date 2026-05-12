# 🛒 Grocery Inventory Management System

A production-ready, full-stack inventory management system built with **.NET 8** and **React**. Designed for grocery retail with role-based access, real-time stock tracking, and automated invoicing.

---

## 🛠️ Tech Stack

- **Backend**: .NET 8 Web API, EF Core (SQL Server), JWT Auth, QuestPDF (Invoice Reports).
- **Frontend**: React 18 (TypeScript), Vite, Tailwind CSS, Recharts, React Router v6.
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, WebApi).

---

## ✨ Key Features (Recently Updated)

- **📦 Unified Product & Stock Management**: 
  - Create products with categories and **initial stock quantities**.
  - Dedicated **Stock Management** dashboard for real-time monitoring and inline updates.
  - Low-stock alerts and status indicators (In Stock, Low Stock, Out of Stock).
- **📋 Supplier Directory**: Full CRUD for managing supplier contacts (Name, Email, Phone, Address).
- **🧾 Automated Invoicing**: 
  - POS-style interface for creating invoices.
  - **Automatic stock deduction** upon invoice creation.
  - **PDF Generation**: Download professional PDF invoices via QuestPDF.
- **📊 Real-time Analytics**: Admin dashboard with sales trends (7/14/30 days) and top-selling product charts.
- **🗺️ Unified Navigation**: Shared sidebar layout with role-based routing (Admin/Staff) and collapsible design.
- **🔐 Secure Access**: JWT-based authentication with role-based guards on both frontend and backend.

---

## 📂 Project Structure

```text
TestApi/
├── TestApi.Domain/         # Core Entities (Product, Stock, Invoice, Supplier, Category)
├── TestApi.Infrastructure/ # Data Access (EF Core, Migrations)
├── TestApi.WebApi/        # Controllers, Auth, Middleware
└── client/                 # React Frontend (Vite)
    ├── src/api/            # Modular API services
    └── src/components/     # Shared components & Page-specific views
```

---

## 🚀 Quick Start

### 1. Backend (.NET 8)
```bash
# Apply migrations & update database
cd TestApi.Infrastructure
dotnet ef database update --startup-project ../TestApi.WebApi

# Start API (Available at http://localhost:5001)
cd ../TestApi.WebApi
dotnet run
```

### 2. Frontend (React)
```bash
cd client
npm install
npm run dev # Available at http://localhost:5173
```

### 🔑 Default Credentials
| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `Hello@123` |
| **Staff** | `user` | `User@123` |

---

## 📡 API Capabilities (For Agents)

The system exposes the following core endpoints for automation:

- **Auth**: `POST /api/Auth/login`
- **Products**: CRUD via `/api/Products`. Supports category filtering.
- **Stock**: `GET /api/Stock/low-stock`, `PUT /api/Stock/{id}` for quantity updates.
- **Invoices**: `POST /api/Invoices` (handles stock logic), `GET /api/Invoices/pdf/{id}`.
- **Suppliers**: CRUD via `/api/Suppliers`.
- **Dashboard**: `GET /api/Dashboard/sales-trend`, `stock-summary`, `top-products`.

---

## 👤 Author
**Fahad** ([@fahad-poran](https://github.com/fahad-poran))
