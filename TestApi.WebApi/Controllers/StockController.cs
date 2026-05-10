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

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Stock>>> GetAllStock()
        {
            return await _context.Stocks
                .Include(s => s.Product)
                .OrderBy(s => s.Product!.Name)
                .ToListAsync();
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
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockDto dto)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null) return NotFound();
            
            stock.Quantity = dto.Quantity;
            stock.ReorderLevel = dto.ReorderLevel;
            stock.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("summary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStockSummary()
        {
            var totalProducts = await _context.Products.CountAsync();
            var lowStock = await _context.Stocks.CountAsync(s => s.Quantity <= s.ReorderLevel && s.Quantity > 0);
            var outOfStock = await _context.Stocks.CountAsync(s => s.Quantity == 0);
            
            return Ok(new 
            { 
                TotalProducts = totalProducts,
                LowStockCount = lowStock,
                OutOfStockCount = outOfStock,
                LastUpdated = DateTime.UtcNow
            });
        }
    }

    public class UpdateStockDto
    {
        public int Quantity { get; set; }
        public int ReorderLevel { get; set; } = 10;
    }
}
