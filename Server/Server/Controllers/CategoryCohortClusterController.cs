using Microsoft.AspNetCore.Mvc;
using Server.DataTransferObjects;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/Categories")]
public class CategoryCohortClusterController : ControllerBase
{
    private readonly CategoryCohortClusterService _service;
    private readonly CategoryService _categoryService;

    public CategoryCohortClusterController(CategoryCohortClusterService service, CategoryService categoryService)
    {
        _service = service;
        _categoryService = categoryService;
    }

    // GET: /api/Categories/{categoryId}/cohorts/{cohortId}/clusters
    [HttpGet("{categoryId}/cohorts/{cohortId}/clusters")]
    public async Task<IActionResult> GetClustersByCategoryAndCohort(Guid categoryId, Guid cohortId)
    {
        try
        {
            // Validate that category exists
            var category = await _categoryService.GetCategoryByIdAsync(categoryId);
            if (category == null)
                return NotFound(new { message = "Category not found" });
                
            var clusters = await _service.GetClustersByCategoryAndCohortAsync(categoryId, cohortId);
            return Ok(clusters);
        }
        catch (Exception ex)
        {
            // Log exception
            return StatusCode(500, new { message = "An error occurred processing your request" });
        }
    }

    // POST: /api/Categories/{categoryId}/cohorts/{cohortId}/clusters
    [HttpPost("{categoryId}/cohorts/{cohortId}/clusters")]
    // [Authorize(Roles = "Admin,Maintainer")]
    public async Task<IActionResult> AddClustersToCategoryAndCohort(
        Guid categoryId, 
        Guid cohortId, 
        [FromBody] ClusterIdsDTO dto)
    {
        try
        {
            await _service.AddClustersToCategoryAndCohortAsync(categoryId, cohortId, dto.ClusterIds);
            return CreatedAtAction(
                nameof(GetClustersByCategoryAndCohort), 
                new { categoryId, cohortId }, 
                null);
        }
        catch (Exception ex)
        {
            // Log exception
            return StatusCode(500, new { message = "An error occurred processing your request" });
        }
    }

    // DELETE: /api/Categories/{categoryId}/cohorts/{cohortId}/clusters
    [HttpDelete("{categoryId}/cohorts/{cohortId}/clusters")]
    // [Authorize(Roles = "Admin,Maintainer")]
    public async Task<IActionResult> DeleteClustersFromCategoryAndCohort(Guid categoryId, Guid cohortId)
    {
        try
        {
            await _service.DeleteClustersFromCategoryAndCohortAsync(categoryId, cohortId);
            return NoContent();
        }
        catch (Exception ex)
        {
            // Log exception
            return StatusCode(500, new { message = "An error occurred processing your request" });
        }
    }
}