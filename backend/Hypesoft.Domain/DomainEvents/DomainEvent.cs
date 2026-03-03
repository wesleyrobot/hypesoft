using MediatR;

namespace Hypesoft.Domain.DomainEvents;

public abstract class DomainEvent : INotification
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}
