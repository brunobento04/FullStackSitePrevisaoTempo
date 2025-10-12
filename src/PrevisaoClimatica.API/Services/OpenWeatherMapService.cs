using PrevisaoClimatica.API.DTOs;
using System.Text.Json;
using System.Net.Http.Headers;

namespace PrevisaoClimatica.API.Services
{
    public interface IOpenWeatherMapService
    {
        Task<OpenWeatherMapResponse?> GetCurrentWeatherAsync(string city);
        Task<PrevisaoCincoDias?> GetFiveDayForecastAsync(string city); 
    }

    public class OpenWeatherMapService : IOpenWeatherMapService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        public OpenWeatherMapService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            
            // Leitura das configurações
            _apiKey = configuration["OpenWeatherMap:ApiKey"] 
                      ?? throw new ArgumentNullException("OpenWeatherMap:ApiKey não configurada.");
            _baseUrl = configuration["OpenWeatherMap:BaseUrl"] 
                       ?? throw new ArgumentNullException("OpenWeatherMap:BaseUrl não configurada.");

            // IMPORTANTE: REMOVEMOS A DEFINIÇÃO DE BaseAddress AQUI.
            // _httpClient.BaseAddress = new Uri(_baseUrl); // <--- REMOVIDO!
            
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }
        
        // REVISADO: Constrói a URL completa em cada chamada
        public async Task<OpenWeatherMapResponse?> GetCurrentWeatherAsync(string city)
        {
            // Constrói a URL COMPLETA usando a BaseUrl lida do appsettings.json
            string url = $"{_baseUrl}/weather?q={city}&appid={_apiKey}&units=metric&lang=pt_br"; 

            try
            {
                // Envia a URL completa, evitando o problema de combinação BaseAddress + URL Relativa
                var response = await _httpClient.GetAsync(url); 

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Erro OpenWeatherMap {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
                    return null; 
                }

                var content = await response.Content.ReadAsStringAsync();
                
                var weatherData = JsonSerializer.Deserialize<OpenWeatherMapResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                return weatherData;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO FATAL ao buscar previsão atual: {ex.Message}");
                return null;
            }
        }
        
        // REVISADO: Constrói a URL completa em cada chamada
        public async Task<PrevisaoCincoDias?> GetFiveDayForecastAsync(string city)
        {
            // Constrói a URL COMPLETA usando a BaseUrl lida do appsettings.json
            string url = $"{_baseUrl}/forecast?q={city}&appid={_apiKey}&units=metric&lang=pt_br"; 

            try
            {
                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Erro OpenWeatherMap {response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
                    return null; 
                }

                var content = await response.Content.ReadAsStringAsync();

                var forecastData = JsonSerializer.Deserialize<PrevisaoCincoDias>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return forecastData;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO FATAL ao buscar previsão de 5 dias: {ex.Message}");
                return null;
            }
        }
    }
}