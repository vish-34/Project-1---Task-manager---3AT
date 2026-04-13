using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore.Storage;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly Authservice _service;

    public AuthController (Authservice service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public IActionResult Register (RegisterDto dto)
    {
        var result = _service.Register(dto.Email, dto.Password);

        if(result == null)
        return BadRequest("user already exist");

        return Ok(result);
    }

    [HttpPost("login")]
    public IActionResult Login (LoginDto dto)
    {
        var token = _service.Login(dto.Email, dto.Password);
        if(token == null)
        return Unauthorized("invalid credentials");

        return Ok(new {token});
    }
    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok ("you are authenticated");
    }
}