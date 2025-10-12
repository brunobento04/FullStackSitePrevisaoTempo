using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace PrevisaoClimatica.API.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Username { get; set; } 
        
        [Required]
        public byte[] PasswordHash { get; set; } 
        
        [Required]
        public byte[] PasswordSalt { get; set; } 
        
        // Relacionamento com Favoritos
        public ICollection<CidadeFavorita> CidadesFavoritas { get; set; }
    }
}