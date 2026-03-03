using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Sales;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Sales;

public class GetSalesDataHandler : IRequestHandler<GetSalesDataQuery, SalesDataDto>
{
    private readonly ISaleTransactionRepository _saleRepository;

    public GetSalesDataHandler(ISaleTransactionRepository saleRepository)
    {
        _saleRepository = saleRepository;
    }

    public async Task<SalesDataDto> Handle(GetSalesDataQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow.Date;
        DateTime from;

        switch (request.Period?.ToLower())
        {
            case "daily":
                from = now.AddDays(-13);
                break;
            case "monthly":
                from = now.AddMonths(-11).AddDays(1 - now.Day);
                break;
            default: // weekly
                from = now.AddDays(-6 * 7);
                break;
        }

        var transactions = (await _saleRepository.GetByPeriodAsync(from, now.AddDays(1), cancellationToken)).ToList();

        if (!string.IsNullOrWhiteSpace(request.Category))
            transactions = transactions.Where(t => t.Category.Equals(request.Category, StringComparison.OrdinalIgnoreCase)).ToList();

        IEnumerable<SalesDataPointDto> points;

        switch (request.Period?.ToLower())
        {
            case "daily":
                points = Enumerable.Range(0, 14)
                    .Select(i =>
                    {
                        var day = from.AddDays(i);
                        var value = transactions.Where(t => t.Date.Date == day).Sum(t => t.Amount);
                        return new SalesDataPointDto(day.ToString("dd/MM"), value);
                    });
                break;

            case "monthly":
                points = Enumerable.Range(0, 12)
                    .Select(i =>
                    {
                        var month = from.AddMonths(i);
                        var value = transactions
                            .Where(t => t.Date.Year == month.Year && t.Date.Month == month.Month)
                            .Sum(t => t.Amount);
                        return new SalesDataPointDto(month.ToString("MMM"), value);
                    });
                break;

            default: // weekly
                points = Enumerable.Range(0, 7)
                    .Select(i =>
                    {
                        var weekStart = from.AddDays(i * 7);
                        var weekEnd = weekStart.AddDays(6);
                        var value = transactions.Where(t => t.Date.Date >= weekStart && t.Date.Date <= weekEnd).Sum(t => t.Amount);
                        return new SalesDataPointDto($"W{i + 1}", value);
                    });
                break;
        }

        return new SalesDataDto(points.ToList());
    }
}
