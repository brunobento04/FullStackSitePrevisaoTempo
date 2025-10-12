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
            
            _apiKey = configuration["OpenWeatherMap:ApiKey"] 
                      ?? throw new ArgumentNullException("OpenWeatherMap:ApiKey não configurada.");
            _baseUrl = configuration["OpenWeatherMap:BaseUrl"] 
                       ?? throw new ArgumentNullException("OpenWeatherMap:BaseUrl não configurada.");

            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }
        
        public async Task<OpenWeatherMapResponse?> GetCurrentWeatherAsync(string city)
        {
            // Parâmetros: q={city}, appid={key}, units=metric (Celsius), lang=pt_br
            string url = $"/weather?q={city}&appid={_apiKey}&units=metric&lang=pt_br";

            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode(); // Lança exceção para status 4xx/5xx

                var content = await response.Content.ReadAsStringAsync();
                
                // Deserializa o JSON
                var weatherData = JsonSerializer.Deserialize<OpenWeatherMapResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                return weatherData;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Erro ao buscar previsão atual para {city}: {ex.Message}");
                return null;
            }
        }
    
        public async Task<PrevisaoCincoDias?> GetFiveDayForecastAsync(string city)
        {
            string url = $"/forecast?q={city}&appid={_apiKey}&units=metric&lang=pt_br";

            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();

                var forecastData = JsonSerializer.Deserialize<PrevisaoCincoDias>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return forecastData;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Erro ao buscar previsão de 5 dias para {city}: {ex.Message}");
                return null;
            }
        }
    }
}