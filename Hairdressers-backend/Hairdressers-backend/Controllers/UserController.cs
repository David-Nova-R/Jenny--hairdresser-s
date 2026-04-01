using Hairdressers_backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;
using Supabase;
using Supabase.Gotrue.Exceptions;

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
            try
            {
                // 1. Créer le user dans Supabase Auth
                var session = await _supabase.Auth.SignUp(registerDTO.Email, registerDTO.Password);

                if (session?.User == null)
                {
                    return StatusCode(500, new
                    {
                        Error = "Erreur lors de la création du compte Supabase."
                    });
                }

                // 2. Vérifier que le user n'existe pas déjà dans notre BD
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.SupabaseUserId == session.User.Id);

                if (existingUser != null)
                {
                    return BadRequest(new
                    {
                        Error = "Un profil existe déjà pour cet utilisateur."
                    });
                }

                // 3. Créer le profil dans notre BD
                var user = new User
                {
                    SupabaseUserId = session.User.Id!,
                    FirstName = registerDTO.FirstName,
                    LastName = registerDTO.LastName,
                    PhoneNumber = registerDTO.PhoneNumber,
                    Email = registerDTO.Email
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Compte créé avec succès. Veuillez confirmer votre adresse email."
                });
            }
            catch (GotrueException ex)
            {
                var message = ex.Message.ToLower();

                if (message.Contains("over_email_send_rate_limit") ||
                    message.Contains("email rate limit exceeded"))
                {
                    return StatusCode(429, new
                    {
                        Error = "Trop d'emails de confirmation ont été envoyés. Veuillez attendre un peu avant de réessayer."
                    });
                }

                return BadRequest(new
                {
                    Error = "Erreur Supabase lors de l'inscription.",
                    Details = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    Error = "Une erreur interne est survenue lors de l'inscription."
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO loginDTO)
        {
            try
            {
                // 1. Authentifier via Supabase
                var session = await _supabase.Auth.SignIn(loginDTO.Email, loginDTO.Password);

                if (session?.User == null || session.AccessToken == null)
                    return Unauthorized(new { Error = "Email ou mot de passe incorrect." });

                return Ok( session.AccessToken);
            }
            catch (GotrueException ex)
            {
                var message = ex.Message.ToLower();

                if (message.Contains("invalid login credentials") || message.Contains("invalid_credentials"))
                    return Unauthorized(new { Error = "Email ou mot de passe incorrect." });

                if (message.Contains("email not confirmed"))
                    return StatusCode(403, new { Error = "Veuillez confirmer votre adresse email avant de vous connecter." });

                return BadRequest(new { Error = "Erreur lors de la connexion.", Details = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { Error = "Une erreur interne est survenue lors de la connexion." });
            }
        }

        [HttpGet]
        [Authorize]
        public ActionResult PrivateTest()
        {
            return Ok(new string[] { "PrivatePomme", "PrivatePoire", "PrivateBanane" });
        }
    }
}
