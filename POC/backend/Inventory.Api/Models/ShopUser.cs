using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public class ShopUser
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Password { get; set; } = string.Empty; // POC: plaintext. Replace with hash in production.

    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string ShopId { get; set; } = string.Empty;
    public Shop Shop { get; set; } = null!;

    public bool Active { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
