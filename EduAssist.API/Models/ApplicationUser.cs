using Microsoft.AspNetCore.Identity;
namespace EduAssist.API.Models;
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public DateTime JoinedOn { get; set; } = DateTime.UtcNow;
    public DateTime LastActiveOn { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public string PreferredLanguage { get; set; } = "English";
    public int TotalQueriesAsked { get; set; } = 0;
}
