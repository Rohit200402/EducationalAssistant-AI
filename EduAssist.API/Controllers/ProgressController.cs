using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProgressController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    public ProgressController(ApplicationDbContext context, UserManager<ApplicationUser> userManager) { _context = context; _userManager = userManager; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    public async Task<ActionResult<ProgressStats>> GetProgress()
    {
        var userId = GetUserId();
        var today = DateTime.UtcNow.Date;
        var weekAgo = today.AddDays(-7);
        var monthAgo = today.AddDays(-30);

        var totalQuestions = await _context.UserRequests.CountAsync(r => r.UserId == userId);
        var questionsThisWeek = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= weekAgo);
        var questionsThisMonth = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= monthAgo);

        var categoryBreakdown = await _context.UserRequests.Where(r => r.UserId == userId)
            .GroupBy(r => new { r.CategoryId, r.Category.SubjectName })
            .Select(g => new CategoryBreakdown
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.SubjectName,
                QuestionCount = g.Count(),
                Percentage = totalQuestions > 0 ? Math.Round((double)g.Count() / totalQuestions * 100, 1) : 0
            }).OrderByDescending(c => c.QuestionCount).ToListAsync();

        var recentActivity = await _context.UserRequests.Where(r => r.UserId == userId && r.RequestedOn >= monthAgo)
            .GroupBy(r => r.RequestedOn.Date)
            .Select(g => new RecentActivity { Date = g.Key, QuestionCount = g.Count() })
            .OrderByDescending(a => a.Date).ToListAsync();

        var currentStreak = await CalculateStreak(userId);
        var longestStreak = await CalculateLongestStreak(userId);

        return Ok(new ProgressStats
        {
            TotalQuestions = totalQuestions,
            QuestionsThisWeek = questionsThisWeek,
            QuestionsThisMonth = questionsThisMonth,
            CurrentStreak = currentStreak,
            LongestStreak = longestStreak,
            CategoryBreakdown = categoryBreakdown,
            RecentActivity = recentActivity
        });
    }

    private async Task<int> CalculateStreak(string userId)
    {
        var dates = await _context.UserRequests.Where(r => r.UserId == userId)
            .Select(r => r.RequestedOn.Date).Distinct().OrderByDescending(d => d).ToListAsync();
        if (!dates.Any()) return 0;
        int streak = 0;
        var expectedDate = DateTime.UtcNow.Date;
        foreach (var date in dates)
        {
            if (date == expectedDate || date == expectedDate.AddDays(-1))
            {
                streak++;
                expectedDate = date.AddDays(-1);
            }
            else break;
        }
        return streak;
    }

    private async Task<int> CalculateLongestStreak(string userId)
    {
        var dates = await _context.UserRequests.Where(r => r.UserId == userId)
            .Select(r => r.RequestedOn.Date).Distinct().OrderBy(d => d).ToListAsync();
        if (!dates.Any()) return 0;
        int longest = 1, current = 1;
        for (int i = 1; i < dates.Count; i++)
        {
            if (dates[i] == dates[i - 1].AddDays(1)) { current++; longest = Math.Max(longest, current); }
            else current = 1;
        }
        return longest;
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<List<LeaderboardDto>>> GetLeaderboard()
    {
        var userGroups = await _context.UserRequests
            .GroupBy(r => r.UserId)
            .Select(g => new { UserId = g.Key, TotalQuestions = g.Count() })
            .OrderByDescending(x => x.TotalQuestions)
            .Take(10)
            .ToListAsync();

        var leaderboard = new List<LeaderboardDto>();
        int rank = 1;
        foreach (var ug in userGroups)
        {
            var user = await _userManager.FindByIdAsync(ug.UserId);
            var topCategory = await _context.UserRequests
                .Where(r => r.UserId == ug.UserId)
                .GroupBy(r => r.Category.SubjectName)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefaultAsync() ?? "N/A";

            leaderboard.Add(new LeaderboardDto
            {
                Rank = rank++,
                DisplayName = user?.DisplayName ?? "Unknown",
                TotalQuestions = ug.TotalQuestions,
                TopCategory = topCategory
            });
        }

        return Ok(leaderboard);
    }
}
