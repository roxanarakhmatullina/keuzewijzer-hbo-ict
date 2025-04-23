using Server.Services.Interfaces;
using Server.Repositories.Interfaces;
using Server.Data;
using Server.DataTransferObjects;
using Server.Exceptions;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly DataContext _context;

    public CategoryService(ICategoryRepository categoryRepository, DataContext context)
    {
        _categoryRepository = categoryRepository;
        _context = context;
    }

    public async Task<List<CategoryDTO>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllCategoriesAsync();
        
        return categories.Select(c => new CategoryDTO 
        { 
            Id = c.Id, 
            Name = c.Name 
        }).ToList();
    }

    public async Task<CategoryDetailDTO> GetCategoryByIdAsync(Guid id)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null)
            throw new NotFoundException($"Category with ID {id} not found");
        
        var junctions = await _categoryRepository.GetCategoryCohortClustersByCategoryIdAsync(id);
        
        // Gorup by cohort
        var cohortClusters = junctions
            .GroupBy(j => new { j.CohortId, CohortName = j.Cohort.Name })
            .Select(group => new CohortClustersDetailDTO
            {
                CohortId = group.Key.CohortId,
                CohortName = group.Key.CohortName,
                Clusters = group.Select(j => new ClusterDetailDTO
                {
                    Id = j.ClusterId,
                    Name = j.Cluster.Name
                }).ToList()
            }).ToList();
        
        return new CategoryDetailDTO
        {
            Id = category.Id,
            Name = category.Name,
            CohortClusters = cohortClusters
        };
    }

    public async Task<CategoryDetailDTO> CreateCategoryAsync(CategoryCreateUpdateDTO dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            var existingWithName = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower());
                
            if (existingWithName != null)
                throw new BadRequestException($"Category with name '{dto.Name}' already exists");
            
            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };
            
            await _categoryRepository.CreateCategoryAsync(category);
            
            // Category associations.
            foreach (var cohortCluster in dto.CohortClusters)
            {
                var cohortId = cohortCluster.CohortId;
                
                var cohort = await _context.Cohorts.FindAsync(cohortId);
                if (cohort == null)
                    throw new BadRequestException($"Cohort with ID {cohortId} does not exist");
                
                foreach (var clusterId in cohortCluster.ClusterIds)
                {
                    // Check if cluster exists and belongs to cohort.
                    var clusterBelongsToCohort = await _context.Clusters
                        .Where(c => c.Id == clusterId)
                        .SelectMany(c => c.Cohorts)
                        .AnyAsync(c => c.Id == cohortId);
                    
                    if (!clusterBelongsToCohort)
                        throw new BadRequestException($"Cluster {clusterId} does not exist or is not associated with cohort {cohortId}");
                    
                    var junction = new CategoryCohortCluster
                    {
                        Id = Guid.NewGuid(),
                        CategoryId = category.Id,
                        CohortId = cohortId,
                        ClusterId = clusterId
                    };
                    
                    await _categoryRepository.AddCategoryCohortClusterAsync(junction);
                }
            }
            
            await transaction.CommitAsync();
            
            return await GetCategoryByIdAsync(category.Id);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            
            if (ex is BadRequestException || ex is NotFoundException)
                throw;
                
            // Possible placeholder for logger.
            // _logger.LogError(ex, "Error creating category");
            
            throw new Exception("An error occurred while creating the category", ex);
        }
    }

    public async Task<CategoryDetailDTO> UpdateCategoryAsync(Guid id, CategoryCreateUpdateDTO dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null)
                throw new NotFoundException($"Category with ID {id} not found");
            
            // Check name uniqueness if name changed.
            if (category.Name.ToLower() != dto.Name.ToLower())
            {
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower() && c.Id != id);
                    
                if (existingCategory != null)
                    throw new BadRequestException($"Category with name '{dto.Name}' already exists");
            }
            
            // Basic props update.
            category.Name = dto.Name;
            await _categoryRepository.UpdateCategoryAsync(category);
            
            var existingJunctions = await _categoryRepository.GetCategoryCohortClustersByCategoryIdAsync(id);
            
            // Create sets for comparison.
            var existingAssociations = existingJunctions
                .Select(j => new CategoryAssociation 
                { 
                    CohortId = j.CohortId, 
                    ClusterId = j.ClusterId 
                })
                .ToHashSet(new AssociationComparer());
            
            var requestedAssociations = new HashSet<(Guid CohortId, Guid ClusterId)>();
            
            // Build set of requested associations and validate.
            foreach (var cohortCluster in dto.CohortClusters)
            {
                var cohortId = cohortCluster.CohortId;
                
                var cohort = await _context.Cohorts.FindAsync(cohortId);
                if (cohort == null)
                    throw new BadRequestException($"Cohort with ID {cohortId} does not exist");
                
                foreach (var clusterId in cohortCluster.ClusterIds)
                {
                    var clusterExists = await _context.Clusters
                        .Where(c => c.Id == clusterId)
                        .SelectMany(c => c.Cohorts)
                        .AnyAsync(c => c.Id == cohortId);
                    
                    if (!clusterExists)
                        throw new BadRequestException($"Cluster {clusterId} does not exist or is not associated with cohort {cohortId}");
                    
                    requestedAssociations.Add((cohortId, clusterId));
                }
            }
            
            // Remove associations that are no longer needed.
            foreach (var junction in existingJunctions)
            {
                if (!requestedAssociations.Contains((junction.CohortId, junction.ClusterId)))
                {
                    await _categoryRepository.RemoveCategoryCohortClusterAsync(
                        id, junction.CohortId, junction.ClusterId);
                }
            }
            
            // Add new associations.
            foreach (var (cohortId, clusterId) in requestedAssociations)
            {
                if (!existingAssociations.Any(a => a.CohortId == cohortId && a.ClusterId == clusterId))
                {
                    var junction = new CategoryCohortCluster
                    {
                        Id = Guid.NewGuid(),
                        CategoryId = id,
                        CohortId = cohortId,
                        ClusterId = clusterId
                    };
                    
                    await _categoryRepository.AddCategoryCohortClusterAsync(junction);
                }
            }
            
            await transaction.CommitAsync();
            
            return await GetCategoryByIdAsync(id);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            
            if (ex is BadRequestException || ex is NotFoundException)
                throw;
                
            // Possible logger placeholder.
            
            throw new Exception("An error occurred while updating the category", ex);
        }
    }

    public async Task DeleteCategoryAsync(Guid id)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null)
            throw new NotFoundException($"Category with ID {id} not found");
        
        // The FK constraint should(?) automatically delete associated junction table records.
        await _categoryRepository.DeleteCategoryAsync(id);
    }

    public async Task AddClustersToCohortCategoryAsync(Guid categoryId, Guid cohortId, AddClustersDTO dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
            if (category == null)
                throw new NotFoundException($"Category with ID {categoryId} not found");
            
            var cohort = await _context.Cohorts.FindAsync(cohortId);
            if (cohort == null)
                throw new BadRequestException($"Cohort with ID {cohortId} does not exist");
            
            foreach (var clusterId in dto.ClusterIds)
            {
                // Skip if the association already exists.
                var exists = await _categoryRepository.CategoryCohortClusterExistsAsync(
                    categoryId, cohortId, clusterId);
                    
                if (exists)
                    continue;
                
                // Check if cluster exists and belongs to the cohort.
                var clusterBelongsToCohort = await _context.Clusters
                    .Where(c => c.Id == clusterId)
                    .SelectMany(c => c.Cohorts)
                    .AnyAsync(c => c.Id == cohortId);
                
                if (!clusterBelongsToCohort)
                    throw new BadRequestException($"Cluster {clusterId} does not exist or is not associated with cohort {cohortId}");
                
                // Create new association.
                var junction = new CategoryCohortCluster
                {
                    Id = Guid.NewGuid(),
                    CategoryId = categoryId,
                    CohortId = cohortId,
                    ClusterId = clusterId
                };
                
                await _categoryRepository.AddCategoryCohortClusterAsync(junction);
            }
            
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            
            if (ex is BadRequestException || ex is NotFoundException)
                throw;
                
            throw new Exception("An error occurred while adding clusters to category", ex);
        }
    }

    public async Task RemoveClusterFromCohortCategoryAsync(Guid categoryId, Guid cohortId, Guid clusterId)
    {
        var exists = await _categoryRepository.CategoryCohortClusterExistsAsync(
            categoryId, cohortId, clusterId);
            
        if (!exists)
            throw new NotFoundException($"Association between category {categoryId}, cohort {cohortId}, and cluster {clusterId} not found");
        
        await _categoryRepository.RemoveCategoryCohortClusterAsync(categoryId, cohortId, clusterId);
    }

    public async Task RemoveCohortFromCategoryAsync(Guid categoryId, Guid cohortId)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(categoryId);
        if (category == null)
            throw new NotFoundException($"Category with ID {categoryId} not found");
        
        var cohort = await _context.Cohorts.FindAsync(cohortId);
        if (cohort == null)
            throw new BadRequestException($"Cohort with ID {cohortId} does not exist");
        
        // It should remove all clusters associated with this cohort-category.
        await _categoryRepository.RemoveCohortFromCategoryAsync(categoryId, cohortId);
    }

    public async Task<List<CategoryDetailDTO>> GetCategoriesForCohortAsync(Guid cohortId)
    {
        var cohort = await _context.Cohorts.FindAsync(cohortId);
        if (cohort == null)
            throw new BadRequestException($"Cohort with ID {cohortId} does not exist");
        
        var junctions = await _categoryRepository.GetCategoriesForCohortAsync(cohortId);
        
        // Group by category.
        var result = new List<CategoryDetailDTO>();
        
        var categoryGroups = junctions.GroupBy(j => new { j.CategoryId, j.Category.Name });
        
        foreach (var categoryGroup in categoryGroups)
        {
            var clusters = categoryGroup.Select(j => new ClusterDetailDTO
            {
                Id = j.ClusterId,
                Name = j.Cluster.Name
            }).ToList();
            
            result.Add(new CategoryDetailDTO
            {
                Id = categoryGroup.Key.CategoryId,
                Name = categoryGroup.Key.Name,
                CohortClusters = new List<CohortClustersDetailDTO>
                {
                    new CohortClustersDetailDTO
                    {
                        CohortId = cohortId,
                        CohortName = cohort.Name,
                        Clusters = clusters
                    }
                }
            });
        }
        
        return result;
    }
}

// Helper classes.
public class CategoryAssociation
{
    public Guid CohortId { get; set; }
    public Guid ClusterId { get; set; }
}

public class AssociationComparer : IEqualityComparer<CategoryAssociation>
{
    public bool Equals(CategoryAssociation x, CategoryAssociation y)
    {
        if (x == null && y == null) return true;
        if (x == null || y == null) return false;
        return x.CohortId == y.CohortId && x.ClusterId == y.ClusterId;
    }

    public int GetHashCode(CategoryAssociation obj)
    {
        if (obj == null) return 0;
        return HashCode.Combine(obj.CohortId, obj.ClusterId);
    }
}
