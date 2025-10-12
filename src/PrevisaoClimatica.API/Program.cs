using PrevisaoClimatica.API.Data;
using Microsoft.EntityFrameworkCore;
using PrevisaoClimatica.API.Services; // Para o IOpenWeatherMapService

var builder = WebApplication.CreateBuilder(args);

// ====================================================================
// 1. CONFIGURAÇÃO DO CORS (Permite que o Front-end Angular acesse)
// ====================================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy =>
        {
            // O Front-end Angular geralmente roda na porta 4200
            policy.WithOrigins("http://localhost:4200") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ====================================================================
// 2. CONFIGURAÇÃO DO BANCO DE DADOS (SQL Server via EF Core)
// ====================================================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// ====================================================================
// 3. INJEÇÃO DE DEPENDÊNCIA DE SERVIÇOS
// ====================================================================

// A. Serviço do OpenWeatherMap (Usa IHttpClientFactory)
// Registra o IOpenWeatherMapService e o HttpClient associado
builder.Services.AddHttpClient<IOpenWeatherMapService, OpenWeatherMapService>();

// B. Serviços de Autenticação e Favoritos (Futuro - Implementaremos em breve)
// builder.Services.AddScoped<IAuthRepository, AuthRepository>();
// builder.Services.AddScoped<IFavoritosRepository, FavoritosRepository>();

// ====================================================================
// 4. SERVIÇOS PADRÃO ASP.NET CORE
// ====================================================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// ====================================================================
// 5. PIPELINE DE MIDDLEWARE (Ordem é importante!)
// ====================================================================

// Desenvolvimento: Ativa Swagger para documentação e testes
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Se você habilitou HTTPS

// Adiciona o middleware de CORS antes da Autorização
app.UseCors("CorsPolicy"); 

app.UseAuthorization(); 

app.MapControllers();

app.Run();