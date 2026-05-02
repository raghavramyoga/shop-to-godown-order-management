using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShopsController : ControllerBase
{
    private readonly InventoryDbContext _db;
    public ShopsController(InventoryDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Shop>>> GetAll([FromQuery] bool? activeOnly = null)
    {
        var query = _db.Shops.AsNoTracking().AsQueryable();
        if (activeOnly == true) query = query.Where(s => s.Active);
        return await query.OrderBy(s => s.Id).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Shop>> GetById(string id)
    {
        var shop = await _db.Shops.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
        return shop is null ? NotFound() : shop;
    }

    [HttpPost]
    public async Task<ActionResult<Shop>> Create(Shop shop)
    {
        if (await _db.Shops.AnyAsync(s => s.Id == shop.Id))
            return Conflict(new { message = $"Shop {shop.Id} already exists." });

        _db.Shops.Add(shop);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = shop.Id }, shop);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Shop update)
    {
        var shop = await _db.Shops.FirstOrDefaultAsync(s => s.Id == id);
        if (shop is null) return NotFound();

        shop.Name = update.Name;
        shop.Address = update.Address;
        shop.Contact = update.Contact;
        shop.Active = update.Active;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var shop = await _db.Shops
            .Include(s => s.Users)
            .Include(s => s.Orders)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (shop is null) return NotFound();

        if (shop.Orders.Any())
            return BadRequest(new { message = "Cannot delete shop with existing stock requests. Mark inactive instead." });

        _db.Shops.Remove(shop);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
