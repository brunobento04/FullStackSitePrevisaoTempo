using PrevisaoClimatica.API.Data;
using PrevisaoClimatica.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography; // Para hashing
using System.Text;

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
                return null; 

            // Hashing da senha
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Usuarios.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<Usuario?> Login(string username, string password)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(x => x.Username == username);

            if (user == null)
                return null; // Usuário não encontrado

            // Verifica o hash da senha
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null; // Senha incorreta

            return user;
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Usuarios.AnyAsync(x => x.Username == username))
                return true;
            return false;
        }

        // --- Métodos de Hashing e Verificação ---

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
                return true;
            }
        }
    }
}