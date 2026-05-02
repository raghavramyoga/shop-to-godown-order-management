using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly InventoryDbContext _db;
    public ProductsController(InventoryDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll() =>
        await _db.Products.AsNoTracking().OrderBy(p => p.Id).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(string id)
    {
        var product = await _db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        return product is null ? NotFound() : product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Id))
        {
            var maxNumber = await _db.Products
                .Select(p => p.Id)
                .Where(id => id.StartsWith("P"))
                .ToListAsync();

            var next = 1;
            foreach (var id in maxNumber)
            {
                if (int.TryParse(id.AsSpan(1), out var n) && n >= next)
                    next = n + 1;
            }
            product.Id = $"P{next:D3}";
        }

        if (string.IsNullOrWhiteSpace(product.Sku))
        {
            var prefix = (product.Category ?? "GEN").Length >= 3
                ? product.Category!.Substring(0, 3).ToUpperInvariant()
                : (product.Category ?? "GEN").ToUpperInvariant();
            var numericPart = product.Id.StartsWith("P", StringComparison.OrdinalIgnoreCase)
                ? product.Id[1..]
                : product.Id;
            product.Sku = $"{prefix}-{numericPart}";
        }

        if (await _db.Products.AnyAsync(p => p.Id == product.Id))
            return Conflict(new { message = $"Product {product.Id} already exists." });

        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Product update)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return NotFound();

        product.Name = update.Name;
        product.Category = update.Category;
        product.UnitPrice = update.UnitPrice;
        product.Unit = update.Unit;
        product.WeightValue = update.WeightValue;
        product.WeightUnit = string.IsNullOrWhiteSpace(update.WeightUnit) ? "g" : update.WeightUnit;
        if (!string.IsNullOrWhiteSpace(update.Sku)) product.Sku = update.Sku;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return NotFound();
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
