using Server.Models;
using Server.Repositories;

namespace Server.Services;

public class CategoryCohortClusterService
{
    private readonly CategoryCohortClusterRepository _repository;

    public CategoryCohortClusterService(CategoryCohortClusterRepository repository)
    {
        _repository = repository;
    }

    // Get all associations
    public async Task<List<CategoryCohortCluster>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    // Get clusters by Category and Cohort
    public async Task<List<Cluster>> GetClustersByCategoryAndCohortAsync(Guid categoryId, Guid cohortId)
    {
        var associations = await _repository.GetByCategoryAndCohortAsync(categoryId, cohortId);
        return associations.Select(ccc => ccc.Cluster).ToList();
    }

    // Add multiple associations
    public async Task AddClustersToCategoryAndCohortAsync(Guid categoryId, Guid cohortId, List<Guid> clusterIds)
    {
        var categoryCohortClusters = clusterIds.Select(clusterId => new CategoryCohortCluster
        {
            Id = Guid.NewGuid(),
            CategoryId = categoryId,
            CohortId = cohortId,
            ClusterId = clusterId
        }).ToList();

        await _repository.AddRangeAsync(categoryCohortClusters);
    }

    // Delete associations by Category and Cohort
    public async Task DeleteClustersFromCategoryAndCohortAsync(Guid categoryId, Guid cohortId)
    {
        await _repository.DeleteByCategoryAndCohortAsync(categoryId, cohortId);
    }
}