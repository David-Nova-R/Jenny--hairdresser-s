using Models.Models;

namespace Hairdressers_backend.Interfaces
{
    public interface IPortfolioService
    {
        Task<List<PortfolioPhoto>> GetVisiblePhotosAsync();
        Task<List<PortfolioPhoto>> GetAllPhotosAsync();
        Task<PortfolioPhoto> UploadPhotoAsync(IFormFile photo, string? title, int order);
        Task DeletePhotoAsync(int photoId);
        Task UpdatePhotoAsync(int photoId, bool isVisible, int order, string? title);
    }
}
