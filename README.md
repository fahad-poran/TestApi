# TestApi - .NET 8 Clean Architecture API

A production-ready .NET 8 Web API implementing Clean Architecture principles with JWT authentication, Swagger documentation, SQL Server integration, and Docker support.

## 📋 Features

- ✅ **Clean Architecture** - Domain, Application, Infrastructure, and WebApi layers
- ✅ **JWT Authentication** - Secure token-based auth with Swagger integration
- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **SQL Server** - Entity Framework Core with database migrations
- ✅ **Serilog Logging** - Structured logging to console and file
- ✅ **Repository Pattern** - Generic repository for data access
- ✅ **Docker Support** - Multi-container setup with SQL Server
- ✅ **Seed Data** - Pre-configured users for testing

## 🚀 Quick Start

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or use Docker)
- [Docker](https://www.docker.com/products/docker-desktop/) (optional)

---

## 🐳 Running with Docker

### For Mac Users (Apple Silicon M1/M2/M3)

1. **Install Docker Desktop for Mac**
   - Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - Choose the correct version (Apple Silicon or Intel)

2. **Start Docker Desktop**
   - Open Docker Desktop application
   - Wait for the whale icon in the menu bar to stop animating

3. **Clone and Run**
   ```bash
   # Clone the repository
   git clone https://github.com/fahad-poran/TestApi.git
   cd TestApi

   # Start the application with Docker Compose
   docker-compose up --build -d
   ```

4. **Verify the Setup**
   - API Swagger UI: http://localhost:8080/swagger
   - SQL Server runs on port 1433
   - API runs on port 8080

5. **View Logs**
   ```bash
   # View API logs
   docker-compose logs -f webapi

   # View SQL Server logs
   docker-compose logs -f sqlserver
   ```

6. **Stop the Application**
   ```bash
   docker-compose down

   # To also remove the database volume
   docker-compose down -v
   ```

### For Windows/Linux Users

```bash
# Clone the repository
git clone https://github.com/fahad-poran/TestApi.git
cd TestApi

# Start with Docker Compose
docker-compose up --build -d

# Access Swagger at http://localhost:8080/swagger
```

### Docker Configuration Notes

- **SQL Server**: Uses `mcr.microsoft.com/mssql/server:2022-latest` image
- **Health Check**: SQL Server waits for healthy status before starting the API
- **Database**: Persists data in a Docker volume `sqlserver_data`
- **Connection String**: Configured via environment variables in docker-compose.yml

---

## 💻 Running Without Docker

### 1. Update Database Credentials

Edit `TestApi.WebApi/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TestApiDb;User Id=sa;Password=YOUR_PASSWORD_HERE;TrustServerCertificate=True;"
  }
}
```

### 2. Ensure SQL Server is Running

**Windows:**
- SQL Server should be installed and running
- Verify it's listening on port 1433

**Mac (using Docker for SQL Server only):**
```bash
docker run -d \
  --name sqlserver \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Hello@123" \
  -e "MSSQL_PID=Express" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

**Linux:**
```bash
# Ubuntu example
sudo systemctl start mssql-server
```

### 3. Run the Application

```bash
cd TestApi/TestApi.WebApi

# Restore packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run --urls="http://localhost:5000"
```

### 4. Access the API

- **Swagger UI**: http://localhost:5000/swagger
- **API Base URL**: http://localhost:5000

---

## 🔐 Authentication & Seed Data

The application comes with pre-configured seed users:

| Username | Password | Role |
|----------|----------|------|
| admin    | Hello@123 | Admin |
| user     | User@123  | User  |

### Getting a JWT Token

1. Open Swagger UI at http://localhost:5000/swagger (or port 8080 if using Docker)
2. Navigate to `POST /api/Auth/login`
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "username": "admin",
     "password": "Hello@123"
   }
   ```
5. Click "Execute"
6. Copy the returned token

### Using the Token

1. Click the "Authorize" button at the top of Swagger UI
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Now you can access protected endpoints like `GET /api/Products`

---

## 📚 API Endpoints

### Authentication
- `POST /api/Auth/login` - Get JWT token (no auth required)

### Products (Requires Authentication)
- `GET /api/Products` - Get all products
- `GET /api/Products/{id}` - Get product by ID
- `POST /api/Products` - Create a new product
- `PUT /api/Products/{id}` - Update a product
- `DELETE /api/Products/{id}` - Delete a product

---

## 🗂️ Project Structure

```
TestApi/
├── TestApi.Domain/              # Core domain layer
│   ├── Entities/               # Domain entities
│   │   ├── Product.cs
│   │   └── User.cs
│   └── Interfaces/             # Repository interfaces
│       └── IRepository.cs
│
├── TestApi.Application/         # Application layer
│   ├── DTOs/                  # Data transfer objects
│   ├── Interfaces/             # Service interfaces
│   ├── Mappings/               # AutoMapper profiles
│   └── Services/               # Business logic
│
├── TestApi.Infrastructure/      # Infrastructure layer
│   ├── Data/                   # DbContext and configurations
│   │   └── ApplicationDbContext.cs
│   └── Repositories/          # Repository implementations
│
└── TestApi.WebApi/            # Presentation layer
    ├── Controllers/            # API controllers
    │   ├── AuthController.cs
    │   └── ProductsController.cs
    ├── Program.cs
    ├── appsettings.json
    └── Dockerfile
```

---

## 🛠️ Development

### Adding Database Migrations

```bash
cd TestApi.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../TestApi.WebApi
dotnet ef database update --startup-project ../TestApi.WebApi
```

### Changing JWT Settings

Update `appsettings.json` in `TestApi.WebApi`:

```json
{
  "Jwt": {
    "Key": "YourSecretKeyHere_Minimum32CharactersLong",
    "Issuer": "TestApi",
    "Audience": "TestApiUsers",
    "ExpiryInMinutes": 60
  }
}
```

⚠️ **Important**: JWT Key must be at least 32 characters long!

---

## 📝 Logging

Logs are written to:
- **Console** - Serilog console sink
- **File** - `logs/log-YYYYMMDD.txt` (rolling daily)

Configure logging in `appsettings.json` under the `Serilog` section.

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify SQL Server is running and accessible on port 1433
- Check credentials in `appsettings.json`
- Ensure `TrustServerCertificate=True` is set for development

### Port Already in Use
```bash
# Find process using the port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Docker Issues on Mac
- Ensure Docker Desktop is running
- For Apple Silicon Macs, verify Docker is using the correct architecture
- Try rebuilding: `docker-compose up --build --force-recreate`

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔗 Links

- **GitHub Repository**: https://github.com/fahad-poran/TestApi
- **.NET 8 Documentation**: https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

**Created by**: Fahad  
**Last Updated**: May 2026
