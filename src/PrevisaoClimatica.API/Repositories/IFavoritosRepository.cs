using PrevisaoClimatica.API.Models;

namespace PrevisaoClimatica.API.Repositories
{
    public interface IFavoritosRepository
    {
        Task<Favorito?> AddFavorito(int userId, string cityName);
        Task<bool> RemoveFavorito(int userId, string cityName);
        Task<IEnumerable<Favorito>> GetFavoritos(int userId);
        Task<bool> FavoritoExists(int userId, string cityName);
    }
}