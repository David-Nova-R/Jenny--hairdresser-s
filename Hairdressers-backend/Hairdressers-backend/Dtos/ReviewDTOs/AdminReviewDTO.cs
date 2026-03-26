namespace Hairdressers_backend.Dtos
{
    public class AdminReviewDTO
    {
        public int Id { get; set; }
        public string? AuthorName { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Stars { get; set; }
        public bool IsVisible { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
