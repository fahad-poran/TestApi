FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution and project files
COPY *.sln .
COPY TestApi.WebApi/*.csproj ./TestApi.WebApi/
COPY TestApi.Application/*.csproj ./TestApi.Application/
COPY TestApi.Domain/*.csproj ./TestApi.Domain/
COPY TestApi.Infrastructure/*.csproj ./TestApi.Infrastructure/

# Restore packages
RUN dotnet restore

# Copy source code
COPY . .

# Build and publish
WORKDIR /app/TestApi.WebApi
RUN dotnet publish -c Release -o /app/published

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/published .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

EXPOSE 80

ENTRYPOINT ["dotnet", "TestApi.WebApi.dll"]
