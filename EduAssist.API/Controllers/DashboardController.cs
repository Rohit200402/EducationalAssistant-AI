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
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public DashboardController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _context = context;
        _userManager = userManager;
        _configuration = configuration;
    }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AdminDashboardStats>> GetAdminStats()
    {
        var today = DateTime.UtcNow.Date;
        var stats = new AdminDashboardStats
        {
            TotalUsers = await _userManager.Users.CountAsync(),
            TotalRequests = await _context.UserRequests.CountAsync(),
            TotalResponses = await _context.AIResponses.CountAsync(),
            TotalCategories = await _context.Categories.CountAsync(),
            ActiveUsersToday = await _userManager.Users.CountAsync(u => u.LastActiveOn >= today),
            RequestsToday = await _context.UserRequests.CountAsync(r => r.RequestedOn >= today),
            RecentRequests = await _context.UserRequests.Include(r => r.Category).Include(r => r.AIResponses)
                .OrderByDescending(r => r.RequestedOn).Take(5)
                .Select(r => new DashboardRequest
                {
                    UserRequestId = r.UserRequestId,
                    Query = r.Query,
                    CategoryName = r.Category.SubjectName,
                    RequestedOn = r.RequestedOn,
                    HasResponse = r.AIResponses.Any()
                }).ToListAsync()
        };
        return Ok(stats);
    }

    [HttpGet("user")]
    public async Task<ActionResult<UserDashboardStats>> GetUserStats()
    {
        var userId = GetUserId();
        var today = DateTime.UtcNow.Date;
        var weekAgo = today.AddDays(-7);
        var dailyLimit = int.Parse(_configuration["RateLimiting:StudentDailyLimit"] ?? "20");
        var todayCount = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= today);

        var stats = new UserDashboardStats
        {
            TotalQuestions = await _context.UserRequests.CountAsync(r => r.UserId == userId),
            TotalBookmarks = await _context.Bookmarks.CountAsync(b => b.UserId == userId),
            QuestionsThisWeek = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= weekAgo),
            RemainingQuota = Math.Max(0, dailyLimit - todayCount),
            DailyLimit = dailyLimit,
            CurrentStreak = await CalculateStreak(userId),
            RecentQuestions = await _context.UserRequests.Include(r => r.Category).Include(r => r.AIResponses)
                .Where(r => r.UserId == userId).OrderByDescending(r => r.RequestedOn).Take(5)
                .Select(r => new DashboardRequest
                {
                    UserRequestId = r.UserRequestId,
                    Query = r.Query,
                    CategoryName = r.Category.SubjectName,
                    RequestedOn = r.RequestedOn,
                    HasResponse = r.AIResponses.Any()
                }).ToListAsync(),
            TopCategories = await _context.UserRequests.Where(r => r.UserId == userId)
                .GroupBy(r => r.Category.SubjectName)
                .Select(g => new DashboardCategory { CategoryName = g.Key, Count = g.Count() })
                .OrderByDescending(c => c.Count).Take(5).ToListAsync()
        };
        return Ok(stats);
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
}
