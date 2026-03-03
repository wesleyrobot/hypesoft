using FluentAssertions;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Tests.Domain;

public class CategoryEntityTests
{
    [Fact]
    public void Create_ShouldReturnCategoryWithCorrectValues()
    {
        var category = Category.Create("Jaquetas", "Jaquetas e casacos");

        category.Name.Should().Be("Jaquetas");
        category.Description.Should().Be("Jaquetas e casacos");
        category.Id.Should().NotBeNullOrEmpty();
        category.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void Update_ShouldChangeCategoryFields()
    {
        var category = Category.Create("Old", "Old Desc");

        category.Update("New", "New Desc");

        category.Name.Should().Be("New");
        category.Description.Should().Be("New Desc");
    }

    [Fact]
    public void Create_ShouldGenerateUniqueIds()
    {
        var c1 = Category.Create("Cat1", "Desc1");
        var c2 = Category.Create("Cat2", "Desc2");

        c1.Id.Should().NotBe(c2.Id);
    }
}
