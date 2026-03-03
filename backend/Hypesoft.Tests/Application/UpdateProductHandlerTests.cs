using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class UpdateProductHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public UpdateProductHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsUpdatedProductDto()
    {
        var category = Category.Create("Calçados", "Desc");
        var product = Product.Create("Old Name", "Old Desc", 100m, category.Id, category.Name, 20);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);
        _categoryRepo.GetByIdAsync(category.Id, default).Returns(category);

        var handler = new UpdateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new UpdateProductCommand(product.Id, "New Name", "New Desc", 250m, category.Id, 5);

        var result = await handler.Handle(command, default);

        result.Should().NotBeNull();
        result.Name.Should().Be("New Name");
        result.Description.Should().Be("New Desc");
        result.Price.Should().Be(250m);
        result.StockQuantity.Should().Be(5);
        await _productRepo.Received(1).UpdateAsync(Arg.Any<Product>(), default);
    }

    [Fact]
    public async Task Handle_ProductNotFound_ThrowsKeyNotFoundException()
    {
        _productRepo.GetByIdAsync(Arg.Any<string>(), default).Returns((Product?)null);

        var handler = new UpdateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new UpdateProductCommand("nonexistent", "N", "D", 10m, "cat1", 5);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(command, default));
        await _productRepo.DidNotReceive().UpdateAsync(Arg.Any<Product>(), default);
    }

    [Fact]
    public async Task Handle_CategoryNotFound_ThrowsKeyNotFoundException()
    {
        var product = Product.Create("P", "D", 10m, "cat1", "Cat", 5);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);
        _categoryRepo.GetByIdAsync(Arg.Any<string>(), default).Returns((Category?)null);

        var handler = new UpdateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new UpdateProductCommand(product.Id, "N", "D", 10m, "nonexistent-cat", 5);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(command, default));
        await _productRepo.DidNotReceive().UpdateAsync(Arg.Any<Product>(), default);
    }

    [Theory]
    [InlineData(0, true)]
    [InlineData(9, true)]
    [InlineData(10, false)]
    [InlineData(50, false)]
    public async Task Handle_UpdatedStock_IsLowStockReflectsQuantity(int newQuantity, bool expectedLowStock)
    {
        var category = Category.Create("Cat", "Desc");
        var product = Product.Create("P", "D", 1m, category.Id, category.Name, 20);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);
        _categoryRepo.GetByIdAsync(category.Id, default).Returns(category);

        var handler = new UpdateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new UpdateProductCommand(product.Id, "P", "D", 1m, category.Id, newQuantity);

        var result = await handler.Handle(command, default);

        result.IsLowStock.Should().Be(expectedLowStock);
    }

    [Fact]
    public async Task Handle_CategoryChange_UpdatesCategoryName()
    {
        var oldCategory = Category.Create("Old Cat", "Desc");
        var newCategory = Category.Create("New Cat", "Desc");
        var product = Product.Create("P", "D", 1m, oldCategory.Id, oldCategory.Name, 10);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);
        _categoryRepo.GetByIdAsync(newCategory.Id, default).Returns(newCategory);

        var handler = new UpdateProductHandler(_productRepo, _categoryRepo, _mapper);
        var command = new UpdateProductCommand(product.Id, "P", "D", 1m, newCategory.Id, 10);

        var result = await handler.Handle(command, default);

        result.CategoryName.Should().Be("New Cat");
        result.CategoryId.Should().Be(newCategory.Id);
    }
}
