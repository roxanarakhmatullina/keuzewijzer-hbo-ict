using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Repositories;

public class CategoryCohortClusterRepository
{
    private readonly DataContext _context;

    public CategoryCohortClusterRepository(DataContext context)
    {
        _context = context;
    }

    // Get all associations
    public async Task<List<CategoryCohortCluster>> GetAllAsync()
    {
        return await _context.CategoryCohortClusters
            .Include(ccc => ccc.Category)
            .Include(ccc => ccc.Cohort)
            .Include(ccc => ccc.Cluster)
            .ToListAsync();
    }

    // Get Clusters for a specific Category and Cohort pair
    public async Task<List<CategoryCohortCluster>> GetByCategoryAndCohortAsync(Guid categoryId, Guid cohortId)
    {
        return await _context.CategoryCohortClusters
            .Where(ccc => ccc.CategoryId == categoryId && ccc.CohortId == cohortId)
            .Include(ccc => ccc.Cluster)
            .ToListAsync();
    }

    // Add multiple associations
    public async Task AddRangeAsync(List<CategoryCohortCluster> categoryCohortClusters)
    {
        _context.CategoryCohortClusters.AddRange(categoryCohortClusters);
        await _context.SaveChangesAsync();
    }

    // Delete associations by Category and Cohort
    public async Task DeleteByCategoryAndCohortAsync(Guid categoryId, Guid cohortId)
    {
        var associations = await _context.CategoryCohortClusters
            .Where(ccc => ccc.CategoryId == categoryId && ccc.CohortId == cohortId)
            .ToListAsync();

        _context.CategoryCohortClusters.RemoveRange(associations);
        await _context.SaveChangesAsync();
    }
}