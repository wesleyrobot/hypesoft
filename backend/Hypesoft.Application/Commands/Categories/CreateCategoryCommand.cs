using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Categories;

public record CreateCategoryCommand(string Name, string Description) : IRequest<CategoryDto>;
