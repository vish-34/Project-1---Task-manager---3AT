using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TaskController : ControllerBase
{
    private readonly TaskService _service;
    public TaskController (TaskService service)
    {
        _service = service;
    }

   private int GetUserId()
{
    var claim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (claim == null)
        throw new Exception("User ID not found in token");

    return int.Parse(claim.Value);
}

    [HttpGet]
    public IActionResult GetTask([FromQuery] DateTime date)
    {
        var task = _service.GetTasks(GetUserId(), date);
        return Ok(task);
    }

    [HttpPost]
    public IActionResult AddTask(TaskDto dto)
    {
        var task = _service.AddTask(dto.Title, GetUserId(), dto.TaskDate);
        return Ok(task);
    }

    [HttpPut("{id}")]
    public IActionResult Update (int id , [FromQuery] bool isCompleted)
    {
        if(!_service.UpdateTask(id, isCompleted, GetUserId()))
        return NotFound();
        return Ok ("Updated");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if(!_service.DeleteTask(id, GetUserId()))
        return NotFound();

        return Ok("Deleted");
    }
}



