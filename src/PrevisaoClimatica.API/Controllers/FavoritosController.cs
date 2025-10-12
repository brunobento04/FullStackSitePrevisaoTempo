using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PrevisaoClimatica.API.Repositories;
using PrevisaoClimatica.API.DTOs;
using System.Security.Claims;
using System.Net;

namespace PrevisaoClimatica.API.Controllers
{
    [Authorize] // <--- PROTEGE O CONTROLLER: REQUER UM JWT VÁLIDO
    [ApiController]
    [Route("api/[controller]")] // Rota base: /api/favoritos
    public class FavoritosController : ControllerBase
    {
        private readonly IFavoritosRepository _repo;

        public FavoritosController(IFavoritosRepository repo)
        {
            _repo = repo;
        }

        // Método auxiliar para obter o ID do usuário autenticado a partir do JWT
        private int GetUserId()
        {
            // O ID do usuário (Usuario.Id) é armazenado na claim ClaimTypes.NameIdentifier
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (userIdClaim == null)
            {
                // Exceção de fallback caso o token seja inválido de alguma forma
                throw new UnauthorizedAccessException("ID de usuário não encontrado no token.");
            }
            
            return int.Parse(userIdClaim);
        }
        
        /// <summary>
        /// Lista todas as cidades favoritas do usuário autenticado.
        /// GET /api/favoritos
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetFavoritos()
        {
            var userId = GetUserId();
            var favoritos = await _repo.GetFavoritos(userId);

            // Mapeia o modelo Favorito para o DTO FavoritoDTO
            var response = favoritos.Select(f => new FavoritoDTO { CidadeNome = f.CidadeNome });

            return Ok(response);
        }

        /// <summary>
        /// Adiciona uma cidade à lista de favoritos do usuário.
        /// POST /api/favoritos (Body: { "cidadeNome": "Cidade" })
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> AddFavorito([FromBody] FavoritoDTO favoritoDto)
        {
            if (string.IsNullOrWhiteSpace(favoritoDto.CidadeNome))
            {
                return BadRequest("O nome da cidade é obrigatório.");
            }
            
            var userId = GetUserId();
            var cidade = favoritoDto.CidadeNome.Trim();

            if (await _repo.FavoritoExists(userId, cidade))
            {
                return Conflict($"A cidade '{cidade}' já está na sua lista de favoritos.");
            }

            await _repo.AddFavorito(userId, cidade);

            return StatusCode((int)HttpStatusCode.Created, new { message = $"Cidade '{cidade}' adicionada com sucesso." });
        }

        /// <summary>
        /// Remove uma cidade da lista de favoritos do usuário.
        /// DELETE /api/favoritos/{cidade} (Ex: /api/favoritos/Sao%20Paulo)
        /// </summary>
        [HttpDelete("{cidade}")]
        public async Task<IActionResult> RemoveFavorito(string cidade)
        {
            var userId = GetUserId();

            var success = await _repo.RemoveFavorito(userId, cidade.Trim());

            if (!success)
            {
                return NotFound($"A cidade '{cidade}' não foi encontrada na sua lista de favoritos.");
            }

            return NoContent(); // 204 No Content
        }
    }
}