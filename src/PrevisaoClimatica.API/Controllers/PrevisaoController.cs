using Microsoft.AspNetCore.Mvc;
using PrevisaoClimatica.API.Services;
using PrevisaoClimatica.API.DTOs;
using System.Net;
using System.Globalization;
using System.Linq;

namespace PrevisaoClimatica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
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

            // Verifica se os dados principais vieram (Main é null se a cidade não existe)
            if (weatherData == null || weatherData.Main == null)
            {
                return NotFound($"Não foi possível encontrar a previsão para a cidade: {cidade}");
            }

            // Mapeia o DTO da API externa para o DTO de resposta do Angular
            var responseDto = new PrevisaoAtualDTO
            {
                Cidade = weatherData.Cidade,
                Temperatura = weatherData.Main.Temperatura,
                Condicao = weatherData.Weather.FirstOrDefault()?.Descricao ?? "N/A",
                Icone = weatherData.Weather.FirstOrDefault()?.Icone ?? "01d", // Código de ícone OWM
                TempMax = weatherData.Main.TempMax,
                TempMin = weatherData.Main.TempMin,
                Umidade = weatherData.Main.Umidade
            };

            return Ok(responseDto);
        }
        
        /// <summary>
        /// Obtém a previsão estendida para os próximos 5 dias, com conversão manual de data.
        /// Rota Angular: GET /api/previsao/5dias?cidade=SaoPaulo
        /// </summary>
        [HttpGet("5dias")]
        [ProducesResponseType(typeof(IEnumerable<PrevisaoDiaDTO>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
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

            // Lógica de agrupamento dos dados (de 3 em 3 horas) por dia
            var previsaoAgrupada = forecastData.List
                .Where(item => item.Main != null && item.Weather.Any())
                .Select(item => new 
                {
                    // CONVERSÃO MANUAL DA DATA (CORREÇÃO DO ERRO JSON)
                    DataHoraObj = DateTime.ParseExact(item.DataHora, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture),
                    Item = item
                })
                .GroupBy(x => x.DataHoraObj.Date) // Agrupa por data (dia)
                .Select(g => new PrevisaoDiaDTO
                {
                    // Formata a data para exibir o dia da semana em Português
                    Data = g.Key.ToString("ddd", new CultureInfo("pt-BR")), 
                    TempMax = g.Max(x => x.Item.Main!.TempMax),
                    TempMin = g.Min(x => x.Item.Main!.TempMin),
                    
                    // Pega a condição do meio-dia (entre 12h e 15h) como representativa
                    Condicao = g.FirstOrDefault(x => x.DataHoraObj.Hour >= 12 && x.DataHoraObj.Hour < 15)
                               ?.Item.Weather.FirstOrDefault()?.Descricao ?? g.First().Item.Weather.First().Descricao,
                    
                    Icone = g.FirstOrDefault(x => x.DataHoraObj.Hour >= 12 && x.DataHoraObj.Hour < 15)
                            ?.Item.Weather.FirstOrDefault()?.Icone ?? g.First().Item.Weather.First().Icone
                })
                .ToList();

            var responseList = previsaoAgrupada.Take(5).ToList();

            return Ok(responseList);
        }
    }
}