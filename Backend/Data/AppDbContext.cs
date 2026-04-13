using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base (options) {}
    public DbSet<User> Users {get; set;}
    public DbSet<TaskItem> Tasks {get; set;}
}