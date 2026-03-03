using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class DeleteProductHandlerTests
{
    private readonly IProductRepository _productRepo = Substitute.For<IProductRepository>();

    [Fact]
    public async Task Handle_ExistingProduct_DeletesAndReturnsTrue()
    {
        _productRepo.ExistsAsync("prod1", default).Returns(true);

        var handler = new DeleteProductHandler(_productRepo);
        var result = await handler.Handle(new DeleteProductCommand("prod1"), default);

        result.Should().BeTrue();
        await _productRepo.Received(1).DeleteAsync("prod1", default);
    }

    [Fact]
    public async Task Handle_NonExistingProduct_ThrowsKeyNotFoundException()
    {
        _productRepo.ExistsAsync("notfound", default).Returns(false);

        var handler = new DeleteProductHandler(_productRepo);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(new DeleteProductCommand("notfound"), default));
        await _productRepo.DidNotReceive().DeleteAsync(Arg.Any<string>(), default);
    }
}
