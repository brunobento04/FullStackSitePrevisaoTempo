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
        public string Username { get; set; } // Usado para login
        
        [Required]
        public byte[] PasswordHash { get; set; } // Armazenamento seguro de senha
        
        [Required]
        public byte[] PasswordSalt { get; set; } // Sal para hashing
        
        // Relacionamento com Favoritos
        public ICollection<CidadeFavorita> CidadesFavoritas { get; set; }
    }
}