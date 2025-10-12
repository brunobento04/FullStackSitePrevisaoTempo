using System.ComponentModel.DataAnnotations;

namespace PrevisaoClimatica.API.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 100 caracteres.")]
        public string Password { get; set; } = string.Empty;
    }
}