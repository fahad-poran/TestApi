using System.Security.Cryptography;
using System.Text;

// Hash passwords
string HashPassword(string password)
{
    using var sha256 = SHA256.Create();
    var bytes = Encoding.UTF8.GetBytes(password);
    var hash = sha256.ComputeHash(bytes);
    return Convert.ToBase64String(hash);
}

var adminHash = HashPassword("Hello@123");
var userHash = HashPassword("User@123");

Console.WriteLine("Use these SQL commands to seed the Users table:");
Console.WriteLine();
Console.WriteLine("-- Create Users table if not exists");
Console.WriteLine(@"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
CREATE TABLE Users (
    Id int IDENTITY(1,1) PRIMARY KEY,
    Username nvarchar(50) NOT NULL UNIQUE,
    PasswordHash nvarchar(MAX) NOT NULL,
    Role nvarchar(20) NULL,
    CreatedAt datetime2 NOT NULL
);");
Console.WriteLine();
Console.WriteLine("-- Insert seed data (run only if table is empty)");
Console.WriteLine($"INSERT INTO Users (Username, PasswordHash, Role, CreatedAt) VALUES ");
Console.WriteLine($"('admin', '{adminHash}', 'Admin', GETUTCDATE()),");
Console.WriteLine($"('user', '{userHash}', 'User', GETUTCDATE());");
Console.WriteLine();
Console.WriteLine("Admin password hash: " + adminHash);
Console.WriteLine("User password hash: " + userHash);
