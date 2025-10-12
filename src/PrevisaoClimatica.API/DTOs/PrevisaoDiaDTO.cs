namespace PrevisaoClimatica.API.DTOs
{
    public class PrevisaoDiaDTO
    {
        public string Data { get; set; } = string.Empty; 
        public double TempMax { get; set; }
        public double TempMin { get; set; }
        public string Condicao { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty;
    }
}