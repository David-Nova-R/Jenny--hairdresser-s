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

        public async Task<PagedResultDto<AdminUserDTO>> GetUsersAsync(int pageNumber, int pageSize, string? searchQuery, int? roleId, DateTime? filterDate, string? dateFilterMode, string? sortByAppointments)
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
                    (u.FirstName + " " + u.LastName).ToLower().Contains(q));
            }

            if (roleId.HasValue)
                query = query.Where(u => u.RoleId == roleId.Value);

            if (filterDate.HasValue && !string.IsNullOrWhiteSpace(dateFilterMode))
            {
                var date = filterDate.Value.Date;
                switch (dateFilterMode.ToLower())
                {
                    case "exact":
                        query = query.Where(u => u.Appointments.Any(a => a.AppointmentDate.Date == date));
                        break;
                    case "week":
                        // Semaine du lundi au dimanche
                        int diff = (int)date.DayOfWeek == 0 ? -6 : 1 - (int)date.DayOfWeek;
                        var weekStart = date.AddDays(diff);
                        var weekEnd = weekStart.AddDays(7);
                        query = query.Where(u => u.Appointments.Any(a =>
                            a.AppointmentDate.Date >= weekStart && a.AppointmentDate.Date < weekEnd));
                        break;
                    case "month":
                        var monthStart = new DateTime(date.Year, date.Month, 1);
                        var monthEnd = monthStart.AddMonths(1);
                        query = query.Where(u => u.Appointments.Any(a =>
                            a.AppointmentDate.Date >= monthStart && a.AppointmentDate.Date < monthEnd));
                        break;
                }
            }

            var totalCount = await query.CountAsync();

            IQueryable<Models.Models.User> orderedQuery;
            if (!string.IsNullOrWhiteSpace(sortByAppointments))
            {
                orderedQuery = sortByAppointments.ToLower() == "desc"
                    ? query.OrderByDescending(u => u.Appointments.Count).ThenBy(u => u.LastName)
                    : query.OrderBy(u => u.Appointments.Count).ThenBy(u => u.LastName);
            }
            else
            {
                orderedQuery = query.OrderBy(u => u.LastName).ThenBy(u => u.FirstName);
            }

            var users = await orderedQuery
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
