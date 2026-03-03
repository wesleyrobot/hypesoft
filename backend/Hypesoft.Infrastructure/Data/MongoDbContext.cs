using Hypesoft.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using MongoDB.EntityFrameworkCore.Extensions;

namespace Hypesoft.Infrastructure.Data;

public class MongoDbContext : DbContext
{
    public MongoDbContext(DbContextOptions<MongoDbContext> options) : base(options)
    {
        Database.AutoTransactionBehavior = AutoTransactionBehavior.Never;
    }

    public DbSet<Product> Products { get; init; } = null!;
    public DbSet<Category> Categories { get; init; } = null!;
    public DbSet<SaleTransaction> SaleTransactions { get; init; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToCollection("products");
            entity.HasKey(p => p.Id);
            entity.Ignore(p => p.IsLowStock);
            entity.Ignore(p => p.DomainEvents);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToCollection("categories");
            entity.HasKey(c => c.Id);
        });

        modelBuilder.Entity<SaleTransaction>(entity =>
        {
            entity.ToCollection("sale_transactions");
            entity.HasKey(s => s.Id);
        });
    }
}
