using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly InventoryDbContext _db;
    public StockController(InventoryDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll(
        [FromQuery] string? shopId = null,
        [FromQuery] string? productId = null)
    {
        var query = _db.StockEntries
            .Include(s => s.Product)
            .Include(s => s.Shop)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(shopId)) query = query.Where(s => s.ShopId == shopId);
        if (!string.IsNullOrEmpty(productId)) query = query.Where(s => s.ProductId == productId);

        var data = await query
            .OrderBy(s => s.ShopId)
            .ThenBy(s => s.ProductId)
            .Select(s => new
            {
                s.ProductId,
                ProductName = s.Product.Name,
                s.ShopId,
                ShopName = s.Shop.Name,
                s.Quantity,
                s.LastUpdated
            })
            .ToListAsync();

        return data;
    }

    [HttpGet("shop/{shopId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetByShop(string shopId)
    {
        var shopExists = await _db.Shops.AnyAsync(s => s.Id == shopId);
        if (!shopExists) return NotFound(new { message = $"Shop {shopId} not found." });

        var data = await _db.StockEntries
            .Where(s => s.ShopId == shopId)
            .Include(s => s.Product)
            .AsNoTracking()
            .Select(s => new
            {
                s.ProductId,
                ProductName = s.Product.Name,
                Sku = s.Product.Sku,
                Category = s.Product.Category,
                s.Quantity,
                Status = s.Quantity == 0 ? "Out of Stock"
                    : s.Quantity < 30 ? "Low Stock"
                    : "In Stock"
            })
            .ToListAsync();

        return data;
    }

    public class AdjustStockDto
    {
        public string ProductId { get; set; } = string.Empty;
        public string ShopId { get; set; } = string.Empty;
        public int Delta { get; set; }
    }

    [HttpPost("adjust")]
    public async Task<ActionResult<StockEntry>> Adjust(AdjustStockDto dto)
    {
        var entry = await _db.StockEntries
            .FirstOrDefaultAsync(s => s.ProductId == dto.ProductId && s.ShopId == dto.ShopId);

        if (entry is null)
        {
            entry = new StockEntry
            {
                ProductId = dto.ProductId,
                ShopId = dto.ShopId,
                Quantity = Math.Max(0, dto.Delta)
            };
            _db.StockEntries.Add(entry);
        }
        else
        {
            entry.Quantity = Math.Max(0, entry.Quantity + dto.Delta);
            entry.LastUpdated = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return entry;
    }
}
