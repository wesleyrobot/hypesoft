using FluentAssertions;
using FluentValidation;
using Hypesoft.Application.Behaviors;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Validators;
using MediatR;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class ProductValidatorTests
{
    [Fact]
    public async Task CreateProductValidator_ValidCommand_PassesValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("Bomber Jacket", "Jaqueta premium", 299.90m, "cat1", 10);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task CreateProductValidator_EmptyName_FailsValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("", "Desc", 100m, "cat1", 5);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public async Task CreateProductValidator_NegativePrice_FailsValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("P", "Desc", -10m, "cat1", 5);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Price");
    }

    [Fact]
    public async Task CreateProductValidator_ZeroPrice_FailsValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("P", "Desc", 0m, "cat1", 5);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Price");
    }

    [Fact]
    public async Task CreateProductValidator_EmptyCategoryId_FailsValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("P", "Desc", 100m, "", 5);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "CategoryId");
    }

    [Fact]
    public async Task CreateProductValidator_NegativeStock_FailsValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("P", "Desc", 100m, "cat1", -1);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "StockQuantity");
    }

    [Fact]
    public async Task CreateProductValidator_ZeroStock_PassesValidation()
    {
        var validator = new CreateProductValidator();
        var command = new CreateProductCommand("P", "Desc", 100m, "cat1", 0);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task CreateProductValidator_NameTooLong_FailsValidation()
    {
        var validator = new CreateProductValidator();
        var longName = new string('A', 201);
        var command = new CreateProductCommand(longName, "Desc", 100m, "cat1", 5);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public async Task UpdateProductValidator_ValidCommand_PassesValidation()
    {
        var validator = new UpdateProductValidator();
        var command = new UpdateProductCommand("id1", "Tênis Runner", "Confortável", 349m, "cat2", 20);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateProductValidator_MultipleInvalidFields_ReportsAllErrors()
    {
        var validator = new UpdateProductValidator();
        var command = new UpdateProductCommand("id1", "", "", -1m, "", -5);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Select(e => e.PropertyName).Should()
            .Contain(new[] { "Name", "Description", "Price", "CategoryId", "StockQuantity" });
    }

    [Fact]
    public async Task UpdateStockValidator_NegativeQuantity_FailsValidation()
    {
        var validator = new UpdateStockValidator();
        var command = new UpdateStockCommand("prod1", -1);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Quantity");
    }

    [Fact]
    public async Task UpdateStockValidator_ZeroQuantity_PassesValidation()
    {
        var validator = new UpdateStockValidator();
        var command = new UpdateStockCommand("prod1", 0);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }
}

public class CategoryValidatorTests
{
    [Fact]
    public async Task CreateCategoryValidator_ValidCommand_PassesValidation()
    {
        var validator = new CreateCategoryValidator();
        var command = new CreateCategoryCommand("Camisetas", "Roupas de verão");

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task CreateCategoryValidator_EmptyName_FailsValidation()
    {
        var validator = new CreateCategoryValidator();
        var command = new CreateCategoryCommand("", "Desc");

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public async Task CreateCategoryValidator_NameTooLong_FailsValidation()
    {
        var validator = new CreateCategoryValidator();
        var longName = new string('X', 101);
        var command = new CreateCategoryCommand(longName, "Desc");

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public async Task CreateCategoryValidator_DescriptionTooLong_FailsValidation()
    {
        var validator = new CreateCategoryValidator();
        var longDesc = new string('D', 501);
        var command = new CreateCategoryCommand("Cat", longDesc);

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description");
    }

    [Fact]
    public async Task CreateCategoryValidator_EmptyDescription_PassesValidation()
    {
        var validator = new CreateCategoryValidator();
        var command = new CreateCategoryCommand("Calças", "");

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateCategoryValidator_ValidCommand_PassesValidation()
    {
        var validator = new UpdateCategoryValidator();
        var command = new UpdateCategoryCommand("id1", "Jaquetas", "Jaquetas e casacos");

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateCategoryValidator_EmptyName_FailsValidation()
    {
        var validator = new UpdateCategoryValidator();
        var command = new UpdateCategoryCommand("id1", "", "Desc");

        var result = await validator.ValidateAsync(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }
}

public class ValidationBehaviorTests
{
    private static readonly ProductDto FakeDto = new("id", "P", "D", 1m, "c", "C", 0, false, DateTime.UtcNow, DateTime.UtcNow);

    [Fact]
    public async Task Handle_WithNoValidators_CallsNext()
    {
        var behavior = new ValidationBehavior<CreateProductCommand, ProductDto>(
            Enumerable.Empty<IValidator<CreateProductCommand>>());
        var command = new CreateProductCommand("P", "D", 100m, "cat1", 5);
        var nextCalled = false;
        RequestHandlerDelegate<ProductDto> next = () => { nextCalled = true; return Task.FromResult(FakeDto); };

        await behavior.Handle(command, next, default);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithValidValidator_CallsNext()
    {
        var validator = new CreateProductValidator();
        var behavior = new ValidationBehavior<CreateProductCommand, ProductDto>(
            new[] { validator });
        var command = new CreateProductCommand("Valid Name", "Valid Desc", 100m, "cat1", 5);
        var nextCalled = false;
        RequestHandlerDelegate<ProductDto> next = () => { nextCalled = true; return Task.FromResult(FakeDto); };

        await behavior.Handle(command, next, default);

        nextCalled.Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithInvalidCommand_ThrowsValidationException()
    {
        var validator = new CreateProductValidator();
        var behavior = new ValidationBehavior<CreateProductCommand, ProductDto>(
            new[] { validator });
        var invalidCommand = new CreateProductCommand("", "", -1m, "", -5);
        RequestHandlerDelegate<ProductDto> next = () => Task.FromResult(FakeDto);

        await Assert.ThrowsAsync<ValidationException>(() =>
            behavior.Handle(invalidCommand, next, default));
    }

    [Fact]
    public async Task Handle_ValidationFails_DoesNotCallNext()
    {
        var validator = new CreateProductValidator();
        var behavior = new ValidationBehavior<CreateProductCommand, ProductDto>(
            new[] { validator });
        var invalidCommand = new CreateProductCommand("", "D", 100m, "cat1", 5);
        var nextCalled = false;
        RequestHandlerDelegate<ProductDto> next = () => { nextCalled = true; return Task.FromResult(FakeDto); };

        await Assert.ThrowsAsync<ValidationException>(() =>
            behavior.Handle(invalidCommand, next, default));

        nextCalled.Should().BeFalse();
    }
}
