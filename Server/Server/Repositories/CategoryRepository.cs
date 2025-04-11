using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Repositories.Interfaces;

namespace Server.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly DataContext _context;

    public CategoryRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(Guid id)
    {
        return await _context.Categories.FindAsync(id);
    }

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task UpdateCategoryAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category != null)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<CategoryCohortCluster>> GetCategoryCohortClustersByCategoryIdAsync(Guid categoryId)
    {
        return await _context.CategoryCohortClusters
            .Where(ccc => ccc.CategoryId == categoryId)
            .Include(ccc => ccc.Cohort)
            .Include(ccc => ccc.Cluster)
            .ToListAsync();
    }

    public async Task<bool> CategoryCohortClusterExistsAsync(Guid categoryId, Guid cohortId, Guid clusterId)
    {
        return await _context.CategoryCohortClusters
            .AnyAsync(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId);
    }

    public async Task AddCategoryCohortClusterAsync(CategoryCohortCluster categoryCohortCluster)
    {
        _context.CategoryCohortClusters.Add(categoryCohortCluster);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveCategoryCohortClusterAsync(Guid categoryId, Guid cohortId, Guid clusterId)
    {
        var junction = await _context.CategoryCohortClusters
            .FirstOrDefaultAsync(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId);
        
        if (junction != null)
        {
            _context.CategoryCohortClusters.Remove(junction);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveCohortFromCategoryAsync(Guid categoryId, Guid cohortId)
    {
        var junctions = await _context.CategoryCohortClusters
            .Where(ccc => ccc.CategoryId == categoryId && ccc.CohortId == cohortId)
            .ToListAsync();
        
        if (junctions.Count != 0)
        {
            _context.CategoryCohortClusters.RemoveRange(junctions);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<CategoryCohortCluster>> GetCategoriesForCohort(Guid cohortId)
    {
        return await _context.CategoryCohortClusters
            .Where(ccc => ccc.CohortId == cohortId)
            .Include(ccc => ccc.Category)
            .Include(ccc => ccc.Cluster)
            .ToListAsync();
    }
}