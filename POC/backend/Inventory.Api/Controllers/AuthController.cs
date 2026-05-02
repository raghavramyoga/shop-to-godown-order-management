using Inventory.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly InventoryDbContext _db;
    public AuthController(InventoryDbContext db) => _db = db;

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AdminLoginResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin";
    }

    public class ShopLoginResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "ShopUser";
        public string ShopId { get; set; } = string.Empty;
        public string ShopName { get; set; } = string.Empty;
    }

    [HttpPost("admin-login")]
    public async Task<ActionResult<AdminLoginResponse>> AdminLogin(LoginDto dto)
    {
        var user = await _db.AdminUsers
            .FirstOrDefaultAsync(u => u.Username == dto.Username && u.Password == dto.Password);

        if (user is null) return Unauthorized(new { message = "Invalid admin credentials" });

        return new AdminLoginResponse
        {
            UserId = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Role = "Admin"
        };
    }

    [HttpPost("shop-login")]
    public async Task<ActionResult<ShopLoginResponse>> ShopLogin(LoginDto dto)
    {
        var user = await _db.ShopUsers
            .Include(u => u.Shop)
            .FirstOrDefaultAsync(u => u.Username == dto.Username && u.Password == dto.Password);

        if (user is null) return Unauthorized(new { message = "Invalid shop user credentials" });
        if (!user.Active) return Unauthorized(new { message = "This account is inactive" });
        if (!user.Shop.Active) return Unauthorized(new { message = "Your shop is currently inactive" });

        return new ShopLoginResponse
        {
            UserId = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Role = "ShopUser",
            ShopId = user.ShopId,
            ShopName = user.Shop.Name
        };
    }
}
