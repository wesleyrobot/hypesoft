using Hypesoft.Domain.DomainEvents;

namespace Hypesoft.Domain.Entities;

public class Product
{
    public string Id { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public string Description { get; private set; } = default!;
    public decimal Price { get; private set; }
    public string CategoryId { get; private set; } = default!;
    public string CategoryName { get; private set; } = default!;
    public int StockQuantity { get; private set; }
    public bool IsLowStock => StockQuantity < 10;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private readonly List<DomainEvent> _domainEvents = new();
    public IReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    private Product() { }

    public static Product Create(string name, string description, decimal price, string categoryId, string categoryName, int stockQuantity)
    {
        var product = new Product
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = name,
            Description = description,
            Price = price,
            CategoryId = categoryId,
            CategoryName = categoryName,
            StockQuantity = stockQuantity,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        product._domainEvents.Add(new ProductCreatedEvent(product.Id, product.Name));
        return product;
    }

    public void Update(string name, string description, decimal price, string categoryId, string categoryName)
    {
        Name = name;
        Description = description;
        Price = price;
        CategoryId = categoryId;
        CategoryName = categoryName;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStock(int quantity)
    {
        StockQuantity = quantity;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockUpdatedEvent(Id, quantity));
    }

    public void ClearDomainEvents() => _domainEvents.Clear();
}
