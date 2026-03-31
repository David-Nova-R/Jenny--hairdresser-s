using Hairdressers_backend.Dtos;

namespace Hairdressers_backend.Interfaces
{
    public interface IUserService
    {
        Task<PagedResultDto<AdminUserDTO>> GetUsersAsync(int pageNumber, int pageSize, string? searchQuery, int? roleId);
        Task<AdminUserDTO?> GetUserByIdAsync(int userId);
    }
}
