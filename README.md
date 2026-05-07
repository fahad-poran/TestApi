# 🛒 Grocery Inventory Management System

> A production-ready, full-stack inventory management system built with .NET 8 and React, designed for grocery stores with role-based dashboards, real-time analytics, and PDF invoice generation.

---

## ✨ Features

### 🔐 Core Features
- **Role-Based Access**: Admin and Staff dashboards with different permissions
- **Product Management**: CRUD operations with category organization
- **Stock Tracking**: Real-time stock levels with low-stock alerts
- **Invoice System**: Create invoices, update stock automatically, download PDF reports
- **Analytics Dashboard**: Sales trends, top products, stock summaries with interactive charts
- **Modern UI**: Tailwind CSS with gradients, animations, and responsive design

### 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access, user management, analytics dashboard, category management |
| **Staff** | Create invoices, view products, personal dashboard |

---

## 🏗️ Tech Stack

### Backend (.NET 8)
- **Framework**: .NET 8 Web API
- **ORM**: Entity Framework Core
- **Database**: SQL Server (hosted on host via `host.docker.internal`)
- **Authentication**: JWT (JSON Web Tokens) with role claims
- **Documentation**: Swagger/OpenAPI
- **PDF Generation**: QuestPDF for invoice reports
- **CORS**: Enabled for frontend communication

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast HMR and build)
- **Styling**: Tailwind CSS (custom gradients, shadows, animations)
- **Routing**: React Router v6 with role-based guards
- **Charts**: Recharts (bar charts, pie charts)
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **State**: LocalStorage for auth persistence

---

## 📂 Project Structure

```
TestApi/
├── TestApi.Domain/           # Entities (User, Product, Category, Stock, Invoice)
├── TestApi.Infrastructure/   # EF Core, Migrations, DbContext
├── TestApi.WebApi/          # Controllers, JWT Auth, Middleware
└── client/                   # React frontend (Vite + React + TypeScript)
    ├── src/
    │   ├── api/             # API services (auth, products, categories, invoices)
    │   ├── components/       # React components (Login, Products, Dashboards)
    │   ├── App.tsx          # Main app with role-based routing
    │   └── main.tsx         # Entry point
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js v18+ (v18.20.4 used)
- SQL Server (accessible via `host.docker.internal,1433`)
- npm or yarn

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/fahad-poran/TestApi.git
cd TestApi

# Restore packages
dotnet restore

# Apply database migrations (creates all tables)
cd TestApi.Infrastructure
dotnet ef migrations add AddInventoryTables --startup-project ../TestApi.WebApi
dotnet ef database update --startup-project ../TestApi.WebApi

# Run the API
cd ../TestApi.WebApi
dotnet run --urls="http://localhost:5001"
```

API will be available at: **http://localhost:5001**
Swagger UI: **http://localhost:5001/swagger**

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 3. Default Credentials

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `Hello@123` |
| **Staff** | `user` | `User@123` |

---

## 📊 API Endpoints

### Authentication
- `POST /api/Auth/login` - Login with username/password → Returns JWT token with role

### Products
- `GET /api/Products` - List all products
- `POST /api/Products` - Create product (Admin)
- `PUT /api/Products/{id}` - Update product (Admin)
- `DELETE /api/Products/{id}` - Delete product (Admin)

### Categories
- `GET /api/Categories` - List categories (Admin)
- `POST /api/Categories` - Create category (Admin)

### Stock
- `GET /api/Stock/low-stock` - Low stock alerts (Admin)
- `GET /api/Stock/product/{id}` - Get product stock
- `PUT /api/Stock/{id}` - Update stock quantity (Admin)

### Invoices
- `GET /api/Invoices` - List invoices (user-scoped)
- `GET /api/Invoices/{id}` - Get invoice details
- `POST /api/Invoices` - Create invoice (updates stock)
- `GET /api/Invoices/pdf/{id}` - Download PDF invoice

### Dashboard (Admin Only)
- `GET /api/Dashboard/sales-trend?days=7` - Sales trend data
- `GET /api/Dashboard/top-products?count=5` - Top selling products
- `GET /api/Dashboard/stock-summary` - Stock overview stats

---

## 🎨 UI Components

### Login Page
- Gradient background (blue → purple → indigo)
- Animated background elements
- Toast notifications for success/error
- Demo credentials quick-fill
- Loading spinner with animation

### Products Page
- Real-time search functionality
- Category dropdown selector
- Inline edit/add forms
- Skeleton loaders during loading
- Confirmation dialogs for delete
- Hover effects and transitions

