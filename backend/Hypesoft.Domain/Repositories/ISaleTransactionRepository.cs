using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface ISaleTransactionRepository
{
    Task<IEnumerable<SaleTransaction>> GetByPeriodAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<SaleTransaction> transactions, CancellationToken cancellationToken = default);
}
