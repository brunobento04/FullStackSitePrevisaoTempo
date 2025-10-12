namespace PrevisaoClimatica.API.DTOs
{
    public class PrevisaoAtualDTO
    {
        public string Cidade { get; set; } = string.Empty;
        public double Temperatura { get; set; }
        public string Condicao { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty; 
        public double TempMax { get; set; }
        public double TempMin { get; set; }
        public int Umidade { get; set; }
    }
}