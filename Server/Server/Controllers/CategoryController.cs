using Microsoft.AspNetCore.Mvc;
using Server.DataTransferObjects;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/Categories")]
public class CategoryController : ControllerBase
{
    private readonly CategoryService _service;

    public CategoryController(CategoryService service)
    {
        _service = service;
    }

    // GET: api/Categories
    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _service.GetAllCategoriesAsync();
        return Ok(categories);
    }

    // GET: api/Categories/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        var category = await _service.GetCategoryByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    // POST: api/Categories
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDTO dto)
    {
        var category = await _service.CreateCategoryAsync(dto);
        return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
    }

    // PUT: api/Categories/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryDTO dto)
    {
        var updated = await _service.UpdateCategoryAsync(id, dto);
        if (!updated) return NotFound();
        return NoContent();
    }

    // DELETE: api/Categories/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var deleted = await _service.DeleteCategoryAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}