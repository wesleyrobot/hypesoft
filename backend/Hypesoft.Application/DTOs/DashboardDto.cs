namespace Hypesoft.Application.DTOs;

public record DashboardDto(
    long TotalProducts,
    decimal TotalStockValue,
    int LowStockCount,
    int CategoryCount,
    IEnumerable<ProductDto> LowStockProducts,
    IEnumerable<CategoryStatsDto> ProductsByCategory,
    IEnumerable<ProductDto> RecentProducts
);

public record CategoryStatsDto(string CategoryName, int ProductCount, decimal StockValue);
