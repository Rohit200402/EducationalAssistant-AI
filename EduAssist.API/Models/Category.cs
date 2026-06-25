namespace EduAssist.API.Models;
public class Category
{
    public int CategoryId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public ICollection<UserRequest> UserRequests { get; set; } = new List<UserRequest>();
}
