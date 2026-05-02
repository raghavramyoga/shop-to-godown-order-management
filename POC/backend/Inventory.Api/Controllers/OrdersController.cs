using Inventory.Api.Data;
using Inventory.Api.Dtos;
using Inventory.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly InventoryDbContext _db;
    public OrdersController(InventoryDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAll(
        [FromQuery] string? shopId = null,
        [FromQuery] OrderStatus? status = null,
        [FromQuery] int? shopUserId = null)
    {
        var query = _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Shop)
            .Include(o => o.ShopUser)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(shopId))    query = query.Where(o => o.ShopId == shopId);
        if (status.HasValue)                  query = query.Where(o => o.Status == status.Value);
        if (shopUserId.HasValue)              query = query.Where(o => o.ShopUserId == shopUserId.Value);

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return orders.Select(MapToDto).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetById(string id)
    {
        var order = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Shop)
            .Include(o => o.ShopUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);

        return order is null ? NotFound() : MapToDto(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> Create(CreateOrderDto dto)
    {
        var shop = await _db.Shops.FirstOrDefaultAsync(s => s.Id == dto.ShopId);
        if (shop is null)
            return BadRequest(new { message = $"Shop {dto.ShopId} not found." });

        if (dto.ShopUserId.HasValue)
        {
            var userValid = await _db.ShopUsers.AnyAsync(u => u.Id == dto.ShopUserId.Value && u.ShopId == dto.ShopId);
            if (!userValid) return BadRequest(new { message = "Shop user does not belong to this shop." });
        }

        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _db.Products.Where(p => productIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id);

        if (products.Count != productIds.Count)
        {
            var missing = productIds.Except(products.Keys);
            return BadRequest(new { message = $"Unknown product(s): {string.Join(", ", missing)}" });
        }

        var nextNumber = await _db.Orders.CountAsync() + 50;
        var orderId = $"REQ-{DateTime.UtcNow.Year}-{nextNumber:D4}";

        var order = new Order
        {
            Id = orderId,
            ShopId = dto.ShopId,
            ShopUserId = dto.ShopUserId,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            Notes = dto.Notes,
            Items = dto.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Qty = i.Qty,
                Price = products[i.ProductId].UnitPrice
            }).ToList()
        };

        order.Total = order.Items.Sum(i => i.Price * i.Qty);

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        var saved = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Shop)
            .Include(o => o.ShopUser)
            .AsNoTracking()
            .FirstAsync(o => o.Id == orderId);

        return CreatedAtAction(nameof(GetById), new { id = orderId }, MapToDto(saved));
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, UpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();

        order.Status = dto.Status;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(string id)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order is null) return NotFound();
        order.Status = OrderStatus.Cancelled;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static OrderResponseDto MapToDto(Order o) => new()
    {
        Id = o.Id,
        ShopId = o.ShopId,
        ShopName = o.Shop?.Name ?? string.Empty,
        ShopUserId = o.ShopUserId,
        ShopUserName = o.ShopUser?.FullName,
        Status = o.Status.ToString(),
        CreatedAt = o.CreatedAt,
        Total = o.Total,
        Notes = o.Notes,
        Items = o.Items.Select(i => new OrderItemResponseDto
        {
            ProductId = i.ProductId,
            ProductName = i.Product?.Name ?? string.Empty,
            Qty = i.Qty,
            Price = i.Price
        }).ToList()
    };
}
