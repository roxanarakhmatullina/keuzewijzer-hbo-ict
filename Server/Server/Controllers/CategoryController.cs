using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.DataTransferObjects;
using Server.Exceptions;
using Server.Services.Interfaces;

namespace Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: api/Categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    // GET: api/Categories/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDetailDTO>> GetCategory(Guid id)
    {
        try
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(category);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // POST: api/Categories
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CategoryDetailDTO>> CreateCategory(CategoryCreateUpdateDTO dto)
    {
        try
        {
            var result = await _categoryService.CreateCategoryAsync(dto);
            return CreatedAtAction(nameof(GetCategory), new { id = result.Id }, result);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT: api/Categories/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<CategoryDetailDTO>> UpdateCategory(Guid id, CategoryCreateUpdateDTO dto)
    {
        try
        {
            var result = await _categoryService.UpdateCategoryAsync(id, dto);
            return Ok(result);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/Categories/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        try
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
    
    // POST: api/Categories/{categoryId}/Cohorts/{cohortId}/Clusters
    [HttpPost("{categoryId}/Cohorts/{cohortId}/Clusters")]
    [Authorize]
    public async Task<IActionResult> AddClustersToCohortCategory(Guid categoryId, Guid cohortId, AddClustersDTO dto)
    {
        try
        {
            await _categoryService.AddClustersToCohortCategoryAsync(categoryId, cohortId, dto);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    // DELETE: api/Categories/{categoryId}/Cohorts/{cohortId}/Clusters/{clusterId}
    [HttpDelete("{categoryId}/Cohorts/{cohortId}/Clusters/{clusterId}")]
    [Authorize]
    public async Task<IActionResult> RemoveClusterFromCohortCategory(Guid categoryId, Guid cohortId, Guid clusterId)
    {
        try
        {
            await _categoryService.RemoveClusterFromCohortCategoryAsync(categoryId, cohortId, clusterId);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
    
    // DELETE: api/Categories/{categoryId}/Cohorts/{cohortId}
    [HttpDelete("{categoryId}/Cohorts/{cohortId}")]
    [Authorize]
    public async Task<IActionResult> RemoveCohortFromCategory(Guid categoryId, Guid cohortId)
    {
        try
        {
            await _categoryService.RemoveCohortFromCategoryAsync(categoryId, cohortId);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    // GET: api/Categories/cohort/{cohortId}
    [HttpGet("cohort/{cohortId}")]
    public async Task<ActionResult<IEnumerable<CategoryDetailDTO>>> GetCategoriesForCohort(Guid cohortId)
    {
        try
        {
            var categories = await _categoryService.GetCategoriesForCohortAsync(cohortId);
            return Ok(categories);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}