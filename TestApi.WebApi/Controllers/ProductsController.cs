using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApi.Application.DTOs;
using TestApi.Application.Interfaces;
using TestApi.Domain.Entities;
using TestApi.Infrastructure.Data;

namespace TestApi.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ApplicationDbContext _context;
    
    public ProductsController(IProductService productService, ApplicationDbContext context)
    {
        _productService = productService;
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
            return NotFound();
        
        return Ok(product);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var product = await _productService.CreateProductAsync(dto);

        // Auto-create stock entry for the new product
        var stock = new Stock
        {
            ProductId = product.Id,
            Quantity = dto.InitialStock,
            ReorderLevel = 10,
            LastUpdated = DateTime.UtcNow
        };
        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateProductDto dto)
    {
        try
        {
            await _productService.UpdateProductAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
