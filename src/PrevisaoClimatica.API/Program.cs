using PrevisaoClimatica.API.Data;
using Microsoft.EntityFrameworkCore;
using PrevisaoClimatica.API.Services;
using PrevisaoClimatica.API.Repositories; 

// Usings para JWT e Segurança
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ====================================================================
// 1. CONFIGURAÇÃO DE SERVIÇOS
// ====================================================================

// Adicionar DbContext (SQL Server via EF Core)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Injetar Repositórios
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
// INJEÇÃO FINALIZADA: Repositório de Favoritos
builder.Services.AddScoped<IFavoritosRepository, FavoritosRepository>(); 

// Configurar o HttpClient para o OpenWeatherMapService (Cliente Tipado)
builder.Services.AddHttpClient<IOpenWeatherMapService, OpenWeatherMapService>();

// Configuração do CORS (Permite acesso do Front-end Angular na porta 4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configuração do JWT Bearer Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            // Pega a chave secreta do appsettings.json
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
            ValidateIssuer = false, 
            ValidateAudience = false 
        };
    });

// Adicionar Controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// ====================================================================
// 2. PIPELINE DE MIDDLEWARE (Ordem é crucial!)
// ====================================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. CORS deve vir antes de qualquer autenticação/autorização
app.UseCors("CorsPolicy"); 

// 2. Autenticação (JWT)
app.UseAuthentication(); 

// 3. Autorização (Verificação de permissões do usuário)
app.UseAuthorization(); 

app.MapControllers();

app.Run();