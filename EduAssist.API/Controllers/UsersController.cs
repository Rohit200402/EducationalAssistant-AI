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
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    private string GetUserId() => User.FindFirstValue("userId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaginatedResponse<UserDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var query = _userManager.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(u => u.DisplayName.Contains(search) || u.Email!.Contains(search) || u.UserName!.Contains(search));

        var totalCount = await query.CountAsync();
        var users = await query.OrderByDescending(u => u.JoinedOn).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(MapToDto(user, roles.ToList()));
        }

        return Ok(new PaginatedResponse<UserDto>(userDtos, totalCount, pageNumber, pageSize));
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });
        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToDto(user, roles.ToList()));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> Create([FromBody] UserForCreate dto)
    {
        var user = new ApplicationUser
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DisplayName = dto.DisplayName,
            Email = dto.Email,
            UserName = dto.UserName,
            Institution = dto.Institution,
            Grade = dto.Grade,
            Bio = dto.Bio,
            DateOfBirth = dto.DateOfBirth,
            PreferredLanguage = dto.PreferredLanguage,
            EmailConfirmed = true,
            IsActive = true
        };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        await _userManager.AddToRoleAsync(user, dto.Role ?? "User");
        var roles = await _userManager.GetRolesAsync(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, MapToDto(user, roles.ToList()));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> Update(string id, [FromBody] UserForUpdate dto)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.DisplayName = dto.DisplayName;
        user.Institution = dto.Institution;
        user.Grade = dto.Grade;
        user.Bio = dto.Bio;
        user.DateOfBirth = dto.DateOfBirth;
        user.PreferredLanguage = dto.PreferredLanguage;
        user.IsActive = dto.IsActive;
        await _userManager.UpdateAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToDto(user, roles.ToList()));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });
        user.IsActive = false;
        await _userManager.UpdateAsync(user);
        return NoContent();
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var user = await _userManager.FindByIdAsync(GetUserId());
        if (user == null) return NotFound();
        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToDto(user, roles.ToList()));
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UserProfileUpdate dto)
    {
        var user = await _userManager.FindByIdAsync(GetUserId());
        if (user == null) return NotFound();
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.DisplayName = dto.DisplayName;
        user.Institution = dto.Institution;
        user.Grade = dto.Grade;
        user.Bio = dto.Bio;
        user.DateOfBirth = dto.DateOfBirth;
        user.PreferredLanguage = dto.PreferredLanguage;
        await _userManager.UpdateAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        return Ok(MapToDto(user, roles.ToList()));
    }

    private static UserDto MapToDto(ApplicationUser user, List<string> roles) => new()
    {
        Id = user.Id,
        UserName = user.UserName ?? "",
        Email = user.Email ?? "",
        FirstName = user.FirstName,
        LastName = user.LastName,
        DisplayName = user.DisplayName,
        Institution = user.Institution,
        Grade = user.Grade,
        Bio = user.Bio,
        DateOfBirth = user.DateOfBirth,
        JoinedOn = user.JoinedOn,
        LastActiveOn = user.LastActiveOn,
        IsActive = user.IsActive,
        PreferredLanguage = user.PreferredLanguage,
        TotalQueriesAsked = user.TotalQueriesAsked,
        Roles = roles
    };
}
