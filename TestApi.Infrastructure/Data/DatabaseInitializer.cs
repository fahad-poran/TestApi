using Microsoft.EntityFrameworkCore;
using TestApi.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace TestApi.Infrastructure.Data;

public static class DatabaseInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed users if they don't exist
        if (!await context.Users.AnyAsync(u => u.Username == "admin"))
        {
            // Hash passwords using SHA256
            var adminPasswordHash = HashPassword("Hello@123");
            var userPasswordHash = HashPassword("User@123");

            var users = new[]
            {
                new User 
                { 
                    Username = "admin", 
                    PasswordHash = adminPasswordHash, 
                    Role = "Admin", 
                    CreatedAt = DateTime.UtcNow 
                },
                new User 
                { 
                    Username = "user", 
                    PasswordHash = userPasswordHash, 
                    Role = "User", 
                    CreatedAt = DateTime.UtcNow 
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }

        // Seed categories if they don't exist
        if (!await context.Categories.AnyAsync())
        {
            var categories = new[]
            {
                new Category { Name = "Produce", Description = "Fresh fruits and vegetables" },
                new Category { Name = "Bakery", Description = "Bread, pastries, and baked goods" },
                new Category { Name = "Dairy", Description = "Milk, cheese, yogurt, and eggs" },
                new Category { Name = "Meat & Poultry", Description = "Fresh meat and poultry products" },
                new Category { Name = "Pantry", Description = "Dry goods, canned items, and staples" }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // Seed products if they don't exist
        if (!await context.Products.AnyAsync())
        {
            // Get category IDs
            var produce = await context.Categories.FirstAsync(c => c.Name == "Produce");
            var bakery = await context.Categories.FirstAsync(c => c.Name == "Bakery");
            var dairy = await context.Categories.FirstAsync(c => c.Name == "Dairy");
            var meat = await context.Categories.FirstAsync(c => c.Name == "Meat & Poultry");
            var pantry = await context.Categories.FirstAsync(c => c.Name == "Pantry");

            var products = new[]
            {
                new Product { Name = "Organic Apples", Price = 2.99m, Description = "Fresh organic apples from local farm", CategoryId = produce.Id },
                new Product { Name = "Whole Grain Bread", Price = 3.49m, Description = "Freshly baked whole grain bread", CategoryId = bakery.Id },
                new Product { Name = "Free Range Eggs", Price = 4.99m, Description = "Dozen free-range eggs", CategoryId = dairy.Id },
                new Product { Name = "Almond Milk", Price = 3.99m, Description = "Unsweetened almond milk 1L", CategoryId = dairy.Id },
                new Product { Name = "Greek Yogurt", Price = 5.49m, Description = "Organic Greek yogurt 500g", CategoryId = dairy.Id },
                new Product { Name = "Chicken Breast", Price = 8.99m, Description = "Boneless skinless chicken breast 1kg", CategoryId = meat.Id },
                new Product { Name = "Brown Rice", Price = 2.49m, Description = "Organic brown rice 1kg", CategoryId = pantry.Id },
                new Product { Name = "Bananas", Price = 1.99m, Description = "Fresh organic bananas per bunch", CategoryId = produce.Id },
                new Product { Name = "Cheddar Cheese", Price = 6.99m, Description = "Aged cheddar cheese 250g", CategoryId = dairy.Id },
                new Product { Name = "Croissants", Price = 4.49m, Description = "Butter croissants pack of 4", CategoryId = bakery.Id }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }

        // Seed stock if it doesn't exist
        if (!await context.Stocks.AnyAsync())
        {
            // Get product IDs
            var apple = await context.Products.FirstAsync(p => p.Name == "Organic Apples");
            var bread = await context.Products.FirstAsync(p => p.Name == "Whole Grain Bread");
            var eggs = await context.Products.FirstAsync(p => p.Name == "Free Range Eggs");
            var milk = await context.Products.FirstAsync(p => p.Name == "Almond Milk");
            var yogurt = await context.Products.FirstAsync(p => p.Name == "Greek Yogurt");
            var chicken = await context.Products.FirstAsync(p => p.Name == "Chicken Breast");
            var rice = await context.Products.FirstAsync(p => p.Name == "Brown Rice");
            var bananas = await context.Products.FirstAsync(p => p.Name == "Bananas");
            var cheese = await context.Products.FirstAsync(p => p.Name == "Cheddar Cheese");
            var croissants = await context.Products.FirstAsync(p => p.Name == "Croissants");

            var stocks = new[]
            {
                new Stock { ProductId = apple.Id, Quantity = 150, ReorderLevel = 20, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = bread.Id, Quantity = 80, ReorderLevel = 15, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = eggs.Id, Quantity = 45, ReorderLevel = 10, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = milk.Id, Quantity = 60, ReorderLevel = 12, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = yogurt.Id, Quantity = 35, ReorderLevel = 8, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = chicken.Id, Quantity = 25, ReorderLevel = 5, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = rice.Id, Quantity = 100, ReorderLevel = 20, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = bananas.Id, Quantity = 200, ReorderLevel = 30, LastUpdated = DateTime.UtcNow },
                new Stock { ProductId = cheese.Id, Quantity = 0, ReorderLevel = 5, LastUpdated = DateTime.UtcNow },  // Out of stock
                new Stock { ProductId = croissants.Id, Quantity = 8, ReorderLevel = 10, LastUpdated = DateTime.UtcNow }  // Low stock
            };

            await context.Stocks.AddRangeAsync(stocks);
            await context.SaveChangesAsync();
        }
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
