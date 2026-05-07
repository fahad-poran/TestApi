using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApi.Infrastructure.Data;

namespace TestApi.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("sales-trend")]
        public async Task<IActionResult> GetSalesTrend(int days = 7)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var sales = await _context.Invoices
                .Where(i => i.CreatedAt >= since)
                .GroupBy(i => i.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Total = g.Sum(i => i.TotalAmount) })
                .OrderBy(x => x.Date)
                .ToListAsync();
            return Ok(sales);
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts(int count = 5)
        {
            var topProducts = await _context.InvoiceItems
                .Include(ii => ii.Product)
                .GroupBy(ii => new { ii.ProductId, ii.Product!.Name })
                .Select(g => new 
                { 
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.Name,
                    TotalSold = g.Sum(ii => ii.Quantity),
                    Revenue = g.Sum(ii => ii.Subtotal)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(count)
                .ToListAsync();
            return Ok(topProducts);
        }

        [HttpGet("stock-summary")]
        public async Task<IActionResult> GetStockSummary()
        {
            var totalProducts = await _context.Products.CountAsync();
            var lowStock = await _context.Stocks.CountAsync(s => s.Quantity <= s.ReorderLevel);
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
}
