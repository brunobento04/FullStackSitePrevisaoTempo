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
        [Column("Nome")] // Mapeia a propriedade C# Username para a coluna SQL 'Nome'
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [Column("Senha")] // Mapeia a propriedade C# Password para a coluna SQL 'Senha'
        public string Password { get; set; } = string.Empty; // Senha em Texto Puro (Treinamento)
        
        // Propriedade de navegação
        public ICollection<CidadeFavorita> CidadesFavoritas { get; set; } = new List<CidadeFavorita>();
    }
}