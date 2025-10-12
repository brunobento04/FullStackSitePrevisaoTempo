using Microsoft.EntityFrameworkCore;
using PrevisaoClimatica.API.Models;

namespace PrevisaoClimatica.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Usuario> Usuarios { get; set; }
        // CORREÇÃO: Usamos o nome do modelo no plural, que corresponde ao nome da sua tabela SQL
        public DbSet<CidadeFavorita> CidadesFavoritas { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Restrição de unicidade: uma cidade por usuário
            modelBuilder.Entity<CidadeFavorita>()
                .HasIndex(cf => new { cf.UsuarioId, cf.CidadeNome })
                .IsUnique();

            // Configuração do relacionamento 1:N
            modelBuilder.Entity<CidadeFavorita>()
                .HasOne(cf => cf.Usuario)
                .WithMany(u => u.CidadesFavoritas)
                .HasForeignKey(cf => cf.UsuarioId);
        }
    }
}