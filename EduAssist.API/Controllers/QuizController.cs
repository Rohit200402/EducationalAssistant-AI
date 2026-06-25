using System.Security.Claims;
using EduAssist.API.DTOs;
using EduAssist.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;
    public QuizController(IQuizService quizService) { _quizService = quizService; }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpPost("generate")]
    public async Task<ActionResult<QuizDetailDto>> Generate([FromBody] QuizGenerateDto dto)
    {
        try
        {
            var result = await _quizService.GenerateQuizAsync(GetUserId(), dto.CategoryId, dto.Topic, dto.NumberOfQuestions, dto.Difficulty);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<QuizListDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _quizService.GetUserQuizzesAsync(GetUserId(), pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuizDetailDto>> GetById(int id)
    {
        var result = await _quizService.GetQuizByIdAsync(id, GetUserId());
        if (result == null) return NotFound(new { message = "Quiz not found." });
        return Ok(result);
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult<QuizResultDto>> Submit(int id, [FromBody] QuizSubmitDto dto)
    {
        var result = await _quizService.SubmitQuizAsync(id, GetUserId(), dto);
        if (result == null) return NotFound(new { message = "Quiz not found." });
        return Ok(result);
    }

    [HttpGet("{id}/results")]
    public async Task<ActionResult<QuizResultDto>> GetResults(int id)
    {
        var result = await _quizService.GetQuizResultsAsync(id, GetUserId());
        if (result == null) return NotFound(new { message = "No results found for this quiz." });
        return Ok(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaginatedResponse<AdminQuizListDto>>> GetAllAdmin([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _quizService.GetAllQuizzesAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<QuizStatsDto>> GetStats()
    {
        var result = await _quizService.GetQuizStatsAsync();
        return Ok(result);
    }
}
