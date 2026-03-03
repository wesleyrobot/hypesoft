using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public record GetProductsQuery(int Page = 1, int PageSize = 10, string? Search = null, string? CategoryId = null)
    : IRequest<PagedResult<ProductDto>>;

public record GetProductByIdQuery(string Id) : IRequest<ProductDto?>;

public record GetLowStockProductsQuery() : IRequest<IEnumerable<ProductDto>>;
