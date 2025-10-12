using Microsoft.EntityFrameworkCore;
using PrevisaoClimatica.API.Models;

namespace PrevisaoClimatica.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<CidadeFavorita> CidadesFavoritas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Opcional: Configurar o índice de unicidade (Ex: uma cidade só pode ser favorita uma vez por usuário)
            modelBuilder.Entity<CidadeFavorita>()
                .HasIndex(cf => new { cf.Nome, cf.UsuarioId })
                .IsUnique();

            // Configuração do relacionamento 1:N
            modelBuilder.Entity<CidadeFavorita>()
                .HasOne(cf => cf.Usuario)
                .WithMany(u => u.CidadesFavoritas)
                .HasForeignKey(cf => cf.UsuarioId);
        }
    }
}