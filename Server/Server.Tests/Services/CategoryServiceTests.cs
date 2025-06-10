using System.Collections.Generic;
using Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Services;
using Server.Tests.Helpers;
using Moq;
using Server.Models;
using FluentAssertions;
using Server.Exceptions;
using Server.DataTransferObjects;

namespace Server.Tests.Services;

public class CategoryServiceTests
{
    private readonly Mock<ICategoryRepository> _mockRepository;
    private readonly DataContext _context;
    private readonly CategoryService _service;

    public CategoryServiceTests()
    {
        _mockRepository = new Mock<ICategoryRepository>();
        _context = DatabaseHelper.CreateInMemoryDatabase();
        _service = new CategoryService(_mockRepository.Object, _context);
    }

    [Fact]
    public async Task GetAllCategoriesAsync_ReturnsAllCategories()
    {
        var categories = new List<Category>
        {
            TestDataFactory.CreateCategory("Category 1", TestDataFactory.CreateTestGuid(1)),
            TestDataFactory.CreateCategory("Category 2", TestDataFactory.CreateTestGuid(2)),
        };

        // When repo's function GetAllCategoriesAsync is called then return categories.
        _mockRepository.Setup(repo => repo.GetAllCategoriesAsync())
            .ReturnsAsync(categories);

        var result = await _service.GetAllCategoriesAsync();

        result.Should().HaveCount(2);
        result.Should().ContainSingle(c => c.Id == TestDataFactory.CreateTestGuid(1) && c.Name == "Category 1");
        result.Should().ContainSingle(c => c.Id == TestDataFactory.CreateTestGuid(2) && c.Name == "Category 2");

        _mockRepository.Verify(repo => repo.GetAllCategoriesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetCategoryByIdAsync_WithExistingId_ReturnsCategory()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var category = TestDataFactory.CreateCategory("Test Category", categoryId);

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(category);

        _mockRepository.Setup(repo => repo.GetCategoryCohortClustersByCategoryIdAsync(categoryId))
            .ReturnsAsync(new List<CategoryCohortCluster>()); // TODO: For now associations for simplicity.

        var result = await _service.GetCategoryByIdAsync(categoryId);

        result.Should().NotBeNull();
        result.Id.Should().Be(categoryId);
        result.Name.Should().Be("Test Category");
        result.CohortClusters.Should().BeEmpty();
    }

    [Fact]
    public async Task GetCategoryByIdAsync_WithNonExistentId_ThrowsNotFoundException()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync((Category)null);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.GetCategoryByIdAsync(categoryId));
    }

    [Fact]
    public async Task GetCategoryByIdAsync_WithAssociations_ReturnsCategoryWithCohortClusters()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var category = TestDataFactory.CreateCategory("Test Category", categoryId);

        var cohort1 = TestDataFactory.CreateCohort(TestDataFactory.CreateTestGuid(10), "Cohort 2023");
        var cohort2 = TestDataFactory.CreateCohort(TestDataFactory.CreateTestGuid(11), "Cohort 2024");

        var cluster1 = TestDataFactory.CreateCluster(TestDataFactory.CreateTestGuid(20), "Cluster 1");
        var cluster2 = TestDataFactory.CreateCluster(TestDataFactory.CreateTestGuid(21), "Cluster 2");
        var cluster3 = TestDataFactory.CreateCluster(TestDataFactory.CreateTestGuid(22), "Cluster 3");

        var junctions = new List<CategoryCohortCluster>
        {
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(30),
                categoryId, cohort1.Id, cluster1.Id,
                category, cohort1, cluster1
            ),
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(31),
                categoryId, cohort1.Id, cluster2.Id,
                category, cohort1, cluster2
            ),
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(30),
                categoryId, cohort2.Id, cluster3.Id,
                category, cohort2, cluster3
            )
        };

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(category);

        _mockRepository.Setup(repo => repo.GetCategoryCohortClustersByCategoryIdAsync(categoryId))
            .ReturnsAsync(junctions);

        var result = await _service.GetCategoryByIdAsync(categoryId);

        result.Should().NotBeNull();
        result.Id.Should().Be(categoryId);
        result.Name.Should().Be("Test Category");

        result.CohortClusters.Should().HaveCount(2); // Two cohorts.

        // Check if the first cohort has 2 clusters.
        var firstCohort = result.CohortClusters.FirstOrDefault(cc => cc.CohortId == cohort1.Id);
        firstCohort.Should().NotBeNull();
        firstCohort.CohortName.Should().Be("Cohort 2023");
        firstCohort.Clusters.Should().HaveCount(2);
        firstCohort.Clusters.Should().ContainSingle(c => c.Id == cluster1.Id && c.Name == "Cluster 1");
        firstCohort.Clusters.Should().ContainSingle(c => c.Id == cluster2.Id && c.Name == "Cluster 2");

        // Check if the second cohort has 1 cluster.
        var secondCohort = result.CohortClusters.FirstOrDefault(cc => cc.CohortId == cohort2.Id);
        secondCohort.Should().NotBeNull();
        secondCohort.CohortName.Should().Be("Cohort 2024");
        secondCohort.Clusters.Should().HaveCount(1);
        secondCohort.Clusters.Should().ContainSingle(c => c.Id == cluster3.Id && c.Name == "Cluster 3");
    }

    [Fact]
    public async Task CreateCategoryAsync_WithValidData_CreatesCategoryAndAssociations()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId = TestDataFactory.CreateTestGuid(20);

        var dto = TestDataFactory.CreateCategoryCreateUpdateDTO("New Category", new List<CohortClustersDTO>
        {
            TestDataFactory.CreateCohortClustersDTO(cohortId, new List<Guid> { clusterId })
        });

        // Setup cohort in mock db.
        var cohort = TestDataFactory.CreateCohort(cohortId, "Cohort 2023");
        _context.Cohorts.Add(cohort);

        // Setup cluster in mock db with the cohort relationship.
        var cluster = TestDataFactory.CreateCluster(clusterId, "Cluster1");
        cluster.Cohorts = new List<Cohort> { cohort };
        _context.Clusters.Add(cluster);

        await _context.SaveChangesAsync();

        // Mock repo responses.
        _mockRepository.Setup(repo => repo.CreateCategoryAsync(It.IsAny<Category>()))
            .ReturnsAsync((Category c) =>
            {
                c.Id = categoryId;
                return c;
            });

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(TestDataFactory.CreateCategory(dto.Name, categoryId));

        _mockRepository.Setup(repo => repo.GetCategoryCohortClustersByCategoryIdAsync(categoryId))
                .ReturnsAsync(new List<CategoryCohortCluster>
                {
                    TestDataFactory.CreateCategoryCohortCluster(
                        TestDataFactory.CreateTestGuid(30),
                        categoryId, cohortId, clusterId,
                        null, cohort, cluster)
                });

        var result = await _service.CreateCategoryAsync(dto);

        result.Should().NotBeNull();
        result.Id.Should().Be(categoryId);
        result.Name.Should().Be("New Category");

        _mockRepository.Verify(repo => repo.CreateCategoryAsync(It.Is<Category>(c =>
            c.Name == dto.Name)), Times.Once);

        _mockRepository.Verify(repo => repo.AddCategoryCohortClusterAsync(It.Is<CategoryCohortCluster>(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId)), Times.Once);
    }

    [Fact]
    public async Task CreateCategoryAsync_WithInvalidCohort_ThrowsBadRequestException()
    {
        var dto = TestDataFactory.CreateCategoryCreateUpdateDTO("New Category", new List<CohortClustersDTO>
        {
            TestDataFactory.CreateCohortClustersDTO(TestDataFactory.CreateTestGuid(99), new List<Guid> { TestDataFactory.CreateTestGuid(20) })
        });

        // No cohorts in the db -> fail cohort validation.

        await Assert.ThrowsAsync<BadRequestException>(() => _service.CreateCategoryAsync(dto));
    }

    [Fact]
    public async Task UpdateCategoryAsync_WithValidData_UpdatesCategoryAndAssociations()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId1 = TestDataFactory.CreateTestGuid(20);
        var clusterId2 = TestDataFactory.CreateTestGuid(21);

        // Creating category in the repo.
        var category = TestDataFactory.CreateCategory("Original Category", categoryId);
        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(category);

        // Creating test objects for nav properties.
        var cohort = TestDataFactory.CreateCohort(cohortId, "Cohort 2023");
        var cluster1 = TestDataFactory.CreateCluster(clusterId1, "Cluster 1");
        var cluster2 = TestDataFactory.CreateCluster(clusterId2, "Cluster 2");

        // Setting up existing associations.
        var existingJunctions = new List<CategoryCohortCluster>
        {
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(30),
                categoryId, cohortId, clusterId1,
                category, cohort, cluster1)
        };

        _mockRepository.Setup(repo => repo.GetCategoryCohortClustersByCategoryIdAsync(categoryId))
            .ReturnsAsync(existingJunctions);

        // Setting up dto with updated data (new name) and add cluster.
        var updateDto = TestDataFactory.CreateCategoryCreateUpdateDTO("Updated Category", new List<CohortClustersDTO>
        {
            TestDataFactory.CreateCohortClustersDTO(cohortId, new List<Guid> { clusterId1, clusterId2 })
        });

        // Adding objects to mock db.
        _context.Cohorts.Add(cohort);
        _context.Clusters.AddRange(cluster1, cluster2);
        cluster1.Cohorts = new List<Cohort> { cohort };
        cluster2.Cohorts = new List<Cohort> { cohort };
        await _context.SaveChangesAsync();

        // Setup mock response for the second call to GetCategoryByIdAsync
        // which happends at the end of UpdateCategoryAsync
        _mockRepository.SetupSequence(repo => repo.GetCategoryCohortClustersByCategoryIdAsync(categoryId))
        .ReturnsAsync(existingJunctions)  // First call returns original junctions.
        .ReturnsAsync(new List<CategoryCohortCluster> // Second call returns updated junctions.
        {
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(30),
                categoryId, cohortId, clusterId1,
                category, cohort, cluster1),
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(31),
                categoryId, cohortId, clusterId2,
                category, cohort, cluster2)
        });

        var result = await _service.UpdateCategoryAsync(categoryId, updateDto);

        // Verifying category name update.
        _mockRepository.Verify(repo => repo.UpdateCategoryAsync(It.Is<Category>(c =>
            c.Id == categoryId && c.Name == "Updated Category")), Times.Once);

        // Verifying if cluster2 was added.
        _mockRepository.Verify(repo => repo.AddCategoryCohortClusterAsync(It.Is<CategoryCohortCluster>(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId2)), Times.Once);

        // Verifying if cluster1 was NOT added again.
        _mockRepository.Verify(repo => repo.AddCategoryCohortClusterAsync(It.Is<CategoryCohortCluster>(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId1)), Times.Never);
    }

    [Fact]
    public async Task UpdateCategoryAsync_WithNonExistingCategory_ThrowsNotFoundException()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync((Category)null);

        var updateDto = TestDataFactory.CreateCategoryCreateUpdateDTO("Updated Category");

        await Assert.ThrowsAsync<NotFoundException>(() => _service.UpdateCategoryAsync(categoryId, updateDto));
    }

    [Fact]
    public async Task DeleteCategoryAsync_WithValidId_DeletesCategory()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(TestDataFactory.CreateCategory("Category to Delete", categoryId));

        await _service.DeleteCategoryAsync(categoryId);

        _mockRepository.Verify(repo => repo.DeleteCategoryAsync(categoryId), Times.Once);
    }

    [Fact]
    public async Task DeleteCategoryAsync_WithNonExistentCategory_ThrowsNotFoundException()
    {
        // Arrange
        var categoryId = TestDataFactory.CreateTestGuid(99);

        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync((Category)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteCategoryAsync(categoryId));
    }

    [Fact]
    public async Task AddClustersToCohortCategoryAsync_AddsNewClusters()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId1 = TestDataFactory.CreateTestGuid(20);
        var clusterId2 = TestDataFactory.CreateTestGuid(21);

        // Setup category.
        var category = TestDataFactory.CreateCategory("Test Category", categoryId);
        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(category);

        // Setup cohort.
        var cohort = TestDataFactory.CreateCohort(cohortId, "TestCohort");
        _context.Cohorts.Add(cohort);

        // Setup clusters-cohort relationship.
        var cluster1 = TestDataFactory.CreateCluster(clusterId1, "Cluster 1");
        var cluster2 = TestDataFactory.CreateCluster(clusterId2, "Cluster 2");
        cluster1.Cohorts = new List<Cohort> { cohort };
        cluster2.Cohorts = new List<Cohort> { cohort };
        _context.Clusters.AddRange(cluster1, cluster2);

        await _context.SaveChangesAsync();

        // Set up mock repository - cluster1 already exists in the association.
        _mockRepository.Setup(repo => repo.CategoryCohortClusterExistsAsync(categoryId, cohortId, clusterId1))
            .ReturnsAsync(true);

        // cluster2 does not exist yet.
        _mockRepository.Setup(repo => repo.CategoryCohortClusterExistsAsync(categoryId, cohortId, clusterId2))
            .ReturnsAsync(false);

        var addClustersDto = TestDataFactory.CreateAddClustersDTO(new List<Guid> { clusterId1, clusterId2 });

        await _service.AddClustersToCohortCategoryAsync(categoryId, cohortId, addClustersDto);

        // Verify only the new cluster was added.
        _mockRepository.Verify(repo => repo.AddCategoryCohortClusterAsync(It.Is<CategoryCohortCluster>(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId2)), Times.Once);

        // Verify the existing cluster was not added again.
        _mockRepository.Verify(repo => repo.AddCategoryCohortClusterAsync(It.Is<CategoryCohortCluster>(ccc =>
            ccc.CategoryId == categoryId &&
            ccc.CohortId == cohortId &&
            ccc.ClusterId == clusterId1)), Times.Never);
    }

    [Fact]
    public async Task RemoveClusterFromCohortCategoryAsync_WithExistingAssociation_RemovesCluster()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId = TestDataFactory.CreateTestGuid(20);

        _mockRepository.Setup(repo => repo.CategoryCohortClusterExistsAsync(categoryId, cohortId, clusterId))
            .ReturnsAsync(true);

        await _service.RemoveClusterFromCohortCategoryAsync(categoryId, cohortId, clusterId);

        _mockRepository.Verify(repo => repo.RemoveCategoryCohortClusterAsync(categoryId, cohortId, clusterId), Times.Once);
    }

    [Fact]
    public async Task RemoveClusterFromCohortCategoryAsync_WithNonExistentAssociation_ThrowsNotFoundException()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId = TestDataFactory.CreateTestGuid(20);

        _mockRepository.Setup(repo => repo.CategoryCohortClusterExistsAsync(categoryId, cohortId, clusterId))
            .ReturnsAsync(false);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.RemoveClusterFromCohortCategoryAsync(categoryId, cohortId, clusterId));
    }

    [Fact]
    public async Task RemoveCohortFromCategoryAsync_RemovesEntireCohort()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);

        var category = TestDataFactory.CreateCategory("Test Category", categoryId);
        _mockRepository.Setup(repo => repo.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(category);

        var cohort = TestDataFactory.CreateCohort(cohortId, "Test Cohort");
        _context.Cohorts.Add(cohort);
        await _context.SaveChangesAsync();

        await _service.RemoveCohortFromCategoryAsync(categoryId, cohortId);

        _mockRepository.Verify(repo => repo.RemoveCohortFromCategoryAsync(categoryId, cohortId), Times.Once);
    }
