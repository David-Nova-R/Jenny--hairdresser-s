using Hairdressers_backend.Dtos;
using Hairdressers_backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Models.Models;

namespace Hairdressers_backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<AdminUserDTO>> GetUsersAsync(int pageNumber, int pageSize, string? searchQuery, int? roleId)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Appointments)
                    .ThenInclude(a => a.HairStyle)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var q = searchQuery.Trim().ToLower();
                query = query.Where(u =>
                    u.FirstName.ToLower().Contains(q) ||
                    u.LastName.ToLower().Contains(q) ||
                    u.Email.ToLower().Contains(q) ||
                    (u.FirstName + " " + u.LastName).ToLower().Contains(q));
            }

            if (roleId.HasValue)
                query = query.Where(u => u.RoleId == roleId.Value);

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = users.Select(u => MapToDTO(u)).ToList();

            return new PagedResultDto<AdminUserDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<AdminUserDTO?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Appointments)
                    .ThenInclude(a => a.HairStyle)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user == null ? null : MapToDTO(user);
        }

        private static AdminUserDTO MapToDTO(User u) => new AdminUserDTO
        {
            Id = u.Id,
            SupabaseUserId = u.SupabaseUserId,
            FirstName = u.FirstName,
            LastName = u.LastName,
            PhoneNumber = u.PhoneNumber,
            Email = u.Email,
            RoleName = u.Role?.Name,
            Appointments = u.Appointments
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AdminUserAppointmentDTO
                {
                    Id = a.Id,
                    AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    Status = a.Status.ToString(),
                    HairStyleName = a.HairStyle?.Name,
                    PriceMin = a.HairStyle?.PriceMin ?? 0,
                    PriceMax = a.HairStyle?.PriceMax,
                    StyleNotes = a.StyleNotes
                })
                .ToList()
        };
    }
}
