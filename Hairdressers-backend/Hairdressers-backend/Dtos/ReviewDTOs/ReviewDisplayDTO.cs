namespace Hairdressers_backend.Dtos
{
    public class ReviewDisplayDTO
    {
        public string? AuthorName { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Stars { get; set; }
    }
}
