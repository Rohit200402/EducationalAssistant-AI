namespace EduAssist.API.DTOs;
public record LoginRequest(string Email, string Password);
public record RegisterRequest(string FirstName, string LastName, string DisplayName, string Email, string UserName, string Password, string ConfirmPassword, string Institution, string Grade, string PreferredLanguage);
public class AuthResponse { public string Token { get; set; } = ""; public DateTime Expiration { get; set; } public string UserId { get; set; } = ""; public string Email { get; set; } = ""; public string DisplayName { get; set; } = ""; public List<string> Roles { get; set; } = new(); }
