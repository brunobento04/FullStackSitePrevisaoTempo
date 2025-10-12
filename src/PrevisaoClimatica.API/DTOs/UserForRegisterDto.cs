using System.ComponentModel.DataAnnotations;

namespace PrevisaoClimatica.API.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 4, ErrorMessage = "A senha deve ter entre 4 e 100 caracteres.")]
        public string Password { get; set; } = string.Empty;
    }
}