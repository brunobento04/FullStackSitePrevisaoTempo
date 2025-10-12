using PrevisaoClimatica.API.Data;
using PrevisaoClimatica.API.Models;
using Microsoft.EntityFrameworkCore;

namespace PrevisaoClimatica.API.Repositories
{
    public class FavoritosRepository : IFavoritosRepository
    {
        private readonly AppDbContext _context;

        public FavoritosRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Favorito?> AddFavorito(int userId, string cityName)
        {
            if (await FavoritoExists(userId, cityName))
            {
                return null;
            }

            var favorito = new Favorito
            {
                UsuarioId = userId,
                CidadeNome = cityName
            };

            await _context.Favoritos.AddAsync(favorito);
            await _context.SaveChangesAsync();

            return favorito;
        }

        public async Task<bool> RemoveFavorito(int userId, string cityName)
        {
            var favorito = await _context.Favoritos
                .FirstOrDefaultAsync(f => f.UsuarioId == userId && f.CidadeNome == cityName);

            if (favorito == null)
            {
                return false;
            }

            _context.Favoritos.Remove(favorito);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Favorito>> GetFavoritos(int userId)
        {
            return await _context.Favoritos
                .Where(f => f.UsuarioId == userId)
                .ToListAsync();
        }

        public async Task<bool> FavoritoExists(int userId, string cityName)
        {
            return await _context.Favoritos
                .AnyAsync(f => f.UsuarioId == userId && f.CidadeNome == cityName);
        }
    }
}