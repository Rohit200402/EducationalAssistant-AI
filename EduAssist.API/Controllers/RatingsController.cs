using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public RatingsController(ApplicationDbContext context) { _context = context; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpPost]
    public async Task<ActionResult<RatingDto>> CreateOrUpdate([FromBody] RatingForCreate dto)
    {
        if (dto.Value < 1 || dto.Value > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5." });

        var userId = GetUserId();
        var existing = await _context.Ratings.FirstOrDefaultAsync(r => r.UserId == userId && r.AIResponseId == dto.AIResponseId);

        if (existing != null)
        {
            existing.Value = dto.Value;
            existing.CreatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new RatingDto(existing.RatingId, existing.UserId, existing.AIResponseId, existing.Value, existing.CreatedAt));
        }

        var rating = new Rating
        {
            UserId = userId,
            AIResponseId = dto.AIResponseId,
            Value = dto.Value,
            CreatedAt = DateTime.UtcNow
        };
        _context.Ratings.Add(rating);
        await _context.SaveChangesAsync();
        return Ok(new RatingDto(rating.RatingId, rating.UserId, rating.AIResponseId, rating.Value, rating.CreatedAt));
    }

    [HttpGet("response/{aiResponseId}")]
    public async Task<ActionResult<RatingAggregateDto>> GetForResponse(int aiResponseId)
    {
        var userId = GetUserId();
        var ratings = await _context.Ratings.Where(r => r.AIResponseId == aiResponseId).ToListAsync();
        var userRating = ratings.FirstOrDefault(r => r.UserId == userId);

        return Ok(new RatingAggregateDto
        {
            AverageRating = ratings.Any() ? Math.Round(ratings.Average(r => r.Value), 1) : 0,
            TotalRatings = ratings.Count,
            UserRating = userRating?.Value
        });
    }
}
