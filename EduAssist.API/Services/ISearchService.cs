using EduAssist.API.DTOs;
namespace EduAssist.API.Services;
public interface ISearchService
{
    Task<PaginatedResponse<SearchResultDto>> SearchAsync(string userId, string query, string? type, int? categoryId, int pageNumber, int pageSize);
}
