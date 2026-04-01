namespace Hairdressers_backend.Dtos
{
    public class GetAdminAppointmentDTO
    {
        public int PageNumber { get; set; } = 1;
        public string? SearchQuery { get; set; }        // firstname ou lastname du client
        public int? Status { get; set; }                // filtre par statut
        public string? DateFilterMode { get; set; }     // "exact", "week", "month" ou "range"
        public DateTime? FilterDate { get; set; }       // référence pour exact / week / month
        public DateTime? DateFrom { get; set; }         // début de plage (mode "range")
        public DateTime? DateTo { get; set; }           // fin de plage (mode "range")
    }
}
