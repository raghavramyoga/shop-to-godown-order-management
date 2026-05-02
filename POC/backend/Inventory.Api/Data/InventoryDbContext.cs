using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Shop> Shops => Set<Shop>();
    public DbSet<StockEntry> StockEntries => Set<StockEntry>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<ShopUser> ShopUsers => Set<ShopUser>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().Property(p => p.UnitPrice).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<Product>().Property(p => p.WeightValue).HasColumnType("decimal(10,3)");
        modelBuilder.Entity<Order>().Property(o => o.Total).HasColumnType("decimal(10,2)");
        modelBuilder.Entity<OrderItem>().Property(i => i.Price).HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        modelBuilder.Entity<StockEntry>()
            .HasIndex(s => new { s.ProductId, s.ShopId })
            .IsUnique();

        modelBuilder.Entity<ShopUser>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<AdminUser>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasOne(o => o.ShopUser)
            .WithMany()
            .HasForeignKey(o => o.ShopUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
