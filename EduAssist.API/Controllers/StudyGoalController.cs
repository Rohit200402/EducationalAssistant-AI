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
public class StudyGoalController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public StudyGoalController(ApplicationDbContext context) { _context = context; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    public async Task<ActionResult<StudyGoalDto>> Get()
    {
        var userId = GetUserId();
        var goal = await _context.StudyGoals.FirstOrDefaultAsync(g => g.UserId == userId);

        var today = DateTime.UtcNow.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);

        var questionsToday = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= today);
        var questionsThisWeek = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= weekStart);

        if (goal == null)
        {
            return Ok(new StudyGoalDto
            {
                GoalId = 0,
                DailyTarget = 5,
                WeeklyTarget = 25,
                QuestionsToday = questionsToday,
                QuestionsThisWeek = questionsThisWeek,
                UpdatedAt = DateTime.UtcNow
            });
        }

        return Ok(new StudyGoalDto
        {
            GoalId = goal.GoalId,
            DailyTarget = goal.DailyTarget,
            WeeklyTarget = goal.WeeklyTarget,
            QuestionsToday = questionsToday,
            QuestionsThisWeek = questionsThisWeek,
            UpdatedAt = goal.UpdatedAt
        });
    }

    [HttpPut]
    public async Task<ActionResult<StudyGoalDto>> Update([FromBody] StudyGoalForUpdate dto)
    {
        var userId = GetUserId();
        var goal = await _context.StudyGoals.FirstOrDefaultAsync(g => g.UserId == userId);

        if (goal == null)
        {
            goal = new StudyGoal
            {
                UserId = userId,
                DailyTarget = dto.DailyTarget,
                WeeklyTarget = dto.WeeklyTarget,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.StudyGoals.Add(goal);
        }
        else
        {
            goal.DailyTarget = dto.DailyTarget;
            goal.WeeklyTarget = dto.WeeklyTarget;
            goal.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        var today = DateTime.UtcNow.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        var questionsToday = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= today);
        var questionsThisWeek = await _context.UserRequests.CountAsync(r => r.UserId == userId && r.RequestedOn >= weekStart);

        return Ok(new StudyGoalDto
        {
            GoalId = goal.GoalId,
            DailyTarget = goal.DailyTarget,
            WeeklyTarget = goal.WeeklyTarget,
            QuestionsToday = questionsToday,
            QuestionsThisWeek = questionsThisWeek,
            UpdatedAt = goal.UpdatedAt
        });
    }
}
