using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Hypesoft.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace Hypesoft.Infrastructure.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var mongoSettings = new MongoDbSettings();
        configuration.GetSection("MongoDb").Bind(mongoSettings);

        services.AddDbContext<MongoDbContext>(options =>
            options.UseMongoDB(mongoSettings.ConnectionString, mongoSettings.DatabaseName));

        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ISaleTransactionRepository, SaleTransactionRepository>();
        return services;
    }
}
