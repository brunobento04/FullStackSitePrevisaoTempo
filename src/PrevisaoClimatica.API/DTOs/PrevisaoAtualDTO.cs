namespace PrevisaoClimatica.API.DTOs
{
    // Este DTO corresponde à interface PrevisaoAtual do Front-end Angular
    public class PrevisaoAtualDTO
    {
        public string Cidade { get; set; } = string.Empty;
        public double Temperatura { get; set; }
        public string Condicao { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty; // Código do OpenWeatherMap
        public double TempMax { get; set; }
        public double TempMin { get; set; }
        public int Umidade { get; set; }
    }
}