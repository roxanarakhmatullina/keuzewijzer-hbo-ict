using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Repositories;
using Server.Tests.Helpers;
using Xunit;
using FluentAssertions;


namespace Server.Tests.Repositories
{
    public class CategoryRepositoryTests
    {
        [Fact]
        public async Task GetAllCategoriesAsync_ReturnsAllCategories()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            
            var result = await repository.GetAllCategoriesAsync();
            
            result.Should().HaveCount(2);
            result.Should().Contain(c => c.Name == "HBO-ICT");
            result.Should().Contain(c => c.Name == "Miscellaneous");
        }
        
        [Fact]
        public async Task GetCategoryByIdAsync_WithValidId_ReturnsCategory()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var categoryId = TestDataFactory.CreateTestGuid(1); // "HBO-ICT" id: 1.
            
            var result = await repository.GetCategoryByIdAsync(categoryId);
            
            result.Should().NotBeNull();
            result.Name.Should().Be("HBO-ICT");
        }
        
        [Fact]
        public async Task GetCategoryByIdAsync_WithInvalidId_ReturnsNull()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var invalidId = Guid.NewGuid();
            
            var result = await repository.GetCategoryByIdAsync(invalidId);
            
            result.Should().BeNull();
        }
        
        [Fact]
        public async Task CreateCategoryAsync_AddsNewCategoryToDatabase()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            var repository = new CategoryRepository(context);
            var newCategory = TestDataFactory.CreateCategory("New Test Category");
            
            var result = await repository.CreateCategoryAsync(newCategory);
            
            result.Should().NotBeNull();
            result.Name.Should().Be("New Test Category");
            
            var categoryInDb = await context.Categories.FindAsync(result.Id);
            categoryInDb.Should().NotBeNull();
            categoryInDb.Name.Should().Be("New Test Category");
        }
        
        [Fact]
        public async Task UpdateCategoryAsync_UpdatesExistingCategory()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            
            var categoryId = TestDataFactory.CreateTestGuid(1); // "HBO-ICT" from seed data.
            var category = await context.Categories.FindAsync(categoryId);
            category.Name = "Updated Category Name";
            
            await repository.UpdateCategoryAsync(category);
            
            var updatedCategory = await context.Categories.FindAsync(categoryId);
            updatedCategory.Should().NotBeNull();
            updatedCategory.Name.Should().Be("Updated Category Name");
        }
        
        [Fact]
        public async Task DeleteCategoryAsync_RemovesCategoryFromDatabase()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var categoryId = TestDataFactory.CreateTestGuid(1); // "HBO-ICT" from seed data.
            
            await repository.DeleteCategoryAsync(categoryId);
            
            var deletedCategory = await context.Categories.FindAsync(categoryId);
            deletedCategory.Should().BeNull();
        }
        
        [Fact]
        public async Task GetCategoryCohortClustersByCategoryIdAsync_ReturnsCCCsForCategory()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var categoryId = TestDataFactory.CreateTestGuid(1); // "HBO-ICT" from seed data.
            
            var result = await repository.GetCategoryCohortClustersByCategoryIdAsync(categoryId);
            
            result.Should().HaveCount(2); // HBO-ICT has 2 clusters in cohort 2024.
            result.Should().OnlyContain(ccc => ccc.CategoryId == categoryId);
            result.Should().OnlyContain(ccc => ccc.Category.Name == "HBO-ICT");
            result.All(ccc => ccc.Cohort != null).Should().BeTrue();
            result.All(ccc => ccc.Cluster != null).Should().BeTrue();
        }
        
        [Fact]
        public async Task CategoryCohortClusterExistsAsync_WithExistingAssociation_ReturnsTrue()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var categoryId = TestDataFactory.CreateTestGuid(1); // "HBO-ICT" from seed.
            var cohortId = TestDataFactory.CreateTestGuid(11); // "2024" from seed.
            var clusterId = TestDataFactory.CreateTestGuid(21); // "Web Development" from seed.
            
            var result = await repository.CategoryCohortClusterExistsAsync(categoryId, cohortId, clusterId);
            
            result.Should().BeTrue();
        }
        
        [Fact]
        public async Task CategoryCohortClusterExistsAsync_WithNonExistingAssociation_ReturnsFalse()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var categoryId = TestDataFactory.CreateTestGuid(1); // "HBO-ICT" from seed.
            var cohortId = TestDataFactory.CreateTestGuid(11); // "2024" from seed.
            var clusterId = TestDataFactory.CreateTestGuid(23); // "BPM" from seed.
            
            var result = await repository.CategoryCohortClusterExistsAsync(categoryId, cohortId, clusterId);
            
            result.Should().BeFalse();
        }
        
        [Fact]
        public async Task AddCategoryCohortClusterAsync_AddsNewAssociation()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            
            var newJunction = TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(100),
                TestDataFactory.CreateTestGuid(1), // HBO-ICT.
                TestDataFactory.CreateTestGuid(12), // 2025.
                TestDataFactory.CreateTestGuid(21)  // Web development.
            );
            
            await repository.AddCategoryCohortClusterAsync(newJunction);
            
            var addedJunction = await context.CategoryCohortClusters.FindAsync(newJunction.Id);
            addedJunction.Should().NotBeNull();
            addedJunction.CategoryId.Should().Be(TestDataFactory.CreateTestGuid(1));
            addedJunction.CohortId.Should().Be(TestDataFactory.CreateTestGuid(12));
            addedJunction.ClusterId.Should().Be(TestDataFactory.CreateTestGuid(21));
        }
        
        [Fact]
        public async Task RemoveCategoryCohortClusterAsync_RemovesSpecificAssociation()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            
            var categoryId = TestDataFactory.CreateTestGuid(1); // HBO-ICT.
            var cohortId = TestDataFactory.CreateTestGuid(11); // 2024.
            var clusterId = TestDataFactory.CreateTestGuid(21); // Web Development.
            
            await repository.RemoveCategoryCohortClusterAsync(categoryId, cohortId, clusterId);
            
            var exists = await context.CategoryCohortClusters.AnyAsync(
                ccc => ccc.CategoryId == categoryId && 
                      ccc.CohortId == cohortId && 
                      ccc.ClusterId == clusterId);
            exists.Should().BeFalse();
        }
        
        [Fact]
        public async Task RemoveCohortFromCategoryAsync_RemovesAllAssociationsForCohort()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            
            var categoryId = TestDataFactory.CreateTestGuid(1); // HBO-ICT.
            var cohortId = TestDataFactory.CreateTestGuid(11); // 2024.
            
            await repository.RemoveCohortFromCategoryAsync(categoryId, cohortId);
            
            // Assertion - no junctions should remain for this category-cohort pair.
            var remaining = await context.CategoryCohortClusters.AnyAsync(
                ccc => ccc.CategoryId == categoryId && ccc.CohortId == cohortId);
            remaining.Should().BeFalse();
        }
        
        [Fact]
        public async Task GetCategoriesForCohortAsync_ReturnsJunctionsForSpecificCohort()
        {
            var context = DatabaseHelper.CreateInMemoryDatabase();
            DatabaseHelper.SeedDatabase(context);
            var repository = new CategoryRepository(context);
            var cohortId = TestDataFactory.CreateTestGuid(11); // 2024.
            
            var result = await repository.GetCategoriesForCohortAsync(cohortId);
            
            result.Should().NotBeEmpty();
            result.Should().OnlyContain(ccc => ccc.CohortId == cohortId);
            result.Should().OnlyContain(ccc => ccc.Cohort != null);
            result.Should().OnlyContain(ccc => ccc.Category != null);
            result.Should().OnlyContain(ccc => ccc.Cluster != null);

            var categories = result.Select(ccc => ccc.Category.Name).Distinct().ToList();
            categories.Should().Contain("HBO-ICT");
            categories.Should().NotContain("Miscellaneous");

            // Count check - cohort 2024 has 2 clusters in HBO-ICT category.
            result.Count(ccc => ccc.Category.Name == "HBO-ICT").Should().Be(2);
            
            var clusterNames = result.Where(ccc => ccc.Category.Name == "HBO-ICT")
                            .Select(ccc => ccc.Cluster.Name)
                            .ToList();
            clusterNames.Should().Contain("Web Development");
            clusterNames.Should().Contain("Quality in Software Development");
        }
    }
}
