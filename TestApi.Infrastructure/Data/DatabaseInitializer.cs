using Microsoft.EntityFrameworkCore;
using TestApi.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace TestApi.Infrastructure.Data;

public static class DatabaseInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if users already exist
        if (await context.Users.AnyAsync())
        {
            return; // Database already seeded
        }

        // Hash passwords using SHA256
        var adminPasswordHash = HashPassword("Hello@123");
        var userPasswordHash = HashPassword("User@123");

        // Seed users
        var users = new[]
        {
            new User 
            { 
                Id = 1, 
                Username = "admin", 
                PasswordHash = adminPasswordHash, 
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            },
            new User 
            { 
                Id = 2, 
                Username = "user", 
                PasswordHash = userPasswordHash, 
                Role = "User",
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
