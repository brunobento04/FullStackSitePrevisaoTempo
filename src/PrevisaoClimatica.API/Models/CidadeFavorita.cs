using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrevisaoClimatica.API.Models
{
    public class CidadeFavorita
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        [Column("Nome")] // Mapeia a propriedade C# 'CidadeNome' para a coluna SQL 'Nome'
        public string CidadeNome { get; set; } = string.Empty; 
        
        [Required]
        public int UsuarioId { get; set; }
        
        // Propriedade de Navegação
        public Usuario? Usuario { get; set; }
    }
}