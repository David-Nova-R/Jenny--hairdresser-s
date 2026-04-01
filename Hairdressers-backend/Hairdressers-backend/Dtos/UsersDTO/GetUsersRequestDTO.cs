namespace Hairdressers_backend.Dtos
{
    public class GetUsersRequestDTO
    {
        public int PageNumber { get; set; } = 1;
        public string? SearchQuery { get; set; }        // filtre prénom ou nom
        public int? RoleId { get; set; }                // null = tous les rôles
        public DateTime? FilterDate { get; set; }       // date de référence pour le filtre
        public string? DateFilterMode { get; set; }     // "exact", "week" ou "month"
        public string? SortByAppointments { get; set; } // "asc" ou "desc" (tri par nb de rdv)
    }
}
