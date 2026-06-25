using EduAssist.API.Data;
using EduAssist.API.DTOs;
using EduAssist.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EduAssist.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public CategoriesController(ApplicationDbContext context) { _context = context; }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<CategoryDto>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? search = null)
    {
        var query = _context.Categories.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.SubjectName.Contains(search));
        var totalCount = await query.CountAsync();
        var items = await query.OrderBy(c => c.SubjectName).Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .Select(c => new CategoryDto(c.CategoryId, c.SubjectName, c.Description, c.SystemPrompt)).ToListAsync();
        return Ok(new PaginatedResponse<CategoryDto>(items, totalCount, pageNumber, pageSize));
    }

    [HttpGet("all")]
    public async Task<ActionResult<List<CategoryDto>>> GetAllNoPagination()
    {
        var categories = await _context.Categories.OrderBy(c => c.SubjectName)
            .Select(c => new CategoryDto(c.CategoryId, c.SubjectName, c.Description, c.SystemPrompt)).ToListAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound(new { message = "Category not found." });
        return Ok(new CategoryDto(category.CategoryId, category.SubjectName, category.Description, category.SystemPrompt));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CategoryForCreate dto)
    {
        if (await _context.Categories.AnyAsync(c => c.SubjectName == dto.SubjectName))
            return BadRequest(new { message = "Category already exists." });
        var category = new Category { SubjectName = dto.SubjectName, Description = dto.Description, SystemPrompt = dto.SystemPrompt };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = category.CategoryId }, new CategoryDto(category.CategoryId, category.SubjectName, category.Description, category.SystemPrompt));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDto>> Update(int id, [FromBody] CategoryForUpdate dto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound(new { message = "Category not found." });
        if (await _context.Categories.AnyAsync(c => c.SubjectName == dto.SubjectName && c.CategoryId != id))
            return BadRequest(new { message = "Category name already exists." });
        category.SubjectName = dto.SubjectName;
        category.Description = dto.Description;
        category.SystemPrompt = dto.SystemPrompt;
        await _context.SaveChangesAsync();
        return Ok(new CategoryDto(category.CategoryId, category.SubjectName, category.Description, category.SystemPrompt));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound(new { message = "Category not found." });
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
