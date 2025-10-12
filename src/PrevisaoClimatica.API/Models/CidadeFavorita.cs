// Models/CidadeFavorita.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // <-- Precisa deste using

namespace PrevisaoClimatica.API.Models
{
    public class CidadeFavorita
    {
        [Key]

       [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int Id { get; set; }
         
        [Required]
        [MaxLength(255)]
        [Column("Nome")]
        public string CidadeNome { get; set; } = string.Empty; 
        
        [Required]
        public int UsuarioId { get; set; }
        
        // Propriedade de Navegação
        public Usuario? Usuario { get; set; }
    }
}