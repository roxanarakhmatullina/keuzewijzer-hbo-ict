using Server.Models;
using Server.Repositories;
using Server.Data;
using Server.DataTransferObjects;
using Microsoft.EntityFrameworkCore;

namespace Server.Services;

public class CategoryService
{
    private readonly CategoryRepository _repository;

    // TODO: short term solution (before fully implementing Repository Design Pattern)
    // CohortRepository and ClusterRepository do not exist yet so DataContext is injected
    private readonly DataContext _context;

    public CategoryService(CategoryRepository repository, DataContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<List<CategoryDTO>> GetAllCategoriesAsync()
    {
        var categories = await _repository.GetAllBasicAsync();
        return categories.Select(c => new CategoryDTO
        {
            Id = c.Id,
            Name = c.Name
        }).ToList();
    }

    public async Task<CategoryDTO> GetCategoryByIdAsync(Guid id)
    {
        var category = await _repository.GetByIdBasicAsync(id);
        if (category == null) return null;
        
        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name
        };
    }

    // Find this method
public async Task<CategoryDetailsDTO> GetCategoryDetailsAsync(Guid id)
{
    var category = await _repository.GetByIdAsync(id);
    if (category == null) return null;

    var result = new CategoryDetailsDTO
    {
        Id = category.Id,
        Name = category.Name,
        Cohorts = new List<CohortDetailsDTO>(),
        Clusters = new List<ClusterDTO>()
    };

    // Get all CategoryCohortCluster records for this category
    var associations = category.CategoryCohortClusters;
    
    // Get all cohorts for this category
    var cohortIds = associations.Select(ccc => ccc.CohortId).Distinct().ToList();
    
    var cohorts = await _context.Cohorts
        .Where(c => cohortIds.Contains(c.Id))
        .ToListAsync();
    
    foreach (var cohort in cohorts)
    {
        result.Cohorts.Add(new CohortDetailsDTO
        {
            Id = cohort.Id,
            Name = cohort.Name,
            IsAvailable = cohort.isAvailable
        });
    }
    
    // Get all clusters for this category (SINGLE QUERY)
    var clusterIds = associations.Select(ccc => ccc.ClusterId).Distinct().ToList();
    
    var clusters = await _context.Clusters
        .Where(c => clusterIds.Contains(c.Id))
        .Include(c => c.ClusterPrerequisites)
        .Include(c => c.Cohorts)
        .Include(c => c.GraduateProfiles)
        .ToListAsync();

    // Map clusters to DTOs
    foreach (var cluster in clusters)
    {
        result.Clusters.Add(new ClusterDTO
        {
            Id = cluster.Id,
            Name = cluster.Name,
            Link = cluster.Link,
            FirstSemester = cluster.FirstSemester,
            LastSemester = cluster.LastSemester,
            IsFreeChoice = cluster.IsFreeChoice,
            IsLocked = cluster.IsLocked,
            Level = cluster.Level,
            PrerequisiteIds = cluster.ClusterPrerequisites.Select(p => p.PrerequisiteId).ToList(),
            CohortIds = cluster.Cohorts.Select(c => c.Id).ToList(),
            GraduateProfileIds = cluster.GraduateProfiles.Select(gp => gp.Id).ToList()
        });
    }
    
    return result;
}

    public async Task<CategoryDTO> CreateCategoryAsync(CategoryCreateDTO dto)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name
        };

        await _repository.AddAsync(category);

        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name
        };
    }



    public async Task<bool> UpdateCategoryAsync(Guid id, CategoryDTO dto)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return false;

        category.Name = dto.Name;
        await _repository.UpdateAsync(category);
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(Guid id)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return false;

        await _repository.DeleteAsync(category);
        return true;
    }
}