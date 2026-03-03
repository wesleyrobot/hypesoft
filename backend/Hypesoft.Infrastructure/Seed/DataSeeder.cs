using Hypesoft.Domain.Entities;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hypesoft.Infrastructure.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(MongoDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            var categories = new[]
            {
                Category.Create("Camisetas", "Camisetas e regatas"),
                Category.Create("Calças", "Calças, jeans e bermudas"),
                Category.Create("Jaquetas", "Jaquetas e casacos"),
                Category.Create("Acessórios", "Acessórios em geral"),
                Category.Create("Calçados", "Tênis, botas e sandálias"),
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            var catMap = categories.ToDictionary(c => c.Name, c => c.Id);
            var products = new[]
            {
                // Jaquetas
                Product.Create("Bomber Jacket",    "Jaqueta bomber clássica premium",  299.90m, catMap["Jaquetas"],   "Jaquetas",   15),
                Product.Create("Denim Jacket",     "Jaqueta jeans vintage",            349.90m, catMap["Jaquetas"],   "Jaquetas",    9),
                Product.Create("Windbreaker",      "Corta-vento leve impermeável",     229.90m, catMap["Jaquetas"],   "Jaquetas",   20),
                Product.Create("Puffer Jacket",    "Jaqueta acolchoada inverno",       399.90m, catMap["Jaquetas"],   "Jaquetas",    6),
                // Camisetas
                Product.Create("Linen Shirt",      "Camisa de linho premium",          189.90m, catMap["Camisetas"],  "Camisetas",   8),
                Product.Create("Black Shirt",      "Camiseta preta básica",             89.90m, catMap["Camisetas"],  "Camisetas",   5),
                Product.Create("Polo Shirt",       "Polo slim fit",                    159.90m, catMap["Camisetas"],  "Camisetas",  18),
                Product.Create("Graphic Tee",      "Camiseta estampada streetwear",     99.90m, catMap["Camisetas"],  "Camisetas",  25),
                Product.Create("Henley Shirt",     "Camisa henley manga longa",        139.90m, catMap["Camisetas"],  "Camisetas",  11),
                // Calças
                Product.Create("Ankle Pants",      "Calça cropped moderna",            249.90m, catMap["Calças"],     "Calças",     22),
                Product.Create("Cargo Pants",      "Calça cargo utilitária",           279.90m, catMap["Calças"],     "Calças",     12),
                Product.Create("Slim Jeans",       "Jeans slim fit lavagem clara",     219.90m, catMap["Calças"],     "Calças",     17),
                Product.Create("Jogger Pants",     "Calça jogger confortável",         179.90m, catMap["Calças"],     "Calças",      7),
                // Acessórios
                Product.Create("Snapback Cap",     "Boné snapback ajustável",           79.90m, catMap["Acessórios"], "Acessórios", 30),
                Product.Create("Leather Belt",     "Cinto de couro legítimo",          129.90m, catMap["Acessórios"], "Acessórios",  7),
                Product.Create("Sunglasses",       "Óculos de sol polarizado",         199.90m, catMap["Acessórios"], "Acessórios", 14),
                Product.Create("Wool Scarf",       "Cachecol de lã macio",              89.90m, catMap["Acessórios"], "Acessórios",  4),
                // Calçados
                Product.Create("Canvas Sneaker",   "Tênis canvas casual",              199.90m, catMap["Calçados"],   "Calçados",    3),
                Product.Create("Running Shoe",     "Tênis de corrida leve",            349.90m, catMap["Calçados"],   "Calçados",   10),
                Product.Create("Chelsea Boot",     "Bota chelsea couro genuíno",       429.90m, catMap["Calçados"],   "Calçados",    8),
                Product.Create("Slip-On",          "Sapatilha slip-on sem cadarço",    149.90m, catMap["Calçados"],   "Calçados",   16),
            };
            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }

        if (!await context.SaleTransactions.AnyAsync())
        {
            await SeedSaleTransactionsAsync(context);
        }
    }

    private static async Task SeedSaleTransactionsAsync(MongoDbContext context)
    {
        var rng = new Random(42);
        var categories = new[] { "Camisetas", "Calças", "Jaquetas", "Acessórios", "Calçados" };
        var now = DateTime.UtcNow.Date;
        var transactions = new List<SaleTransaction>();

        // Generate 365 days of daily sales data
        for (int daysAgo = 364; daysAgo >= 0; daysAgo--)
        {
            var date = now.AddDays(-daysAgo);
            // 3–8 transactions per day
            int count = rng.Next(3, 9);
            for (int i = 0; i < count; i++)
            {
                var category = categories[rng.Next(categories.Length)];
                decimal amount = category switch
                {
                    "Jaquetas"  => Math.Round((decimal)(rng.NextDouble() * 300 + 180), 2),
                    "Calçados"  => Math.Round((decimal)(rng.NextDouble() * 280 + 150), 2),
                    "Calças"    => Math.Round((decimal)(rng.NextDouble() * 200 + 100), 2),
                    "Camisetas" => Math.Round((decimal)(rng.NextDouble() * 150 + 60),  2),
                    _           => Math.Round((decimal)(rng.NextDouble() * 120 + 50),  2),
                };
                transactions.Add(SaleTransaction.Create(date, amount, category));
            }
        }

        context.SaleTransactions.AddRange(transactions);
        await context.SaveChangesAsync();
    }
}
