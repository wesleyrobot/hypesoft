using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Handlers.Dashboard;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class GetDashboardHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public GetDashboardHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    private void SetupDefaults(
        long totalProducts = 10,
        decimal totalStockValue = 5000m,
        IEnumerable<Product>? lowStock = null,
        Dictionary<string, int>? countByCategory = null,
        Dictionary<string, decimal>? valueByCategory = null,
        IEnumerable<Product>? recent = null,
        IEnumerable<Category>? categories = null)
    {
        _productRepo.CountAsync(default).Returns(totalProducts);
        _productRepo.GetTotalStockValueAsync(default).Returns(totalStockValue);
        _productRepo.GetLowStockAsync(default).Returns(lowStock ?? Enumerable.Empty<Product>());
        _productRepo.GetProductCountByCategoryAsync(default).Returns(countByCategory ?? new Dictionary<string, int>());
        _productRepo.GetStockValueByCategoryAsync(default).Returns(valueByCategory ?? new Dictionary<string, decimal>());
        _productRepo.GetRecentAsync(6, default).Returns(recent ?? Enumerable.Empty<Product>());
        _categoryRepo.GetAllAsync(default).Returns(categories ?? Enumerable.Empty<Category>());
    }

    [Fact]
    public async Task Handle_ReturnsDashboardWithCorrectTotals()
    {
        SetupDefaults(totalProducts: 25, totalStockValue: 12500m);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        result.TotalProducts.Should().Be(25);
        result.TotalStockValue.Should().Be(12500m);
    }

    [Fact]
    public async Task Handle_ReturnsCorrectLowStockCount()
    {
        var lowStockProducts = new[]
        {
            Product.Create("Meia", "D", 20m, "c1", "Acessórios", 2),
            Product.Create("Boné", "D", 50m, "c1", "Acessórios", 5),
        };
        SetupDefaults(lowStock: lowStockProducts);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        result.LowStockCount.Should().Be(2);
        result.LowStockProducts.Should().HaveCount(2);
    }

    [Fact]
    public async Task Handle_ReturnsCorrectCategoryCount()
    {
        var categories = new[]
        {
            Category.Create("Camisetas", "D"),
            Category.Create("Calças", "D"),
            Category.Create("Jaquetas", "D"),
        };
        SetupDefaults(categories: categories);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        result.CategoryCount.Should().Be(3);
    }

    [Fact]
    public async Task Handle_BuildsCategoryStatsWithStockValue()
    {
        var countByCategory = new Dictionary<string, int>
        {
            { "Camisetas", 5 },
            { "Calças", 3 },
        };
        var valueByCategory = new Dictionary<string, decimal>
        {
            { "Camisetas", 1500m },
            { "Calças", 900m },
        };
        SetupDefaults(countByCategory: countByCategory, valueByCategory: valueByCategory);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        result.ProductsByCategory.Should().HaveCount(2);
        var camisetas = result.ProductsByCategory.First(c => c.CategoryName == "Camisetas");
        camisetas.ProductCount.Should().Be(5);
        camisetas.StockValue.Should().Be(1500m);
    }

    [Fact]
    public async Task Handle_CategoryWithNoStockValue_UsesZeroFallback()
    {
        var countByCategory = new Dictionary<string, int> { { "Acessórios", 2 } };
        var valueByCategory = new Dictionary<string, decimal>(); // empty — no stock value for this category
        SetupDefaults(countByCategory: countByCategory, valueByCategory: valueByCategory);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        var stats = result.ProductsByCategory.First(c => c.CategoryName == "Acessórios");
        stats.StockValue.Should().Be(0m);
    }

    [Fact]
    public async Task Handle_ReturnsRecentProducts()
    {
        var recent = new[]
        {
            Product.Create("P1", "D", 100m, "c1", "Cat", 10),
            Product.Create("P2", "D", 200m, "c1", "Cat", 5),
        };
        SetupDefaults(recent: recent);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        result.RecentProducts.Should().HaveCount(2);
    }

    [Fact]
    public async Task Handle_EmptyDatabase_ReturnsDashboardWithZeros()
    {
        SetupDefaults(totalProducts: 0, totalStockValue: 0m);

        var handler = new GetDashboardHandler(_productRepo, _categoryRepo, _mapper);
        var result = await handler.Handle(new GetDashboardQuery(), default);

        result.TotalProducts.Should().Be(0);
        result.TotalStockValue.Should().Be(0m);
        result.LowStockCount.Should().Be(0);
        result.CategoryCount.Should().Be(0);
        result.LowStockProducts.Should().BeEmpty();
        result.ProductsByCategory.Should().BeEmpty();
        result.RecentProducts.Should().BeEmpty();
    }
}
