using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using TestApi.Domain.Entities;
using TestApi.Infrastructure.Data;
using TestApi.Application.DTOs;

namespace TestApi.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");

            var query = _context.Invoices
                .Include(i => i.InvoiceItems)
                .Include(i => i.User)
                .AsQueryable();

            if (!isAdmin) query = query.Where(i => i.UserId == userId);

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Product)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null) return NotFound();

            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && invoice.UserId != userId) return Forbid();

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<Invoice>> CreateInvoice(CreateInvoiceDto createDto)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var invoice = new Invoice
            {
                UserId = userId,
                CustomerName = createDto.CustomerName,
                CustomerPhone = createDto.CustomerPhone,
                CreatedAt = DateTime.UtcNow,
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                InvoiceItems = new List<InvoiceItem>()
            };

            // Update stock
            foreach (var itemDto in createDto.InvoiceItems)
            {
                var stock = await _context.Stocks.FirstOrDefaultAsync(s => s.ProductId == itemDto.ProductId);
                if (stock == null || stock.Quantity < itemDto.Quantity)
                    return BadRequest($"Insufficient stock for product {itemDto.ProductId}");
                
                stock.Quantity -= itemDto.Quantity;
                stock.LastUpdated = DateTime.UtcNow;
                
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                var unitPrice = product?.Price ?? 0;
                
                invoice.InvoiceItems.Add(new InvoiceItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = unitPrice,
                    Subtotal = unitPrice * itemDto.Quantity
                });
            }

            invoice.TotalAmount = invoice.InvoiceItems.Sum(ii => ii.Subtotal);

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }

        [HttpGet("pdf/{id}")]
        public async Task<IActionResult> GetInvoicePdf(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Product)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null) return NotFound();

            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);
                    page.Header().Text($"Invoice #{invoice.InvoiceNumber}").FontSize(20).Bold();
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(1);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Product").Bold();
                            header.Cell().Text("Qty").Bold();
                            header.Cell().Text("Price").Bold();
                            header.Cell().Text("Subtotal").Bold();
                        });

                        foreach (var item in invoice.InvoiceItems)
                        {
                            table.Cell().Text(item.Product?.Name ?? "Unknown");
                            table.Cell().Text(item.Quantity.ToString());
                            table.Cell().Text($"${item.UnitPrice:F2}");
                            table.Cell().Text($"${item.Subtotal:F2}");
                        }
                    });

                    page.Footer().Text($"Total: ${invoice.TotalAmount:F2}").Bold().FontSize(14);
                });
            });

            var stream = new MemoryStream();
            document.GeneratePdf(stream);
            stream.Position = 0;

            return File(stream, "application/pdf", $"invoice-{invoice.InvoiceNumber}.pdf");
        }
    }
}
