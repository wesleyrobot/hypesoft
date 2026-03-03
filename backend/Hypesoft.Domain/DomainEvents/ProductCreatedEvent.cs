namespace Hypesoft.Domain.DomainEvents;

public class ProductCreatedEvent : DomainEvent
{
    public string ProductId { get; }
    public string ProductName { get; }

    public ProductCreatedEvent(string productId, string productName)
    {
        ProductId = productId;
        ProductName = productName;
    }
}
