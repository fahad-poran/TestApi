using AutoMapper;
using TestApi.Application.DTOs;
using TestApi.Domain.Entities;

namespace TestApi.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<CreateProductDto, Product>().ReverseMap();
    }
}
