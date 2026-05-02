using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public class StockEntry
{
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string ProductId { get; set; } = string.Empty;
    public Product Product { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string ShopId { get; set; } = string.Empty;
    public Shop Shop { get; set; } = null!;

    public int Quantity { get; set; }

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