[Fact]
    public async Task GetCategoriesForCohortAsync_ReturnsCategories()
    {
        var cohortId = TestDataFactory.CreateTestGuid(10);
        
        // Add cohort to database.
        var cohort = TestDataFactory.CreateCohort(cohortId, "Test Cohort");
        _context.Cohorts.Add(cohort);
        await _context.SaveChangesAsync();
        
        // Set up mock repo response.
        var category1Id = TestDataFactory.CreateTestGuid(1);
        var category2Id = TestDataFactory.CreateTestGuid(2);
        var clusterId1 = TestDataFactory.CreateTestGuid(20);
        var clusterId2 = TestDataFactory.CreateTestGuid(21);
        
        var cluster1 = TestDataFactory.CreateCluster(clusterId1, "Cluster 1");
        var cluster2 = TestDataFactory.CreateCluster(clusterId2, "Cluster 2");
        
        var category1 = TestDataFactory.CreateCategory("Category 1", category1Id);
        var category2 = TestDataFactory.CreateCategory("Category 2", category2Id);
        
        var junctions = new List<CategoryCohortCluster>
        {
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(30), 
                category1Id, cohortId, clusterId1, 
                category1, cohort, cluster1),
            TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(31), 
                category2Id, cohortId, clusterId2, 
                category2, cohort, cluster2)
        };
        
        _mockRepository.Setup(repo => repo.GetCategoriesForCohortAsync(cohortId))
            .ReturnsAsync(junctions);
        
        var result = await _service.GetCategoriesForCohortAsync(cohortId);
        
        result.Should().HaveCount(2);
        
        // Check first category.
        var firstCategory = result.FirstOrDefault(c => c.Id == category1Id);
        firstCategory.Should().NotBeNull();
        firstCategory.Name.Should().Be("Category 1");
        firstCategory.CohortClusters.Should().HaveCount(1);
        firstCategory.CohortClusters[0].CohortId.Should().Be(cohortId);
        firstCategory.CohortClusters[0].CohortName.Should().Be("Test Cohort");
        firstCategory.CohortClusters[0].Clusters.Should().HaveCount(1);
        firstCategory.CohortClusters[0].Clusters[0].Id.Should().Be(clusterId1);
        firstCategory.CohortClusters[0].Clusters[0].Name.Should().Be("Cluster 1");
        
        // Check second category.
        var secondCategory = result.FirstOrDefault(c => c.Id == category2Id);
        secondCategory.Should().NotBeNull();
        secondCategory.Name.Should().Be("Category 2");
        secondCategory.CohortClusters.Should().HaveCount(1);
        secondCategory.CohortClusters[0].CohortId.Should().Be(cohortId);
        secondCategory.CohortClusters[0].CohortName.Should().Be("Test Cohort");
        secondCategory.CohortClusters[0].Clusters.Should().HaveCount(1);
        secondCategory.CohortClusters[0].Clusters[0].Id.Should().Be(clusterId2);
        secondCategory.CohortClusters[0].Clusters[0].Name.Should().Be("Cluster 2");
    }
}