namespace Hypesoft.Domain.DomainEvents;

public class StockUpdatedEvent : DomainEvent
{
    public string ProductId { get; }
    public int NewQuantity { get; }

    public StockUpdatedEvent(string productId, int newQuantity)
    {
        ProductId = productId;
        NewQuantity = newQuantity;
    }
}
