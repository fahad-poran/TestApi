using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using TestApi.Application.Interfaces;
using TestApi.Application.Services;

namespace TestApi.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register AutoMapper with the mapping profile
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        
        // Register application services
        services.AddScoped<IProductService, ProductService>();
        
        return services;
    }
}
