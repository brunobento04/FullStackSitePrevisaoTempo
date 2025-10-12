// Data/AppDbContext.cs
using PrevisaoClimatica.API.Models;
using Microsoft.EntityFrameworkCore;

namespace PrevisaoClimatica.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; } 
        public DbSet<Favorito> Favoritos { get; set; } // <--- NOVO

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Garante que um usuário não possa adicionar a mesma cidade duas vezes
            modelBuilder.Entity<Favorito>()
                .HasIndex(f => new { f.UsuarioId, f.CidadeNome })
                .IsUnique();
        }
    }
}