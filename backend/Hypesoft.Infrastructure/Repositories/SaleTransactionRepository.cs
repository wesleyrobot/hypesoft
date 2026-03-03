using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hypesoft.Infrastructure.Repositories;

public class SaleTransactionRepository : ISaleTransactionRepository
{
    private readonly MongoDbContext _context;

    public SaleTransactionRepository(MongoDbContext context) => _context = context;

    public async Task<IEnumerable<SaleTransaction>> GetByPeriodAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default)
        => await _context.SaleTransactions
            .Where(s => s.Date >= from && s.Date <= to)
            .ToListAsync(cancellationToken);

    public async Task<bool> AnyAsync(CancellationToken cancellationToken = default)
        => await _context.SaleTransactions.AnyAsync(cancellationToken);

    public async Task AddRangeAsync(IEnumerable<SaleTransaction> transactions, CancellationToken cancellationToken = default)
    {
        _context.SaleTransactions.AddRange(transactions);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
