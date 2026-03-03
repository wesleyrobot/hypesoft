using FluentAssertions;
using Hypesoft.Application.Handlers.Sales;
using Hypesoft.Application.Queries.Sales;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using NSubstitute;

namespace Hypesoft.Tests.Application;

public class GetSalesDataHandlerTests
{
    private readonly ISaleTransactionRepository _saleRepo = Substitute.For<ISaleTransactionRepository>();

    private static List<SaleTransaction> BuildTransactions(DateTime from, int days, string category = "Camisetas")
    {
        return Enumerable.Range(0, days)
            .Select(i => SaleTransaction.Create(from.AddDays(i), 100m + i, category))
            .ToList();
    }

    [Fact]
    public async Task Handle_DailyPeriod_Returns14Points()
    {
        var now = DateTime.UtcNow.Date;
        var from = now.AddDays(-13);
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("daily", null), default);

        result.Points.Should().HaveCount(14);
    }

    [Fact]
    public async Task Handle_WeeklyPeriod_Returns7Points()
    {
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("weekly", null), default);

        result.Points.Should().HaveCount(7);
    }

    [Fact]
    public async Task Handle_MonthlyPeriod_Returns12Points()
    {
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("monthly", null), default);

        result.Points.Should().HaveCount(12);
    }

    [Fact]
    public async Task Handle_DefaultPeriod_TreatedAsWeekly()
    {
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("unknown", null), default);

        result.Points.Should().HaveCount(7);
    }

    [Fact]
    public async Task Handle_DailyPeriod_LabelsAreFormattedAsddMM()
    {
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("daily", null), default);

        result.Points.All(p => System.Text.RegularExpressions.Regex.IsMatch(p.Label, @"\d{2}/\d{2}"))
            .Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WeeklyPeriod_LabelsAreFormattedAsW1_W7()
    {
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("weekly", null), default);

        result.Points.Select(p => p.Label).Should()
            .Contain(new[] { "W1", "W2", "W3", "W4", "W5", "W6", "W7" });
    }

    [Fact]
    public async Task Handle_CategoryFilter_ExcludesOtherCategories()
    {
        var now = DateTime.UtcNow.Date;
        var transactions = new[]
        {
            SaleTransaction.Create(now, 200m, "Camisetas"),
            SaleTransaction.Create(now, 300m, "Calças"),
            SaleTransaction.Create(now, 150m, "camisetas"), // case insensitive
        };
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(transactions.AsEnumerable());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("weekly", "Camisetas"), default);

        // Only Camisetas transactions should be summed, not Calças
        var totalValue = result.Points.Sum(p => p.Value);
        totalValue.Should().Be(350m); // 200 + 150 (case-insensitive match)
    }

    [Fact]
    public async Task Handle_NoTransactions_AllPointsHaveZeroValue()
    {
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(Enumerable.Empty<SaleTransaction>());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("daily", null), default);

        result.Points.All(p => p.Value == 0m).Should().BeTrue();
    }

    [Fact]
    public async Task Handle_WithTransactions_AggregatesByDay()
    {
        var now = DateTime.UtcNow.Date;
        var transactions = new[]
        {
            SaleTransaction.Create(now, 100m, "Cat"),
            SaleTransaction.Create(now, 200m, "Cat"),
            SaleTransaction.Create(now.AddDays(-1), 50m, "Cat"),
        };
        _saleRepo.GetByPeriodAsync(Arg.Any<DateTime>(), Arg.Any<DateTime>(), default)
            .Returns(transactions.AsEnumerable());

        var handler = new GetSalesDataHandler(_saleRepo);
        var result = await handler.Handle(new GetSalesDataQuery("daily", null), default);

        var todayLabel = now.ToString("dd/MM");
        var todayPoint = result.Points.FirstOrDefault(p => p.Label == todayLabel);
        todayPoint.Should().NotBeNull();
        todayPoint!.Value.Should().Be(300m);
    }
}
