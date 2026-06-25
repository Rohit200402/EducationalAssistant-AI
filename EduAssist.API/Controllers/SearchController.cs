using System.Security.Claims;
using EduAssist.API.DTOs;
using EduAssist.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;
    public SearchController(ISearchService searchService) { _searchService = searchService; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<SearchResultDto>>> Search(
        [FromQuery] string query = "",
        [FromQuery] string? type = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new PaginatedResponse<SearchResultDto>(new List<SearchResultDto>(), 0, pageNumber, pageSize));
        var results = await _searchService.SearchAsync(GetUserId(), query, type, categoryId, pageNumber, pageSize);
        return Ok(results);
    }
}
