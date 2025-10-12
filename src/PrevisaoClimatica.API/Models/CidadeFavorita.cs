using System.ComponentModel.DataAnnotations;

namespace PrevisaoClimatica.API.Models
{
    public class CidadeFavorita
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Nome { get; set; } 
        
        [Required]
        public int UsuarioId { get; set; }
        
        public Usuario Usuario { get; set; }
    }
}