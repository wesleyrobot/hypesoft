namespace Hypesoft.Domain.Entities;

public class Category
{
    public string Id { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public string Description { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    private Category() { }

    public static Category Create(string name, string description)
    {
        return new Category
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string name, string description)
    {
        Name = name;
        Description = description;
    }
}
