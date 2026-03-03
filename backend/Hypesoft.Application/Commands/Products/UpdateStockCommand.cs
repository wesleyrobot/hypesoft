using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public record UpdateStockCommand(string ProductId, int Quantity) : IRequest<ProductDto>;
