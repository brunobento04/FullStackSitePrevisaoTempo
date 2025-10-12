using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrevisaoClimatica.API.Models
{
    public class Favorito
    {
        [Key]
        public int Id { get; set; }

        [Required]
        // Chave estrangeira para o usuário autenticado
        public int UsuarioId { get; set; } 

        [Required]
        [StringLength(100)]
        public string CidadeNome { get; set; } = string.Empty;

        // Propriedade de Navegação (Opcional, mas útil)
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }
    }
}