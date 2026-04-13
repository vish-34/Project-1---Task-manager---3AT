public class TaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public List <TaskItem> GetTasks(int userId)
    {
        return _context.Tasks.Where(t => t.UserId == userId).ToList();
    }

    public TaskItem AddTask(string title , int userId)
    {
        var task = new TaskItem
        {
            Title = title,
            IsCompleted = false,
            UserId = userId
        };

        _context.Tasks.Add(task);
        _context.SaveChanges();

        return task;
    }

    public bool DeleteTask(int id, int userid)
    {
        var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.UserId == userid);
        if(task == null) return false;

        _context.Tasks.Remove(task);
        _context.SaveChanges();
        return true;
    }

    public bool UpdateTask(int id, bool isCompleted, int userId)
    {
        var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.UserId == userId);
        if(task == null) return false;

        task.IsCompleted = isCompleted;
        _context.SaveChanges();
        return true;
    }
}