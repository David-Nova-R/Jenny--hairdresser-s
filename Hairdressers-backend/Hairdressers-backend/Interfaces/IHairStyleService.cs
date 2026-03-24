using Hairdressers_backend.Dtos.HairStylesDTO;
using Models.Models;

public interface IHairStyleService
{
    Task<string> UploadPhotoAsync(int hairStyleId, IFormFile photo);
    Task DeletePhotoAsync(int photoId);
    Task<List<HairStylePhoto>> GetPhotosByHairStyleAsync(int hairStyleId);
    Task<User?> GetUserBySupabaseIdAsync(string supabaseUserId);
    Task<List<HairStyleDTO>> GetHairStylesAsync();
}