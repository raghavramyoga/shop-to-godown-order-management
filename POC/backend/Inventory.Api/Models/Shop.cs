using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public class Shop
{
    [Key]
    [MaxLength(20)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Contact { get; set; } = string.Empty;

    public bool Active { get; set; } = true;

    public ICollection<StockEntry> StockEntries { get; set; } = new List<StockEntry>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<ShopUser> Users { get; set; } = new List<ShopUser>();
}
