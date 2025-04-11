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
    Task<List<CategoryCohortCluster>> GetCategoryCohortClustersByCategoryIdAsync(Guid categoryId);
    Task<bool> CategoryCohortClusterExistsAsync(Guid categoryId, Guid cohortId, Guid clusterId);
    Task AddCategoryCohortClusterAsync(CategoryCohortCluster categoryCohortCluster);
    Task RemoveCategoryCohortClusterAsync(Guid categoryId, Guid cohortId, Guid clusterId);
    Task RemoveCohortFromCategoryAsync(Guid categoryId, Guid cohortId);

    // Additional method for querying.
    // Show categories with clusters for selected cohort.
    Task<List<CategoryCohortCluster>> GetCategoriesForCohort(Guid cohortId);

}