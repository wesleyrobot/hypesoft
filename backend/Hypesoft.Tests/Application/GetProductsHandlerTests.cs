using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class GetProductsHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly IMapper _mapper;

    public GetProductsHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ReturnsPagedResult()
    {
        var products = new List<Product>
        {
            Product.Create("Camiseta", "Desc", 59.90m, "cat1", "Camisetas", 20),
            Product.Create("Calça", "Desc", 120m, "cat2", "Calças", 15),
        };
        _productRepo.GetPagedAsync(1, 10, null, null, default)
            .Returns((products.AsEnumerable(), 2));

        var handler = new GetProductsHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductsQuery(1, 10, null, null), default);

        result.Should().NotBeNull();
        result.Items.Should().HaveCount(2);
        result.Total.Should().Be(2);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
    }

    [Fact]
    public async Task Handle_WithSearch_PassesSearchToRepository()
    {
        _productRepo.GetPagedAsync(1, 10, "Camiseta", null, default)
            .Returns((Enumerable.Empty<Product>(), 0));

        var handler = new GetProductsHandler(_productRepo, _mapper);
        await handler.Handle(new GetProductsQuery(1, 10, "Camiseta", null), default);

        await _productRepo.Received(1).GetPagedAsync(1, 10, "Camiseta", null, default);
    }

    [Fact]
    public async Task Handle_WithCategoryId_PassesCategoryIdToRepository()
    {
        _productRepo.GetPagedAsync(2, 5, null, "cat1", default)
            .Returns((Enumerable.Empty<Product>(), 0));

        var handler = new GetProductsHandler(_productRepo, _mapper);
        await handler.Handle(new GetProductsQuery(2, 5, null, "cat1"), default);

        await _productRepo.Received(1).GetPagedAsync(2, 5, null, "cat1", default);
    }

    [Fact]
    public async Task Handle_EmptyResult_ReturnsEmptyPagedResult()
    {
        _productRepo.GetPagedAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string?>(), Arg.Any<string?>(), default)
            .Returns((Enumerable.Empty<Product>(), 0));

        var handler = new GetProductsHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductsQuery(1, 10, null, null), default);

        result.Items.Should().BeEmpty();
        result.Total.Should().Be(0);
    }

    [Fact]
    public async Task Handle_MapsProductFieldsCorrectly()
    {
        var product = Product.Create("Jaqueta", "Desc detalhada", 350m, "cat3", "Jaquetas", 3);
        _productRepo.GetPagedAsync(1, 10, null, null, default)
            .Returns((new[] { product }.AsEnumerable(), 1));

        var handler = new GetProductsHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductsQuery(1, 10, null, null), default);

        var dto = result.Items.First();
        dto.Name.Should().Be("Jaqueta");
        dto.Price.Should().Be(350m);
        dto.CategoryName.Should().Be("Jaquetas");
        dto.IsLowStock.Should().BeTrue();
    }
}

public class GetProductByIdHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly IMapper _mapper;

    public GetProductByIdHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ExistingProduct_ReturnsDto()
    {
        var product = Product.Create("Tênis", "Desc", 299m, "cat1", "Calçados", 10);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);

        var handler = new GetProductByIdHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductByIdQuery(product.Id), default);

        result.Should().NotBeNull();
        result!.Id.Should().Be(product.Id);
        result.Name.Should().Be("Tênis");
    }

    [Fact]
    public async Task Handle_NonExistingProduct_ReturnsNull()
    {
        _productRepo.GetByIdAsync("nonexistent", default).Returns((Product?)null);

        var handler = new GetProductByIdHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetProductByIdQuery("nonexistent"), default);

        result.Should().BeNull();
    }
}

public class GetLowStockProductsHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly IMapper _mapper;

    public GetLowStockProductsHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ReturnsLowStockProducts()
    {
        var lowStockProducts = new List<Product>
        {
            Product.Create("Meia", "Desc", 20m, "cat1", "Acessórios", 3),
            Product.Create("Boné", "Desc", 50m, "cat1", "Acessórios", 0),
        };
        _productRepo.GetLowStockAsync(default).Returns(lowStockProducts.AsEnumerable());

        var handler = new GetLowStockProductsHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetLowStockProductsQuery(), default);

        result.Should().HaveCount(2);
        result.All(p => p.IsLowStock).Should().BeTrue();
    }

    [Fact]
    public async Task Handle_NoLowStockProducts_ReturnsEmptyList()
    {
        _productRepo.GetLowStockAsync(default).Returns(Enumerable.Empty<Product>());

        var handler = new GetLowStockProductsHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetLowStockProductsQuery(), default);

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_MapsAllLowStockFields()
    {
        var product = Product.Create("Cinto", "Desc", 45m, "cat2", "Acessórios", 5);
        _productRepo.GetLowStockAsync(default).Returns(new[] { product }.AsEnumerable());

        var handler = new GetLowStockProductsHandler(_productRepo, _mapper);
        var result = await handler.Handle(new GetLowStockProductsQuery(), default);

        var dto = result.First();
        dto.Name.Should().Be("Cinto");
        dto.StockQuantity.Should().Be(5);
        dto.IsLowStock.Should().BeTrue();
    }
}
