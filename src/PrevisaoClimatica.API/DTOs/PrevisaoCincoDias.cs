using System.Text.Json.Serialization;

namespace PrevisaoClimatica.API.DTOs
{
    public class ForecastItem
    {
        [JsonPropertyName("dt_txt")]
        public DateTime DataHora { get; set; }

        [JsonPropertyName("main")]
        public WeatherMain Main { get; set; } 
        
        [JsonPropertyName("weather")]
        public List<WeatherInfo> Weather { get; set; } 
    }

    public class PrevisaoCincoDias
    {
        [JsonPropertyName("list")]
        public List<ForecastItem> List { get; set; } = new List<ForecastItem>();

        [JsonPropertyName("city")]
        public ForecastCity City { get; set; }
    }
    
    public class ForecastCity
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}