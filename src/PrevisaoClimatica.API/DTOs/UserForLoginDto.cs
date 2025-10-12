using System.ComponentModel.DataAnnotations;

namespace PrevisaoClimatica.API.DTOs
{
    public class UserForLoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}