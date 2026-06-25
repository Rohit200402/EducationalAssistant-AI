using Microsoft.EntityFrameworkCore;
using EduAssist.API.Models;

namespace EduAssist.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Category> Categories { get; set; }
    public DbSet<UserRequest> UserRequests { get; set; }
    public DbSet<AIResponse> AIResponses { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationMessage> ConversationMessages { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<QuizQuestion> QuizQuestions { get; set; }
    public DbSet<QuizAttempt> QuizAttempts { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<StudyGoal> StudyGoals { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<UserRequest>().HasOne(ur => ur.Category).WithMany(c => c.UserRequests).HasForeignKey(ur => ur.CategoryId);
        builder.Entity<AIResponse>().HasOne(ar => ar.UserRequest).WithMany(ur => ur.AIResponses).HasForeignKey(ar => ar.UserRequestId);
        builder.Entity<Bookmark>().HasOne(b => b.AIResponse).WithMany().HasForeignKey(b => b.AIResponseId);
        builder.Entity<UserRequest>().HasIndex(ur => ur.UserId);
        builder.Entity<Bookmark>().HasIndex(b => b.UserId);

        // Conversation relationships
        builder.Entity<Conversation>().HasOne(c => c.Category).WithMany().HasForeignKey(c => c.CategoryId);
        builder.Entity<Conversation>().HasIndex(c => c.UserId);
        builder.Entity<ConversationMessage>().HasKey(m => m.MessageId);
        builder.Entity<ConversationMessage>().HasOne(m => m.Conversation).WithMany(c => c.Messages).HasForeignKey(m => m.ConversationId).OnDelete(DeleteBehavior.Cascade);

        // Quiz relationships
        builder.Entity<Quiz>().HasOne(q => q.Category).WithMany().HasForeignKey(q => q.CategoryId);
        builder.Entity<Quiz>().HasIndex(q => q.UserId);
        builder.Entity<QuizQuestion>().HasKey(qq => qq.QuestionId);
        builder.Entity<QuizQuestion>().HasOne(qq => qq.Quiz).WithMany(q => q.Questions).HasForeignKey(qq => qq.QuizId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<QuizAttempt>().HasKey(qa => qa.AttemptId);
        builder.Entity<QuizAttempt>().HasOne(qa => qa.Quiz).WithMany(q => q.Attempts).HasForeignKey(qa => qa.QuizId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<QuizAttempt>().HasIndex(qa => qa.UserId);

        // Rating relationships
        builder.Entity<Rating>().HasOne(r => r.AIResponse).WithMany().HasForeignKey(r => r.AIResponseId);
        builder.Entity<Rating>().HasIndex(r => new { r.UserId, r.AIResponseId }).IsUnique();

        // Notification
        builder.Entity<Notification>().HasIndex(n => n.UserId);

        // StudyGoal
        builder.Entity<StudyGoal>().HasIndex(sg => sg.UserId).IsUnique();
    }
}
