namespace Hypesoft.Application.DTOs;

public record ProductDto(
    string Id,
    string Name,
    string Description,
    decimal Price,
    string CategoryId,
    string CategoryName,
    int StockQuantity,
    bool IsLowStock,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CreateProductRequest(
    string Name,
    string Description,
    decimal Price,
    string CategoryId,
    int StockQuantity
);

public record UpdateProductRequest(
    string Name,
    string Description,
    decimal Price,
    string CategoryId,
    int StockQuantity
);

public record UpdateStockRequest(int Quantity);

public record PagedResult<T>(IEnumerable<T> Items, long Total, int Page, int PageSize);
