using System.ComponentModel.DataAnnotations;

namespace PrevisaoClimatica.API.Models
{
    public class CidadeFavorita
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Nome { get; set; } // Nome da cidade
        
        [Required]
        public int UsuarioId { get; set; }
        
        // Propriedade de Navegação
        public Usuario Usuario { get; set; }
    }
}