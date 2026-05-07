namespace TestApi.Domain.Entities;

public class Stock
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public int Quantity { get; set; }
    public int ReorderLevel { get; set; } = 10;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
