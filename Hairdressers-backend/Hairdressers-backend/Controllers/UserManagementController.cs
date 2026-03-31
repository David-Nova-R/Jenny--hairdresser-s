using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hairdressers_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserManagementController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> GetUsers([FromBody] GetUsersRequestDTO dto)
        {
            if (dto.PageNumber < 1)
                dto.PageNumber = 1;

            const int pageSize = 10;

            var result = await _userService.GetUsersAsync(
                dto.PageNumber,
                pageSize,
                dto.SearchQuery,
                dto.RoleId
            );

            return Ok(result);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "Utilisateur introuvable." });

            return Ok(user);
        }
    }
}
