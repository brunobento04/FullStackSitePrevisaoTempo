using PrevisaoClimatica.API.Data;
using PrevisaoClimatica.API.Models;
using Microsoft.EntityFrameworkCore;

namespace PrevisaoClimatica.API.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> Register(Usuario user, string password)
        {
            if (await UserExists(user.Username))
                return null; // Usuário já existe
            
            user.Password = password; 

            try 
            {
                await _context.Usuarios.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                Console.WriteLine($"ERRO FATAL NO REGISTRO (SQL): {ex.Message}");
                return null; 
            }

            return user;
        }

        public async Task<Usuario?> Login(string username, string password)
        {
            // Busca o usuário pelo Username (que mapeia para a coluna Nome)
            var user = await _context.Usuarios.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null)
                return null; // Usuário não encontrado

            if (user.Password != password) 
                return null; // Senha incorreta

            return user;
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Usuarios.AnyAsync(x => x.Username == username))
                return true;
            return false;
        }
    }
}