using System.ComponentModel.DataAnnotations;

namespace PrevisaoClimatica.API.DTOs
{
    public class FavoritoDTO
    {
        [Required]
        public string CidadeNome { get; set; } = string.Empty;
    }
}