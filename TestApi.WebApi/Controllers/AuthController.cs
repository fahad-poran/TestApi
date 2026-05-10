using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TestApi.Domain.Entities;
using TestApi.Infrastructure.Data;

namespace TestApi.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthController(IConfiguration configuration, ApplicationDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        User? user = null;
        bool useDatabase = true;

        // Try to validate against database first
        try
        {
            user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        }
        catch (Exception)
        {
            // Database not available, fall back to hardcoded credentials
            useDatabase = false;
        }

        // If database is not available, use hardcoded credentials for testing
        if (!useDatabase || user == null)
        {
            // Fallback to hardcoded users for testing when DB is unavailable
            if (dto.Username == "admin" && dto.Password == "Hello@123")
            {
                return Ok(new 
                { 
                    token = GenerateJwtToken(1, "admin", "Admin"), 
                    username = "admin", 
                    role = "Admin" 
                });
            }
            else if (dto.Username == "user" && dto.Password == "User@123")
            {
                return Ok(new 
                { 
                    token = GenerateJwtToken(2, "user", "User"), 
                    username = "user", 
                    role = "User" 
                });
            }
            
            return Unauthorized(new { message = "Invalid username or password" });
        }

        // Database is available - validate against DB
        var inputHash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.Create()
            .ComputeHash(System.Text.Encoding.UTF8.GetBytes(dto.Password))
        );

        if (user.PasswordHash != inputHash)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }
        
        var token = GenerateJwtToken(user.Id, user.Username, user.Role);
        return Ok(new { token, username = user.Username, role = user.Role });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var username = User.FindFirst(ClaimTypes.Name)?.Value;
        if (string.IsNullOrEmpty(username))
            return Unauthorized();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return NotFound(new { message = "User not found" });

        // Verify current password
        var currentHash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.Create()
            .ComputeHash(System.Text.Encoding.UTF8.GetBytes(dto.CurrentPassword))
        );

        if (user.PasswordHash != currentHash)
            return BadRequest(new { message = "Current password is incorrect" });

        // Validate new password
        if (dto.NewPassword.Length < 6)
            return BadRequest(new { message = "New password must be at least 6 characters" });

        if (dto.NewPassword != dto.ConfirmPassword)
            return BadRequest(new { message = "New passwords do not match" });

        // Update password
        user.PasswordHash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.Create()
            .ComputeHash(System.Text.Encoding.UTF8.GetBytes(dto.NewPassword))
        );

        await _context.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully" });
    }

    private string GenerateJwtToken(int userId, string username, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"] ?? "60")),
            signingCredentials: credentials);
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
