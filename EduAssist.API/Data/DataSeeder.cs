using EduAssist.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EduAssist.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        // Seed Identity data (stored in AuthDbContext / EduAssistAuthDb)
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        string[] roles = { "Admin", "User" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }
        var adminEmail = "admin@eduassist.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin",
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                DisplayName = "Administrator",
                EmailConfirmed = true,
                IsActive = true
            };
            await userManager.CreateAsync(admin, "Admin@123");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Seed Core data (stored in ApplicationDbContext / EduAssistDb)
        var appContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
        if (!await appContext.Categories.AnyAsync())
        {
            appContext.Categories.AddRange(
                new Category { SubjectName = "Mathematics" },
                new Category { SubjectName = "Science" },
                new Category { SubjectName = "English" },
                new Category { SubjectName = "History" },
                new Category { SubjectName = "Computer Science" }
            );
            await appContext.SaveChangesAsync();
        }
    }
}
