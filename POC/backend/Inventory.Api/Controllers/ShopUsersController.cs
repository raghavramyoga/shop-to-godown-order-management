using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/shop-users")]
public class ShopUsersController : ControllerBase
{
    private readonly InventoryDbContext _db;
    public ShopUsersController(InventoryDbContext db) => _db = db;

    public class ShopUserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string ShopId { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateShopUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string ShopId { get; set; } = string.Empty;
    }

    public class UpdateShopUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string ShopId { get; set; } = string.Empty;
        public bool Active { get; set; } = true;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShopUserDto>>> GetAll([FromQuery] string? shopId = null)
    {
        var query = _db.ShopUsers.Include(u => u.Shop).AsNoTracking().AsQueryable();
        if (!string.IsNullOrEmpty(shopId)) query = query.Where(u => u.ShopId == shopId);

        return await query
            .OrderBy(u => u.ShopId).ThenBy(u => u.Username)
            .Select(u => new ShopUserDto
            {
                Id = u.Id,
                Username = u.Username,
                FullName = u.FullName,
                ShopId = u.ShopId,
                ShopName = u.Shop.Name,
                Active = u.Active,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShopUserDto>> GetById(int id)
    {
        var u = await _db.ShopUsers.Include(x => x.Shop).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (u is null) return NotFound();

        return new ShopUserDto
        {
            Id = u.Id, Username = u.Username, FullName = u.FullName,
            ShopId = u.ShopId, ShopName = u.Shop.Name, Active = u.Active, CreatedAt = u.CreatedAt
        };
    }

    [HttpPost]
    public async Task<ActionResult<ShopUserDto>> Create(CreateShopUserDto dto)
    {
        if (await _db.ShopUsers.AnyAsync(u => u.Username == dto.Username))
            return Conflict(new { message = $"Username '{dto.Username}' already exists." });

        var shopExists = await _db.Shops.AnyAsync(s => s.Id == dto.ShopId);
        if (!shopExists) return BadRequest(new { message = $"Shop {dto.ShopId} not found." });

        var user = new ShopUser
        {
            Username = dto.Username,
            Password = dto.Password,
            FullName = dto.FullName,
            ShopId = dto.ShopId,
            Active = true
        };
        _db.ShopUsers.Add(user);
        await _db.SaveChangesAsync();

        return await GetById(user.Id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateShopUserDto dto)
    {
        var user = await _db.ShopUsers.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();

        user.FullName = dto.FullName;
        if (!string.IsNullOrWhiteSpace(dto.Password)) user.Password = dto.Password;
        user.ShopId = dto.ShopId;
        user.Active = dto.Active;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.ShopUsers.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();
        _db.ShopUsers.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
