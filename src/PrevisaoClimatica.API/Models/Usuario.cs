using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrevisaoClimatica.API.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        [Column("Nome")]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [Column("Senha")] 
        public string Password { get; set; } = string.Empty;
        
        // Relacionamento com Favoritos (Manter)
        public ICollection<Favorito> Favoritos { get; set; } = new List<Favorito>();
    }
}