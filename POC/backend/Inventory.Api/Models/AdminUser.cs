using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public class AdminUser
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Password { get; set; } = string.Empty; // POC: plaintext.

    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
