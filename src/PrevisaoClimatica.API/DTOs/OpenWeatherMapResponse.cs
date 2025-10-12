using System.Text.Json.Serialization;

namespace PrevisaoClimatica.API.DTOs
{
    public class WeatherMain
    {
        [JsonPropertyName("temp")]
        public double Temperatura { get; set; }

        [JsonPropertyName("temp_min")]
        public double TempMin { get; set; }

        [JsonPropertyName("temp_max")]
        public double TempMax { get; set; }

        [JsonPropertyName("humidity")]
        public int Umidade { get; set; }
    }

    public class WeatherInfo
    {
        [JsonPropertyName("description")]
        public string Descricao { get; set; }

        [JsonPropertyName("icon")]
        public string Icone { get; set; } 
    }

    public class OpenWeatherMapResponse
    {
        [JsonPropertyName("name")]
        public string Cidade { get; set; }

        [JsonPropertyName("main")]
        public WeatherMain Main { get; set; }

        [JsonPropertyName("weather")]
        public List<WeatherInfo> Weather { get; set; }
    }
}