using AutoMapper;
using TestApi.Application.DTOs;
using TestApi.Application.Interfaces;
using TestApi.Domain.Entities;
using TestApi.Domain.Interfaces;

namespace TestApi.Application.Services;

public class ProductService : IProductService
{
    private readonly IRepository<Product> _repository;
    private readonly IMapper _mapper;

    public ProductService(IRepository<Product> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _repository.GetByIdAsync(id);
        return product == null ? null : _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        product.CreatedAt = DateTime.UtcNow;
        var created = await _repository.AddAsync(product);
        return _mapper.Map<ProductDto>(created);
    }

    public async Task UpdateProductAsync(int id, CreateProductDto dto)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) throw new KeyNotFoundException($"Product with id {id} not found.");
        _mapper.Map(dto, product);
        await _repository.UpdateAsync(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) throw new KeyNotFoundException($"Product with id {id} not found.");
        await _repository.DeleteAsync(product);
    }
}
