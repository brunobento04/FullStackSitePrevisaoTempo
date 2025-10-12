
namespace PrevisaoClimatica.API.DTOs
{
    // Este DTO corresponde à interface PrevisaoDia do Front-end Angular
    public class PrevisaoDiaDTO
    {
        public string Data { get; set; } = string.Empty; // Ex: "Seg", "Ter"
        public double TempMax { get; set; }
        public double TempMin { get; set; }
        public string Condicao { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty; // Código do OpenWeatherMap
    }
}