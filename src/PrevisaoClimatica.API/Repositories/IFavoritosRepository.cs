using PrevisaoClimatica.API.Models;

namespace PrevisaoClimatica.API.Repositories
{
    public interface IFavoritosRepository
    {
        // Retorna o objeto CidadeFavorita ou null
        Task<CidadeFavorita?> AddFavorito(int userId, string cityName);
        
        // Retorna true se a remoção foi bem-sucedida
        Task<bool> RemoveFavorito(int userId, string cityName);
        
        // Retorna a lista de favoritos do usuário
        Task<IEnumerable<CidadeFavorita>> GetFavoritos(int userId);
        
        // Verifica se o favorito já existe
        Task<bool> FavoritoExists(int userId, string cityName);
    }
}