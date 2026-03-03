namespace Hypesoft.Domain.Entities;

public class SaleTransaction
{
    public string Id { get; private set; } = default!;
    public DateTime Date { get; private set; }
    public decimal Amount { get; private set; }
    public string Category { get; private set; } = default!;

    private SaleTransaction() { }

    public static SaleTransaction Create(DateTime date, decimal amount, string category)
    {
        return new SaleTransaction
        {
            Id = Guid.NewGuid().ToString("N"),
            Date = date,
            Amount = amount,
            Category = category
        };
    }
}
