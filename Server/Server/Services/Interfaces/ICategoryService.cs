using Server.DataTransferObjects;

namespace Server.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDTO>> GetAllCategoriesAsync();
    Task<CategoryDetailDTO> GetCategoryByIdAsync(Guid id);
    Task<CategoryDetailDTO> CreateCategoryAsync(CategoryCreateUpdateDTO dto);
    Task<CategoryDetailDTO> UpdateCategoryAsync(Guid id, CategoryCreateUpdateDTO dto);
    Task DeleteCategoryAsync(Guid id);

    // Methods for adding and removing specific clusters.
    Task AddClustersToCohortCategoryAsync(Guid categoryId, Guid cohortId, AddClustersDTO dto);
    Task RemoveClusterFromCohortCategoryAsync(Guid categoryId, Guid cohortId, Guid clusterId);
    Task RemoveCohortFromCategoryAsync(Guid categoryId, Guid cohortId);

    // Show only the categories with clusters for selected cohort.
    Task<List<CategoryDetailDTO>> GetCategoriesForCohortAsync(Guid cohortId);
}