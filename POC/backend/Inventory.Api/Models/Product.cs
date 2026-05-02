using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public class Product
{
    [Key]
    [MaxLength(20)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Sku { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = string.Empty; // displayed as "Type" in UI (pack / bottle / jar)

    public decimal WeightValue { get; set; }

    [MaxLength(5)]
    public string WeightUnit { get; set; } = "g"; // "g" or "kg"

    public ICollection<StockEntry> StockEntries { get; set; } = new List<StockEntry>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
