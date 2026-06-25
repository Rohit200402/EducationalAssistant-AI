using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using EduAssist.API.Models;
namespace EduAssist.API.Data;
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<Category> Categories { get; set; }
    public DbSet<UserRequest> UserRequests { get; set; }
    public DbSet<AIResponse> AIResponses { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<UserRequest>().HasOne(ur => ur.Category).WithMany(c => c.UserRequests).HasForeignKey(ur => ur.CategoryId);
        builder.Entity<AIResponse>().HasOne(ar => ar.UserRequest).WithMany(ur => ur.AIResponses).HasForeignKey(ar => ar.UserRequestId);
        builder.Entity<Bookmark>().HasOne(b => b.AIResponse).WithMany().HasForeignKey(b => b.AIResponseId);
        builder.Entity<UserRequest>().HasIndex(ur => ur.UserId);
        builder.Entity<Bookmark>().HasIndex(b => b.UserId);
    }
}
