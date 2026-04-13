using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;

public class Authservice
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public Authservice (AppDbContext context , IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public string? Register ( string email, string password)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Email == email);
        if(existingUser != null) return null;

        var hashedpassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User
        {
            Email = email,
            Password = hashedpassword
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return "User Created";
   }

   public string? Login(string email, string password)
{
    var user = _context.Users.FirstOrDefault(u => u.Email == email);
    if (user == null) return null;

    bool isValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
    if (!isValid) return null;

    var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

   var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email)
};

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256)
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
}