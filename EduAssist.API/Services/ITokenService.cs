using EduAssist.API.Models;
namespace EduAssist.API.Services;
public interface ITokenService
{
    string GenerateToken(ApplicationUser user, IList<string> roles);
}
