using Microsoft.AspNetCore.Mvc;
using PrevisaoClimatica.API.Services;
using PrevisaoClimatica.API.DTOs;
using System.Net;
using System.Globalization; // Para formatação de datas (pt-BR)

namespace PrevisaoClimatica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Rota base: /api/previsao
    public class PrevisaoController : ControllerBase
    {
        private readonly IOpenWeatherMapService _weatherService;

        public PrevisaoController(IOpenWeatherMapService weatherService)
        {
            _weatherService = weatherService;
        }

        /// <summary>
        /// Obtém a previsão do tempo atual para uma cidade.
        /// Rota Angular: GET /api/previsao/atual?cidade=SaoPaulo
        /// </summary>
        [HttpGet("atual")]
        [ProducesResponseType(typeof(PrevisaoAtualDTO), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetCurrent([FromQuery] string cidade)
        {
            if (string.IsNullOrWhiteSpace(cidade))
            {
                return BadRequest("O parâmetro 'cidade' é obrigatório.");
            }

            var weatherData = await _weatherService.GetCurrentWeatherAsync(cidade);

            if (weatherData == null)
            {
                // Retorna 404 se a cidade não foi encontrada ou houve erro na API externa
                return NotFound($"Não foi possível encontrar a previsão para a cidade: {cidade}");
            }

            // Mapeia o DTO da API externa para o DTO de resposta que o Angular espera
            var responseDto = new PrevisaoAtualDTO
            {
                Cidade = weatherData.Cidade,
                Temperatura = weatherData.Main.Temperatura,
                Condicao = weatherData.Weather.FirstOrDefault()?.Descricao ?? "N/A",
                Icone = weatherData.Weather.FirstOrDefault()?.Icone ?? "", // Código do ícone do OpenWeatherMap
                TempMax = weatherData.Main.TempMax,
                TempMin = weatherData.Main.TempMin,
                Umidade = weatherData.Main.Umidade
            };

            return Ok(responseDto);
        }
        
        [HttpGet("5dias")]
        [ProducesResponseType(typeof(IEnumerable<PrevisaoDiaDTO>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetFiveDayForecast([FromQuery] string cidade)
        {
            if (string.IsNullOrWhiteSpace(cidade))
            {
                return BadRequest("O parâmetro 'cidade' é obrigatório.");
            }

            var forecastData = await _weatherService.GetFiveDayForecastAsync(cidade);

            if (forecastData == null || forecastData.List.Count == 0)
            {
                return NotFound($"Não foi possível encontrar a previsão de 5 dias para a cidade: {cidade}");
            }

            var previsaoAgrupada = forecastData.List
                .GroupBy(item => item.DataHora.Date)
                .Select(g => new PrevisaoDiaDTO
                {
                    Data = g.Key.ToString("ddd", new CultureInfo("pt-BR")), 
                    
                    TempMax = g.Max(item => item.Main.TempMax),
                    
                    TempMin = g.Min(item => item.Main.TempMin),
                    
                    Condicao = g.FirstOrDefault(item => item.DataHora.Hour >= 12 && item.DataHora.Hour < 15)
                               ?.Weather.FirstOrDefault()?.Descricao ?? g.First().Weather.First().Descricao,
                    
                    Icone = g.FirstOrDefault(item => item.DataHora.Hour >= 12 && item.DataHora.Hour < 15)
                            ?.Weather.FirstOrDefault()?.Icone ?? g.First().Weather.First().Icone
                })
                .ToList();

            var responseList = previsaoAgrupada.Take(5).ToList();

            return Ok(responseList);
        }
    }
}