### Admin Dashboard
- **Stats Cards**: Total products, low stock, out of stock (gradient cards)
- **Sales Trend**: Bar chart (Recharts) with time range selector (7/14/30 days)
- **Top Products**: Pie chart with product names and quantities
- **Quick Actions**: Links to products, categories, Swagger docs

### Staff Dashboard
- **Invoice Creator**: Click-to-add products
- **Quantity Controls**: +/- buttons with real-time updates
- **Live Total**: Calculates invoice total automatically
- **Customer Name**: Optional field for invoice

---

## 📦 Database Schema

### Tables
1. **Users** - Id, Username, PasswordHash, Role, CreatedAt
2. **Products** - Id, Name, Price, CategoryId, StockId, Description, CreatedAt
3. **Categories** - Id, Name, Description, Products collection
4. **Stocks** - Id, ProductId, Quantity, ReorderLevel, LastUpdated
5. **Invoices** - Id, InvoiceNumber, UserId, CustomerName, TotalAmount, CreatedAt
6. **InvoiceItems** - Id, InvoiceId, ProductId, Quantity, UnitPrice, Subtotal

### Relationships
- Product → Category (Many-to-One)
- Product → Stock (One-to-One)
- Invoice → InvoiceItems (One-to-Many)
- Invoice → User (Many-to-One)

---

## 🧪 Testing the Flow

1. **Login** → Visit http://localhost:5173
   - Enter `admin` / `Hello@123`
   - Redirects to `/admin` dashboard

2. **Create Category** → Use Swagger or API
   ```bash
   curl -X POST http://localhost:5001/api/Categories \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Fruits","description":"Fresh fruits"}'
   ```

3. **Add Product** → Go to Products page → Click "Add New Product"
   - Fill in name, price, select category
   - Click "Add"

4. **Create Invoice** (as Staff) → Go to Staff Dashboard
   - Click on products to add them
   - Adjust quantities with +/- buttons
   - Click "Create Invoice"
   - Stock automatically decreases

5. **Download PDF** → After creating invoice:
   ```bash
   curl -O -J http://localhost:5001/api/Invoices/pdf/1?token=YOUR_TOKEN
   ```

---

## 🚢 Deployment

### Backend (.NET 8)
```bash
# Build for production
dotnet publish -c Release -o ./publish

# Run with production settings
dotnet ./publish/TestApi.WebApi.dll --urls="http://0.0.0.0:5001"
```

### Frontend (React)
```bash
cd client

# Build for production
npm run build

# Preview production build
npm run preview

# Or deploy the `dist/` folder to any static hosting
```

---

## 🔧 Environment Variables

### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=host.docker.internal,1433;Database=TestApiDb;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyHere12345678901234567890",
    "Issuer": "TestApi",
    "Audience": "TestApiUsers",
    "ExpiryInMinutes": "60"
  }
}
```

### Frontend (`src/api/*.ts`)
Update API base URL if needed:
```typescript
const API_URL = 'http://localhost:5001/api'; // Change for production
```

---

## 📝 Development Notes

- **CORS**: Configured to allow `http://localhost:5173` (dev) and `http://localhost:8080` (simple frontend)
- **QuestPDF**: Community license used for PDF generation
- **Recharts**: Charts render only with data (empty states handled)
- **Toast Notifications**: React Hot Toast with custom styling
- **Role Guards**: Implemented in React Router and backend `[Authorize(Roles="Admin")]` attributes

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Fahad**  
GitHub: [@fahad-poran](https://github.com/fahad-poran)  
Working on ERP software using .NET Framework, .NET Core 8, and jQuery.

---

## 🙏 Acknowledgments

- [QuestPDF](https://www.questpdf.com/) for PDF generation
- [Recharts](https://recharts.org/) for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- [React Hot Toast](https://react-hot-toast.com/) for notifications

---

## 🎯 TODO / Roadmap

- [ ] Add unit tests (xUnit for backend, Jest for frontend)
- [ ] Implement image upload for products
- [ ] Add barcode scanning support
- [ ] Email notifications for low stock
- [ ] Dockerize the entire application
- [ ] Add advanced reporting (monthly, yearly)
- [ ] Implement user management (Admin creates staff accounts)
- [ ] Add payment gateway integration

---

<div align="center">
  <p>⭐ Built with .NET 8 + React + Tailwind CSS</p>
  <p>© 2026 Grocery Inventory Management System</p>
</div>
