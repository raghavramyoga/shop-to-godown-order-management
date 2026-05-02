using System.ComponentModel.DataAnnotations;
using Inventory.Api.Models;

namespace Inventory.Api.Dtos;

public class CreateOrderDto
{
    [Required, MaxLength(20)]
    public string ShopId { get; set; } = string.Empty;

    public int? ShopUserId { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    [Required, MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    [Required, MaxLength(20)]
    public string ProductId { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Qty { get; set; }
}

public class UpdateOrderStatusDto
{
    [Required]
    public OrderStatus Status { get; set; }
}

public class OrderResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string ShopId { get; set; } = string.Empty;
    public string ShopName { get; set; } = string.Empty;
    public int? ShopUserId { get; set; }
    public string? ShopUserName { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public decimal Total { get; set; }
    public string? Notes { get; set; }
    public List<OrderItemResponseDto> Items { get; set; } = new();
}

public class OrderItemResponseDto
{
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Qty { get; set; }
    public decimal Price { get; set; }
}
