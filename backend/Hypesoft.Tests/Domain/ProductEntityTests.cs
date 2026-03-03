using FluentAssertions;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Tests.Domain;

public class ProductEntityTests
{
    [Fact]
    public void Create_ShouldReturnProductWithCorrectValues()
    {
        var product = Product.Create("Bomber Jacket", "Desc", 299.90m, "cat1", "Jaquetas", 15);

        product.Name.Should().Be("Bomber Jacket");
        product.Description.Should().Be("Desc");
        product.Price.Should().Be(299.90m);
        product.CategoryId.Should().Be("cat1");
        product.CategoryName.Should().Be("Jaquetas");
        product.StockQuantity.Should().Be(15);
        product.Id.Should().NotBeNullOrEmpty();
        product.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Create_ShouldRaiseDomainEvent()
    {
        var product = Product.Create("Test", "Desc", 100m, "cat1", "Cat", 5);

        product.DomainEvents.Should().ContainSingle()
            .Which.Should().BeAssignableTo<Hypesoft.Domain.DomainEvents.ProductCreatedEvent>();
    }

    [Theory]
    [InlineData(0, true)]
    [InlineData(5, true)]
    [InlineData(9, true)]
    [InlineData(10, false)]
    [InlineData(50, false)]
    public void IsLowStock_ShouldReflectStockQuantity(int stock, bool expected)
    {
        var product = Product.Create("P", "D", 1m, "c", "C", stock);

        product.IsLowStock.Should().Be(expected);
    }

    [Fact]
    public void Update_ShouldChangeProductFields()
    {
        var product = Product.Create("Old Name", "Old Desc", 100m, "cat1", "Cat1", 10);

        product.Update("New Name", "New Desc", 200m, "cat2", "Cat2");

        product.Name.Should().Be("New Name");
        product.Description.Should().Be("New Desc");
        product.Price.Should().Be(200m);
        product.CategoryId.Should().Be("cat2");
        product.CategoryName.Should().Be("Cat2");
    }

    [Fact]
    public void UpdateStock_ShouldChangeQuantityAndRaiseDomainEvent()
    {
        var product = Product.Create("P", "D", 1m, "c", "C", 20);
        product.ClearDomainEvents();

        product.UpdateStock(5);

        product.StockQuantity.Should().Be(5);
        product.DomainEvents.Should().ContainSingle()
            .Which.Should().BeAssignableTo<Hypesoft.Domain.DomainEvents.StockUpdatedEvent>();
    }

    [Fact]
    public void ClearDomainEvents_ShouldEmptyEvents()
    {
        var product = Product.Create("P", "D", 1m, "c", "C", 5);

        product.ClearDomainEvents();

        product.DomainEvents.Should().BeEmpty();
    }

    [Fact]
    public void Create_ShouldGenerateUniqueIds()
    {
        var p1 = Product.Create("P1", "D", 1m, "c", "C", 1);
        var p2 = Product.Create("P2", "D", 1m, "c", "C", 1);

        p1.Id.Should().NotBe(p2.Id);
    }

    [Fact]
    public void UpdateStock_ToAboveTen_IsLowStockBecomeFalse()
    {
        var product = Product.Create("P", "D", 1m, "c", "C", 5);
        product.IsLowStock.Should().BeTrue();

        product.UpdateStock(20);

        product.IsLowStock.Should().BeFalse();
    }

    [Fact]
    public void UpdateStock_ToZero_IsLowStockTrue()
    {
        var product = Product.Create("P", "D", 1m, "c", "C", 50);

        product.UpdateStock(0);

        product.IsLowStock.Should().BeTrue();
        product.StockQuantity.Should().Be(0);
    }

    [Fact]
    public void Create_UpdatedAtEqualsCreatedAt()
    {
        var product = Product.Create("P", "D", 1m, "c", "C", 10);

        product.UpdatedAt.Should().BeCloseTo(product.CreatedAt, TimeSpan.FromMilliseconds(1));
    }
}
