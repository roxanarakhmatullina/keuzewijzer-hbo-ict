using Microsoft.AspNetCore.Mvc;
using Server.DataTransferObjects;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryCohortClusterController : ControllerBase
{
    private readonly CategoryCohortClusterService _service;

    public CategoryCohortClusterController(CategoryCohortClusterService service)
    {
        _service = service;
    }

    // GET: api/CategoryCohortCluster
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var associations = await _service.GetAllAsync();
        return Ok(associations);
    }

    // GET: api/CategoryCohortCluster/{categoryId}/{cohortId}
    [HttpGet("{categoryId}/{cohortId}")]
    public async Task<IActionResult> GetClustersByCategoryAndCohort(Guid categoryId, Guid cohortId)
    {
        var clusters = await _service.GetClustersByCategoryAndCohortAsync(categoryId, cohortId);
        return Ok(clusters);
    }

    // POST: api/CategoryCohortCluster
    [HttpPost]
    public async Task<IActionResult> AddClustersToCategoryAndCohort([FromBody] CategoryCohortClusterDTO dto)
    {
        await _service.AddClustersToCategoryAndCohortAsync(dto.CategoryId, dto.CohortId, dto.ClusterIds);
        return Ok();
    }

    // DELETE: api/CategoryCohortCluster/{categoryId}/{cohortId}
    [HttpDelete("{categoryId}/{cohortId}")]
    public async Task<IActionResult> DeleteClustersFromCategoryAndCohort(Guid categoryId, Guid cohortId)
    {
        await _service.DeleteClustersFromCategoryAndCohortAsync(categoryId, cohortId);
        return NoContent();
    }
}