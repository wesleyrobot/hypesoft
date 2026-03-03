using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hypesoft.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly MongoDbContext _context;

    public ProductRepository(MongoDbContext context) => _context = context;

    public async Task<Product?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
        => await _context.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<(IEnumerable<Product> Items, long Total)> GetPagedAsync(
        int page, int pageSize, string? search = null, string? categoryId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));

        if (!string.IsNullOrWhiteSpace(categoryId))
            query = query.Where(p => p.CategoryId == categoryId);

        var total = await query.LongCountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<IEnumerable<Product>> GetLowStockAsync(CancellationToken cancellationToken = default)
        => await _context.Products.Where(p => p.StockQuantity < 10).ToListAsync(cancellationToken);

    public async Task<IEnumerable<Product>> GetByCategoryAsync(string categoryId, CancellationToken cancellationToken = default)
        => await _context.Products.Where(p => p.CategoryId == categoryId).ToListAsync(cancellationToken);

    public async Task<long> CountAsync(CancellationToken cancellationToken = default)
        => await _context.Products.LongCountAsync(cancellationToken);

    public async Task<decimal> GetTotalStockValueAsync(CancellationToken cancellationToken = default)
    {
        var products = await _context.Products.ToListAsync(cancellationToken);
        return products.Sum(p => p.Price * p.StockQuantity);
    }

    public async Task<Dictionary<string, int>> GetProductCountByCategoryAsync(CancellationToken cancellationToken = default)
    {
        var products = await _context.Products.ToListAsync(cancellationToken);
        return products.GroupBy(p => p.CategoryName).ToDictionary(g => g.Key, g => g.Count());
    }

    public async Task<Dictionary<string, decimal>> GetStockValueByCategoryAsync(CancellationToken cancellationToken = default)
    {
        var products = await _context.Products.ToListAsync(cancellationToken);
        return products.GroupBy(p => p.CategoryName)
            .ToDictionary(g => g.Key, g => g.Sum(p => p.Price * p.StockQuantity));
    }

    public async Task<IEnumerable<Product>> GetRecentAsync(int count, CancellationToken cancellationToken = default)
        => await _context.Products
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Product product, CancellationToken cancellationToken = default)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var product = await GetByIdAsync(id, cancellationToken);
        if (product is not null)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default)
        => await _context.Products.AnyAsync(p => p.Id == id, cancellationToken);
}
