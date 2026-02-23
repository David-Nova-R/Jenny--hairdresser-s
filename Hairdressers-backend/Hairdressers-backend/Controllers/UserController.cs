using Hairdressers_backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;

namespace Hairdressers_backend.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Client _supabase;

        public UserController(AppDbContext context, Client supabase)
        {
            _context = context;
            _supabase = supabase;
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterDTO registerDTO)
        {
            // 1. Créer le user dans Supabase Auth
            var session = await _supabase.Auth.SignUp(registerDTO.Email, registerDTO.Password);

            if (session?.User == null)
            {
                return StatusCode(500, new { Error = "Erreur lors de la création du compte Supabase." });
            }

            // 2. Vérifier que le user n'existe pas déjà dans notre BD
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.SupabaseUserId == session.User.Id);

            if (existingUser != null)
            {
                return BadRequest(new { Error = "Un profil existe déjà pour cet utilisateur." });
            }

            // 3. Créer le profil dans notre BD
            var user = new User
            {
                SupabaseUserId = session.User.Id!,
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                PhoneNumber = registerDTO.PhoneNumber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Compte créé avec succès." });
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO loginDTO)
        {
            // Supabase gère le login et retourne un JWT
            var session = await _supabase.Auth.SignIn(loginDTO.Email, loginDTO.Password);

            if (session?.AccessToken == null)
            {
                return Unauthorized(new { Error = "Email ou mot de passe invalide." });
            }

            return Ok(new
            {
                Token = session.AccessToken,
                RefreshToken = session.RefreshToken,
                UserId = session.User!.Id
            });
        }
        [HttpGet]
        [Authorize]
        public ActionResult PrivateTest()
        {
            return Ok(new string[] { "PrivatePomme", "PrivatePoire", "PrivateBanane" });
        }
    }
}
