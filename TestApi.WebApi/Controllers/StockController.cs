using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApi.Domain.Entities;
using TestApi.Infrastructure.Data;

namespace TestApi.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StockController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("low-stock")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Stock>>> GetLowStock()
        {
            return await _context.Stocks
                .Include(s => s.Product)
                .Where(s => s.Quantity <= s.ReorderLevel)
                .ToListAsync();
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<Stock>> GetProductStock(int productId)
        {
            var stock = await _context.Stocks
                .FirstOrDefaultAsync(s => s.ProductId == productId);
            return stock == null ? NotFound() : Ok(stock);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStock(int id, int quantity)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null) return NotFound();
            
            stock.Quantity = quantity;
            stock.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
