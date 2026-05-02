using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(InventoryDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (await db.Products.AnyAsync()) return;

        var products = new[]
        {
            new Product { Id = "P001", Name = "Lays Classic Salted",   Sku = "SNK-LAY-CL",  Category = "Snacks",     UnitPrice = 20,  Unit = "pack",   WeightValue = 30,  WeightUnit = "g" },
            new Product { Id = "P002", Name = "Lays Magic Masala",     Sku = "SNK-LAY-MM",  Category = "Snacks",     UnitPrice = 20,  Unit = "pack",   WeightValue = 30,  WeightUnit = "g" },
            new Product { Id = "P003", Name = "Kurkure Masala Munch",  Sku = "SNK-KUR-MM",  Category = "Snacks",     UnitPrice = 20,  Unit = "pack",   WeightValue = 90,  WeightUnit = "g" },
            new Product { Id = "P004", Name = "Coca Cola 600ml",       Sku = "BEV-COC-600", Category = "Beverages",  UnitPrice = 40,  Unit = "bottle", WeightValue = 600, WeightUnit = "g" },
            new Product { Id = "P005", Name = "Pepsi 600ml",           Sku = "BEV-PEP-600", Category = "Beverages",  UnitPrice = 40,  Unit = "bottle", WeightValue = 600, WeightUnit = "g" },
            new Product { Id = "P006", Name = "Maggi Noodles 70g",     Sku = "FOO-MAG-70",  Category = "Food",       UnitPrice = 14,  Unit = "pack",   WeightValue = 70,  WeightUnit = "g" },
            new Product { Id = "P007", Name = "Britannia Good Day",    Sku = "BIS-BRI-GD",  Category = "Biscuits",   UnitPrice = 30,  Unit = "pack",   WeightValue = 100, WeightUnit = "g" },
            new Product { Id = "P008", Name = "Parle-G Original",      Sku = "BIS-PAR-G",   Category = "Biscuits",   UnitPrice = 10,  Unit = "pack",   WeightValue = 50,  WeightUnit = "g" },
            new Product { Id = "P009", Name = "Amul Butter 100g",      Sku = "DAI-AMU-100", Category = "Dairy",      UnitPrice = 58,  Unit = "pack",   WeightValue = 100, WeightUnit = "g" },
            new Product { Id = "P010", Name = "Nescafe Classic 50g",   Sku = "BEV-NES-50",  Category = "Beverages",  UnitPrice = 175, Unit = "jar",       WeightValue = 50,  WeightUnit = "g" },
            new Product { Id = "P011", Name = "Haldiram Bhujia",        Sku = "SNK-HAL-BH",  Category = "Snacks",     UnitPrice = 80,  Unit = "pack",      WeightValue = 200, WeightUnit = "g" },
            new Product { Id = "P012", Name = "Bingo Mad Angles",       Sku = "SNK-BIN-MA",  Category = "Snacks",     UnitPrice = 20,  Unit = "pack",      WeightValue = 50,  WeightUnit = "g" },
            new Product { Id = "P013", Name = "Sprite 600ml",           Sku = "BEV-SPR-600", Category = "Beverages",  UnitPrice = 40,  Unit = "bottle",    WeightValue = 600, WeightUnit = "g" },
            new Product { Id = "P014", Name = "Frooti Mango 250ml",     Sku = "BEV-FRO-250", Category = "Beverages",  UnitPrice = 20,  Unit = "tetrapack", WeightValue = 250, WeightUnit = "g" },
            new Product { Id = "P015", Name = "Yippee Magic Masala",    Sku = "FOO-YIP-MM",  Category = "Food",       UnitPrice = 15,  Unit = "pack",      WeightValue = 60,  WeightUnit = "g" },
            new Product { Id = "P016", Name = "Top Ramen Curry",        Sku = "FOO-TOP-CU",  Category = "Food",       UnitPrice = 16,  Unit = "pack",      WeightValue = 80,  WeightUnit = "g" },
            new Product { Id = "P017", Name = "Marie Gold Biscuits",    Sku = "BIS-MAR-GD",  Category = "Biscuits",   UnitPrice = 25,  Unit = "pack",      WeightValue = 75,  WeightUnit = "g" },
            new Product { Id = "P018", Name = "Bourbon Cream Biscuits", Sku = "BIS-BOU-CR",  Category = "Biscuits",   UnitPrice = 30,  Unit = "pack",      WeightValue = 100, WeightUnit = "g" },
            new Product { Id = "P019", Name = "Mother Dairy Curd",      Sku = "DAI-MOT-CD",  Category = "Dairy",      UnitPrice = 30,  Unit = "cup",       WeightValue = 200, WeightUnit = "g" },
            new Product { Id = "P020", Name = "Amul Cheese Slices",     Sku = "DAI-AMU-CH",  Category = "Dairy",      UnitPrice = 145, Unit = "pack",      WeightValue = 100, WeightUnit = "g" },
        };

        var shops = new[]
        {
            new Shop { Id = "SHP001", Name = "Anna Nagar Store",  Address = "23, 2nd Ave, Anna Nagar, Chennai",        Contact = "+91 98400 11122", Active = true },
            new Shop { Id = "SHP002", Name = "T. Nagar Outlet",   Address = "45, Ranganathan St, T. Nagar, Chennai",   Contact = "+91 98400 22233", Active = true },
            new Shop { Id = "SHP003", Name = "Velachery Branch",  Address = "12, Phoenix Mall Rd, Velachery, Chennai", Contact = "+91 98400 33344", Active = true },
            new Shop { Id = "SHP004", Name = "Adyar Mart",        Address = "8, LB Rd, Adyar, Chennai",                Contact = "+91 98400 44455", Active = true },
            new Shop { Id = "SHP005", Name = "OMR Express",       Address = "101, Rajiv Gandhi Salai, OMR, Chennai",   Contact = "+91 98400 55566", Active = true },
        };

        var admins = new[]
        {
            new AdminUser { Username = "admin", Password = "admin123", FullName = "Ramji" },
        };

        var shopUsers = new[]
        {
            new ShopUser { Username = "anna",      Password = "shop123", FullName = "Ravi Kumar",     ShopId = "SHP001" },
            new ShopUser { Username = "tnagar",    Password = "shop123", FullName = "Priya Sharma",   ShopId = "SHP002" },
            new ShopUser { Username = "velachery", Password = "shop123", FullName = "Mohammed Ali",   ShopId = "SHP003" },
            new ShopUser { Username = "adyar",     Password = "shop123", FullName = "Lakshmi Iyer",   ShopId = "SHP004" },
            new ShopUser { Username = "omr",       Password = "shop123", FullName = "Suresh Babu",    ShopId = "SHP005" },
        };

        var stock = new[]
        {
            new StockEntry { ProductId = "P001", ShopId = "SHP001", Quantity = 120 },
            new StockEntry { ProductId = "P001", ShopId = "SHP002", Quantity = 85 },
            new StockEntry { ProductId = "P001", ShopId = "SHP003", Quantity = 60 },
            new StockEntry { ProductId = "P002", ShopId = "SHP001", Quantity = 90 },
            new StockEntry { ProductId = "P002", ShopId = "SHP002", Quantity = 45 },
            new StockEntry { ProductId = "P003", ShopId = "SHP001", Quantity = 200 },
            new StockEntry { ProductId = "P003", ShopId = "SHP004", Quantity = 110 },
            new StockEntry { ProductId = "P004", ShopId = "SHP001", Quantity = 48 },
            new StockEntry { ProductId = "P004", ShopId = "SHP002", Quantity = 36 },
            new StockEntry { ProductId = "P004", ShopId = "SHP003", Quantity = 72 },
            new StockEntry { ProductId = "P005", ShopId = "SHP002", Quantity = 24 },
            new StockEntry { ProductId = "P006", ShopId = "SHP001", Quantity = 300 },
            new StockEntry { ProductId = "P006", ShopId = "SHP004", Quantity = 180 },
            new StockEntry { ProductId = "P007", ShopId = "SHP003", Quantity = 95 },
            new StockEntry { ProductId = "P008", ShopId = "SHP001", Quantity = 500 },
            new StockEntry { ProductId = "P008", ShopId = "SHP002", Quantity = 320 },
            new StockEntry { ProductId = "P008", ShopId = "SHP003", Quantity = 215 },
            new StockEntry { ProductId = "P009", ShopId = "SHP001", Quantity = 28 },
            new StockEntry { ProductId = "P010", ShopId = "SHP001", Quantity = 15 },
            new StockEntry { ProductId = "P010", ShopId = "SHP002", Quantity = 8 },
        };

        await db.Products.AddRangeAsync(products);
        await db.Shops.AddRangeAsync(shops);
        await db.AdminUsers.AddRangeAsync(admins);
        await db.SaveChangesAsync();

        await db.ShopUsers.AddRangeAsync(shopUsers);
        await db.StockEntries.AddRangeAsync(stock);
        await db.SaveChangesAsync();

        // Sample stock requests (orders) — already-existing requests for demo
        var savedShopUsers = await db.ShopUsers.AsNoTracking().ToListAsync();
        var orders = new[]
        {
            new Order
            {
                Id = "REQ-2026-0042", ShopId = "SHP001",
                ShopUserId = savedShopUsers.FirstOrDefault(u => u.ShopId == "SHP001")?.Id,
                Status = OrderStatus.Pending, CreatedAt = DateTime.Parse("2026-05-01T09:30:00Z"),
                Total = 368,
                Items = new List<OrderItem>
                {
                    new() { ProductId = "P001", Qty = 10, Price = 20 },
                    new() { ProductId = "P006", Qty = 12, Price = 14 },
                }
            },
            new Order
            {
                Id = "REQ-2026-0041", ShopId = "SHP002",
                ShopUserId = savedShopUsers.FirstOrDefault(u => u.ShopId == "SHP002")?.Id,
                Status = OrderStatus.Approved, CreatedAt = DateTime.Parse("2026-05-01T08:15:00Z"),
                Total = 440,
                Items = new List<OrderItem>
                {
                    new() { ProductId = "P004", Qty = 6, Price = 40 },
                    new() { ProductId = "P008", Qty = 20, Price = 10 },
                }
            },
            new Order
            {
                Id = "REQ-2026-0040", ShopId = "SHP003",
                ShopUserId = savedShopUsers.FirstOrDefault(u => u.ShopId == "SHP003")?.Id,
                Status = OrderStatus.Dispatched, CreatedAt = DateTime.Parse("2026-04-30T17:45:00Z"),
                Total = 400,
                Items = new List<OrderItem>
                {
                    new() { ProductId = "P007", Qty = 8, Price = 30 },
                    new() { ProductId = "P004", Qty = 4, Price = 40 },
                }
            },
            new Order
            {
                Id = "REQ-2026-0039", ShopId = "SHP001",
                ShopUserId = savedShopUsers.FirstOrDefault(u => u.ShopId == "SHP001")?.Id,
                Status = OrderStatus.Completed, CreatedAt = DateTime.Parse("2026-04-30T14:20:00Z"),
                Total = 716,
                Items = new List<OrderItem>
                {
                    new() { ProductId = "P003", Qty = 15, Price = 20 },
                    new() { ProductId = "P008", Qty = 30, Price = 10 },
                    new() { ProductId = "P009", Qty = 2,  Price = 58 },
                }
            },
            new Order
            {
                Id = "REQ-2026-0038", ShopId = "SHP004",
                ShopUserId = savedShopUsers.FirstOrDefault(u => u.ShopId == "SHP004")?.Id,
                Status = OrderStatus.Completed, CreatedAt = DateTime.Parse("2026-04-30T11:00:00Z"),
                Total = 200,
                Items = new List<OrderItem>
                {
                    new() { ProductId = "P003", Qty = 10, Price = 20 },
                }
            },
        };

        await db.Orders.AddRangeAsync(orders);
        await db.SaveChangesAsync();
    }
}
