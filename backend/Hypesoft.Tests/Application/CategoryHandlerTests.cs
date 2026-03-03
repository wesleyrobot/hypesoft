using AutoMapper;
using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Application.Mappings;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class CreateCategoryHandlerTests
{
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public CreateCategoryHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsCategoryDto()
    {
        _categoryRepo.NameExistsAsync("Camisetas", default).Returns(false);

        var handler = new CreateCategoryHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new CreateCategoryCommand("Camisetas", "Roupas de algodão"), default);

        result.Should().NotBeNull();
        result.Name.Should().Be("Camisetas");
        result.Description.Should().Be("Roupas de algodão");
        result.Id.Should().NotBeNullOrEmpty();
        await _categoryRepo.Received(1).AddAsync(Arg.Any<Category>(), default);
    }

    [Fact]
    public async Task Handle_DuplicateName_ThrowsInvalidOperationException()
    {
        _categoryRepo.NameExistsAsync("Calças", default).Returns(true);

        var handler = new CreateCategoryHandler(_categoryRepo, _mapper);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            handler.Handle(new CreateCategoryCommand("Calças", "Desc"), default));
        await _categoryRepo.DidNotReceive().AddAsync(Arg.Any<Category>(), default);
    }

    [Fact]
    public async Task Handle_EmptyDescription_StillCreatesCategory()
    {
        _categoryRepo.NameExistsAsync(Arg.Any<string>(), default).Returns(false);

        var handler = new CreateCategoryHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new CreateCategoryCommand("Acessórios", ""), default);

        result.Should().NotBeNull();
        result.Name.Should().Be("Acessórios");
    }
}

public class UpdateCategoryHandlerTests
{
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public UpdateCategoryHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsUpdatedCategoryDto()
    {
        var category = Category.Create("Old", "Old Desc");
        _categoryRepo.GetByIdAsync(category.Id, default).Returns(category);

        var handler = new UpdateCategoryHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new UpdateCategoryCommand(category.Id, "New", "New Desc"), default);

        result.Name.Should().Be("New");
        result.Description.Should().Be("New Desc");
        await _categoryRepo.Received(1).UpdateAsync(Arg.Any<Category>(), default);
    }

    [Fact]
    public async Task Handle_CategoryNotFound_ThrowsKeyNotFoundException()
    {
        _categoryRepo.GetByIdAsync("notfound", default).Returns((Category?)null);

        var handler = new UpdateCategoryHandler(_categoryRepo, _mapper);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(new UpdateCategoryCommand("notfound", "N", "D"), default));
        await _categoryRepo.DidNotReceive().UpdateAsync(Arg.Any<Category>(), default);
    }
}

public class DeleteCategoryHandlerTests
{
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();

    [Fact]
    public async Task Handle_ExistingCategory_DeletesAndReturnsTrue()
    {
        _categoryRepo.ExistsAsync("cat1", default).Returns(true);

        var handler = new DeleteCategoryHandler(_categoryRepo);
        var result = await handler.Handle(new DeleteCategoryCommand("cat1"), default);

        result.Should().BeTrue();
        await _categoryRepo.Received(1).DeleteAsync("cat1", default);
    }

    [Fact]
    public async Task Handle_CategoryNotFound_ThrowsKeyNotFoundException()
    {
        _categoryRepo.ExistsAsync("notfound", default).Returns(false);

        var handler = new DeleteCategoryHandler(_categoryRepo);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(new DeleteCategoryCommand("notfound"), default));
        await _categoryRepo.DidNotReceive().DeleteAsync(Arg.Any<string>(), default);
    }
}

public class GetCategoriesHandlerTests
{
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public GetCategoriesHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ReturnsMappedCategories()
    {
        var categories = new List<Category>
        {
            Category.Create("Camisetas", "Desc1"),
            Category.Create("Jaquetas", "Desc2"),
            Category.Create("Calçados", "Desc3"),
        };
        _categoryRepo.GetAllAsync(default).Returns(categories.AsEnumerable());

        var handler = new GetCategoriesHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new GetCategoriesQuery(), default);

        result.Should().HaveCount(3);
        result.Select(c => c.Name).Should().Contain(new[] { "Camisetas", "Jaquetas", "Calçados" });
    }

    [Fact]
    public async Task Handle_NoCategories_ReturnsEmptyList()
    {
        _categoryRepo.GetAllAsync(default).Returns(Enumerable.Empty<Category>());

        var handler = new GetCategoriesHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new GetCategoriesQuery(), default);

        result.Should().BeEmpty();
    }
}

public class GetCategoryByIdHandlerTests
{
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IMapper _mapper;

    public GetCategoryByIdHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_ExistingCategory_ReturnsDto()
    {
        var category = Category.Create("Calças", "Jeans e tecido");
        _categoryRepo.GetByIdAsync(category.Id, default).Returns(category);

        var handler = new GetCategoryByIdHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new GetCategoryByIdQuery(category.Id), default);

        result.Should().NotBeNull();
        result!.Id.Should().Be(category.Id);
        result.Name.Should().Be("Calças");
    }

    [Fact]
    public async Task Handle_NotFound_ReturnsNull()
    {
        _categoryRepo.GetByIdAsync("nonexistent", default).Returns((Category?)null);

        var handler = new GetCategoryByIdHandler(_categoryRepo, _mapper);
        var result = await handler.Handle(new GetCategoryByIdQuery("nonexistent"), default);

        result.Should().BeNull();
    }
}
