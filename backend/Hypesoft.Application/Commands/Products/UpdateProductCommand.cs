using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public record UpdateProductCommand(
    string Id, string Name, string Description, decimal Price, string CategoryId, int StockQuantity
) : IRequest<ProductDto>;
