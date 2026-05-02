using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public enum OrderStatus
{
    Pending,
    Approved,
    Dispatched,
    Completed,
    Cancelled
}

public class Order
{
    [Key]
    [MaxLength(30)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string ShopId { get; set; } = string.Empty;
    public Shop Shop { get; set; } = null!;

    public int? ShopUserId { get; set; }
    public ShopUser? ShopUser { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public decimal Total { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
