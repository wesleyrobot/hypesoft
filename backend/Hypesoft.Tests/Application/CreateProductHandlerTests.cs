using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class CreateProductHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public CreateProductHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsProductDto()
    {
        var category = Category.Create("Jaquetas", "Desc");
        _categoryRepo.GetByIdAsync(category.Id, default).Returns(category);

        var handler = new CreateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new CreateProductCommand("Bomber", "Desc", 299.90m, category.Id, 10);

        var result = await handler.Handle(command, default);

        result.Should().NotBeNull();
        result.Name.Should().Be("Bomber");
        result.Price.Should().Be(299.90m);
        result.CategoryId.Should().Be(category.Id);
        result.CategoryName.Should().Be("Jaquetas");
        result.StockQuantity.Should().Be(10);
        await _productRepo.Received(1).AddAsync(Arg.Any<Product>(), default);
    }

    [Fact]
    public async Task Handle_CategoryNotFound_ThrowsKeyNotFoundException()
    {
        _categoryRepo.GetByIdAsync(Arg.Any<string>(), default).Returns((Category?)null);

        var handler = new CreateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new CreateProductCommand("P", "D", 100m, "nonexistent", 5);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(command, default));
        await _productRepo.DidNotReceive().AddAsync(Arg.Any<Product>(), default);
    }

    [Fact]
    public async Task Handle_NewProduct_IsLowStockWhenQuantityBelowTen()
    {
        var category = Category.Create("Cat", "Desc");
        _categoryRepo.GetByIdAsync(category.Id, default).Returns(category);

        var handler = new CreateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new CreateProductCommand("P", "D", 50m, category.Id, 3);

        var result = await handler.Handle(command, default);

        result.IsLowStock.Should().BeTrue();
    }
}
