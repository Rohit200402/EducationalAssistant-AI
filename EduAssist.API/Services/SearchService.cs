using EduAssist.API.Data;
using EduAssist.API.DTOs;
using Microsoft.EntityFrameworkCore;
namespace EduAssist.API.Services;
public class SearchService : ISearchService
{
    private readonly ApplicationDbContext _context;
    public SearchService(ApplicationDbContext context) { _context = context; }

    public async Task<PaginatedResponse<SearchResultDto>> SearchAsync(string userId, string query, string? type, int? categoryId, int pageNumber, int pageSize)
    {
        var results = new List<SearchResultDto>();

        if (string.IsNullOrWhiteSpace(type) || type == "question")
        {
            var questions = _context.UserRequests
                .Include(ur => ur.Category)
                .Where(ur => ur.UserId == userId && ur.Query.Contains(query));
            if (categoryId.HasValue)
                questions = questions.Where(q => q.CategoryId == categoryId.Value);
            var qResults = await questions.Select(ur => new SearchResultDto
            {
                Id = ur.UserRequestId,
                Type = "question",
                Title = ur.Query.Length > 100 ? ur.Query.Substring(0, 100) + "..." : ur.Query,
                Snippet = ur.Query,
                CategoryName = ur.Category.SubjectName,
                Date = ur.RequestedOn
            }).ToListAsync();
            results.AddRange(qResults);
        }

        if (string.IsNullOrWhiteSpace(type) || type == "response")
        {
            var responses = _context.AIResponses
                .Include(ar => ar.UserRequest).ThenInclude(ur => ur.Category)
                .Where(ar => ar.UserRequest.UserId == userId && ar.Response.Contains(query));
            if (categoryId.HasValue)
                responses = responses.Where(r => r.UserRequest.CategoryId == categoryId.Value);
            var rResults = await responses.Select(ar => new SearchResultDto
            {
                Id = ar.AIResponseId,
                Type = "response",
                Title = ar.UserRequest.Query.Length > 100 ? ar.UserRequest.Query.Substring(0, 100) + "..." : ar.UserRequest.Query,
                Snippet = ar.Response.Length > 200 ? ar.Response.Substring(0, 200) + "..." : ar.Response,
                CategoryName = ar.UserRequest.Category.SubjectName,
                Date = ar.CreatedAt
            }).ToListAsync();
            results.AddRange(rResults);
        }

        if (string.IsNullOrWhiteSpace(type) || type == "bookmark")
        {
            var bookmarks = _context.Bookmarks
                .Include(b => b.AIResponse).ThenInclude(ar => ar.UserRequest).ThenInclude(ur => ur.Category)
                .Where(b => b.UserId == userId && (b.Notes.Contains(query) || b.AIResponse.Response.Contains(query)));
            if (categoryId.HasValue)
                bookmarks = bookmarks.Where(b => b.AIResponse.UserRequest.CategoryId == categoryId.Value);
            var bResults = await bookmarks.Select(b => new SearchResultDto
            {
                Id = b.BookmarkId,
                Type = "bookmark",
                Title = !string.IsNullOrEmpty(b.Notes) ? b.Notes : b.AIResponse.UserRequest.Query,
                Snippet = b.AIResponse.Response.Length > 200 ? b.AIResponse.Response.Substring(0, 200) + "..." : b.AIResponse.Response,
                CategoryName = b.AIResponse.UserRequest.Category.SubjectName,
                Date = b.BookmarkedOn
            }).ToListAsync();
            results.AddRange(bResults);
        }

        var ordered = results.OrderByDescending(r => r.Date).ToList();
        var totalCount = ordered.Count;
        var paged = ordered.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
        return new PaginatedResponse<SearchResultDto>(paged, totalCount, pageNumber, pageSize);
    }
}
