namespace TestApi.Application.DTOs;

public class CreateInvoiceDto
{
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public List<CreateInvoiceItemDto> InvoiceItems { get; set; } = new();
}

public class CreateInvoiceItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
