public class TaskItem
{
    public int Id {get; set;}
    public string Title {get; set;} = string.Empty;
    public DateTime TaskDate {get; set; }
    public bool IsCompleted {get; set;}
    public int UserId {get; set; }

}