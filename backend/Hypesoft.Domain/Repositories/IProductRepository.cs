using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Product> Items, long Total)> GetPagedAsync(int page, int pageSize, string? search = null, string? categoryId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetLowStockAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetByCategoryAsync(string categoryId, CancellationToken cancellationToken = default);
    Task<long> CountAsync(CancellationToken cancellationToken = default);
    Task<decimal> GetTotalStockValueAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, int>> GetProductCountByCategoryAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, decimal>> GetStockValueByCategoryAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetRecentAsync(int count, CancellationToken cancellationToken = default);
    Task AddAsync(Product product, CancellationToken cancellationToken = default);
    Task UpdateAsync(Product product, CancellationToken cancellationToken = default);
    Task DeleteAsync(string id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default);
}
