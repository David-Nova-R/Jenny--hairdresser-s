namespace Hairdressers_backend.Dtos
{
    public class GetUsersRequestDTO
    {
        public int PageNumber { get; set; } = 1;
        public string? SearchQuery { get; set; }  // filtre prénom, nom ou email
        public int? RoleId { get; set; }          // null = tous les rôles
    }
}
