using Server.Models;

namespace Server.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllCategoriesAsync();
    Task<Category?> GetCategoryByIdAsync(Guid id);
    Task<Category> CreateCategoryAsync(Category category);
    Task UpdateCategoryAsync(Category category);
    Task DeleteCategoryAsync(Guid id);

    // Operations for junction table.
    Task<List<CategoryCohortCluster>> GetCategoryCohortClustersByIdAsync(Guid categoryId);
    Task<bool> CategoryCohortClusterExistsAsync(Guid categoryId, Guid cohortId, Guid clusterId);
    Task AddCategoryCohortClusterAsync(Guid categoryId, Guid cohortId, Guid clusterId);
    Task RemoveCategoryCohortClusterAsync(Guid categoryId, Guid cohortId, Guid clusterId);
    Task RemoveCohortFromCategoryAsync(Guid categoryId, Guid cohortId);

    // Additional method for querying.
    Task<List<CategoryCohortCluster>> GetCategoriesForCohort(Guid cohortId);

}