using EduAssist.API.DTOs;
using EduAssist.API.Models;
using EduAssist.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
            return Unauthorized(new { message = "Invalid email or password." });

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid email or password." });

        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateToken(user, roles);

        user.LastActiveOn = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddMinutes(60),
            UserId = user.Id,
            Email = user.Email ?? "",
            DisplayName = user.DisplayName,
            Roles = roles.ToList()
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match." });

        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "Email is already registered." });

        var existingUserName = await _userManager.FindByNameAsync(request.UserName);
        if (existingUserName != null)
            return BadRequest(new { message = "Username is already taken." });

        var user = new ApplicationUser
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            DisplayName = request.DisplayName,
            Email = request.Email,
            UserName = request.UserName,
            Institution = request.Institution,
            Grade = request.Grade,
            PreferredLanguage = request.PreferredLanguage,
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

        await _userManager.AddToRoleAsync(user, "User");
        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateToken(user, roles);

        return Ok(new AuthResponse
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddMinutes(60),
            UserId = user.Id,
            Email = user.Email ?? "",
            DisplayName = user.DisplayName,
            Roles = roles.ToList()
        });
    }
}
