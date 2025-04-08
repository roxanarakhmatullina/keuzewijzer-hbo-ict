using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Repositories;

public class CategoryRepository
{
    private readonly DataContext _context;

    public CategoryRepository(DataContext context)
    {
        _context = context;
    }

    // Get all categories
    public async Task<List<Category>> GetAllAsync()
    {
        return await _context.Categories
            .Include(c => c.CategoryCohortClusters)
            .ToListAsync();
    }

    public async Task<List<Category>> GetAllBasicAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    // Get category by ID
    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _context.Categories
            .Include(c => c.CategoryCohortClusters)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category?> GetByIdBasicAsync(Guid id)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    // Add a new category
    public async Task AddAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
    }

    // Update an existing category
    public async Task UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    // Delete a category
    public async Task DeleteAsync(Category category)
    {
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }
}