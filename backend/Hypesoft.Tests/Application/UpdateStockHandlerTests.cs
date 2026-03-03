using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Mappings;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class UpdateStockHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();
    private readonly IMapper _mapper;

    public UpdateStockHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ValidCommand_UpdatesStockAndReturnsDto()
    {
        var product = Product.Create("Canvas Sneaker", "Desc", 199.90m, "cat1", "Calçados", 3);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);

        var handler = new UpdateStockHandler(_productRepo, _mapper);
        var command = new UpdateStockCommand(product.Id, 25);

        var result = await handler.Handle(command, default);

        result.StockQuantity.Should().Be(25);
        result.IsLowStock.Should().BeFalse();
        await _productRepo.Received(1).UpdateAsync(Arg.Any<Product>(), default);
    }

    [Fact]
    public async Task Handle_ProductNotFound_ThrowsKeyNotFoundException()
    {
        _productRepo.GetByIdAsync(Arg.Any<string>(), default).Returns((Product?)null);

        var handler = new UpdateStockHandler(_productRepo, _mapper);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(new UpdateStockCommand("nonexistent", 10), default));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(5)]
    [InlineData(9)]
    public async Task Handle_LowStockQuantity_ReturnsIsLowStockTrue(int quantity)
    {
        var product = Product.Create("P", "D", 1m, "c", "C", 20);
        _productRepo.GetByIdAsync(product.Id, default).Returns(product);

        var handler = new UpdateStockHandler(_productRepo, _mapper);
        var result = await handler.Handle(new UpdateStockCommand(product.Id, quantity), default);

        result.IsLowStock.Should().BeTrue();
    }
}
