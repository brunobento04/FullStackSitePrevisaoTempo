using PrevisaoClimatica.API.Data;
using PrevisaoClimatica.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PrevisaoClimatica.API.Repositories
{
    public class FavoritosRepository : IFavoritosRepository
    {
        private readonly AppDbContext _context;

        public FavoritosRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CidadeFavorita?> AddFavorito(int userId, string cityName)
        {
            string normalizedCityName = cityName.Trim();

            if (await FavoritoExists(userId, normalizedCityName))
            {
                return null; // Favorito já existe
            }

            var favorito = new CidadeFavorita
            {
                UsuarioId = userId,
                CidadeNome = normalizedCityName
            };

            // USA: _context.CidadesFavoritas (Nome correto do DbSet)
            await _context.CidadesFavoritas.AddAsync(favorito); 
            await _context.SaveChangesAsync();

            return favorito;
        }

        public async Task<bool> RemoveFavorito(int userId, string cityName)
        {
            string normalizedCityName = cityName.Trim();
            
            // USA: _context.CidadesFavoritas (Nome correto do DbSet)
            var favorito = await _context.CidadesFavoritas 
                .FirstOrDefaultAsync(f => f.UsuarioId == userId && f.CidadeNome == normalizedCityName);

            if (favorito == null)
            {
                return false;
            }

            // USA: _context.CidadesFavoritas (Nome correto do DbSet)
            _context.CidadesFavoritas.Remove(favorito); 
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CidadeFavorita>> GetFavoritos(int userId)
        {
            // USA: _context.CidadesFavoritas (Nome correto do DbSet)
            return await _context.CidadesFavoritas 
                .Where(f => f.UsuarioId == userId)
                .ToListAsync();
        }

        public async Task<bool> FavoritoExists(int userId, string cityName)
        {
            string normalizedCityName = cityName.Trim();
            
            // USA: _context.CidadesFavoritas (Nome correto do DbSet)
            return await _context.CidadesFavoritas
                .AnyAsync(f => f.UsuarioId == userId && f.CidadeNome == normalizedCityName);
        }
    }
}