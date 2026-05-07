namespace TestApi.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = Guid.NewGuid().ToString()[..8].ToUpper();
    public int UserId { get; set; }
    public User? User { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<InvoiceItem> InvoiceItems { get; set; } = new();
}
