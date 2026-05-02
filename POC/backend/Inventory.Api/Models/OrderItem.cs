using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public class OrderItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string OrderId { get; set; } = string.Empty;
    public Order Order { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string ProductId { get; set; } = string.Empty;
    public Product Product { get; set; } = null!;

    public int Qty { get; set; }

    public decimal Price { get; set; }
}
