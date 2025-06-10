using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Server.Controllers;
using Server.DataTransferObjects;
using Server.Exceptions;
using Server.Services.Interfaces;
using Server.Tests.Helpers;
using Xunit;
using FluentAssertions;

namespace Server.Tests.Controllers;

public class CategoryControllerTests
{
    private readonly Mock<ICategoryService> _mockService;
    private readonly CategoryController _controller;

    public CategoryControllerTests()
    {
        _mockService = new Mock<ICategoryService>();
        _controller = new CategoryController(_mockService.Object);
    }

    [Fact]
    public async Task GetCategories_ReturnsOkResultWithCategories()
    {
        var categories = new List<CategoryDTO>
        {
            TestDataFactory.CreateCategoryDTO("Category 1", TestDataFactory.CreateTestGuid(1)),
            TestDataFactory.CreateCategoryDTO("Category 2", TestDataFactory.CreateTestGuid(2))
        };

        _mockService.Setup(service => service.GetAllCategoriesAsync())
            .ReturnsAsync(categories);

        var result = await _controller.GetCategories();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = okResult.Value as List<CategoryDTO>;

        returnValue.Should().NotBeNull();
        returnValue.Should().HaveCount(2);
        returnValue.Should().ContainSingle(c => c.Id == TestDataFactory.CreateTestGuid(1) && c.Name == "Category 1");
        returnValue.Should().ContainSingle(c => c.Id == TestDataFactory.CreateTestGuid(2) && c.Name == "Category 2");
    }

    [Fact]
    public async Task GetCategory_WithValidId_ReturnsOkResultWithCategory()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var category = TestDataFactory.CreateCategoryDetailDTO("Test Category", categoryId);

        _mockService.Setup(service => service.GetCategoryByIdAsync(categoryId))
            .ReturnsAsync(category);

        var result = await _controller.GetCategory(categoryId);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<CategoryDetailDTO>(okResult.Value);

        returnValue.Id.Should().Be(categoryId);
        returnValue.Name.Should().Be("Test Category");
    }

    [Fact]
    public async Task GetCategory_WithNonExistentId_ReturnsNotFound()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);

        _mockService.Setup(service => service.GetCategoryByIdAsync(categoryId))
            .ThrowsAsync(new NotFoundException($"Category with ID {categoryId} not found"));

        var result = await _controller.GetCategory(categoryId);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        notFoundResult.Value.Should().Be($"Category with ID {categoryId} not found");
    }

    [Fact]
    public async Task CreateCategory_WithValidData_ReturnsCreatedAtActionResult()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var createDto = TestDataFactory.CreateCategoryCreateUpdateDTO("New Category");
        var createdCategory = TestDataFactory.CreateCategoryDetailDTO("New Category", categoryId);

        _mockService.Setup(service => service.CreateCategoryAsync(createDto))
            .ReturnsAsync(createdCategory);

        var result = await _controller.CreateCategory(createDto);

        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);

        createdAtActionResult.ActionName.Should().Be(nameof(CategoryController.GetCategory));
        createdAtActionResult.RouteValues["id"].Should().Be(categoryId);

        var returnValue = Assert.IsType<CategoryDetailDTO>(createdAtActionResult.Value);
        returnValue.Id.Should().Be(categoryId);
        returnValue.Name.Should().Be("New Category");
    }

    [Fact]
    public async Task CreateCategory_WithInvalidData_ReturnsBadRequest()
    {
        var createDto = TestDataFactory.CreateCategoryCreateUpdateDTO("");

        _mockService.Setup(service => service.CreateCategoryAsync(createDto))
            .ThrowsAsync(new BadRequestException("Category name cannot be empty"));

        var result = await _controller.CreateCategory(createDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        badRequestResult.Value.Should().Be("Category name cannot be empty");
    }

    [Fact]
    public async Task UpdateCategory_WithValidData_ReturnsOkResultWithUpdatedCategory()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var updateDto = TestDataFactory.CreateCategoryCreateUpdateDTO("Updated Category");
        var updatedCategory = TestDataFactory.CreateCategoryDetailDTO("Updated Category", categoryId);

        _mockService.Setup(service => service.UpdateCategoryAsync(categoryId, updateDto))
            .ReturnsAsync(updatedCategory);

        var result = await _controller.UpdateCategory(categoryId, updateDto);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsType<CategoryDetailDTO>(okResult.Value);

        returnValue.Id.Should().Be(categoryId);
        returnValue.Name.Should().Be("Updated Category");
    }

    [Fact]
    public async Task UpdateCategory_WithNonExistentId_ReturnsNotFound()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);
        var updateDto = TestDataFactory.CreateCategoryCreateUpdateDTO("Updated Category");

        _mockService.Setup(service => service.UpdateCategoryAsync(categoryId, updateDto))
            .ThrowsAsync(new NotFoundException($"Category with ID {categoryId} not found"));

        var result = await _controller.UpdateCategory(categoryId, updateDto);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        notFoundResult.Value.Should().Be($"Category with ID {categoryId} not found");
    }

    [Fact]
    public async Task UpdateCategory_WithInvalidData_ReturnsBadRequest()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var updateDto = TestDataFactory.CreateCategoryCreateUpdateDTO("Updated Category");

        _mockService.Setup(service => service.UpdateCategoryAsync(categoryId, updateDto))
            .ThrowsAsync(new BadRequestException("Invalid cohort ID"));

        var result = await _controller.UpdateCategory(categoryId, updateDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        badRequestResult.Value.Should().Be("Invalid cohort ID");
    }

    [Fact]
    public async Task DeleteCategory_WithValidId_ReturnsNoContent()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);

        _mockService.Setup(service => service.DeleteCategoryAsync(categoryId))
            .Returns(Task.CompletedTask);

        var result = await _controller.DeleteCategory(categoryId);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteCategory_WithNonExistentId_ReturnsNotFound()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);

        _mockService.Setup(service => service.DeleteCategoryAsync(categoryId))
            .ThrowsAsync(new NotFoundException($"Category with ID {categoryId} not found"));

        var result = await _controller.DeleteCategory(categoryId);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.Value.Should().Be($"Category with ID {categoryId} not found");
    }

    [Fact]
    public async Task AddClustersToCohortCategory_WithValidData_ReturnsNoContent()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId = TestDataFactory.CreateTestGuid(20);

        var dto = TestDataFactory.CreateAddClustersDTO(new List<Guid> { clusterId });

        _mockService.Setup(service => service.AddClustersToCohortCategoryAsync(categoryId, cohortId, dto))
            .Returns(Task.CompletedTask);

        var result = await _controller.AddClustersToCohortCategory(categoryId, cohortId, dto);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task AddClustersToCohortCategory_WithNonExistentCategory_ReturnsNotFound()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);
        var cohortId = TestDataFactory.CreateTestGuid(10);

        var dto = TestDataFactory.CreateAddClustersDTO();

        _mockService.Setup(service => service.AddClustersToCohortCategoryAsync(categoryId, cohortId, dto))
            .ThrowsAsync(new NotFoundException($"Category with ID {categoryId} not found"));

        var result = await _controller.AddClustersToCohortCategory(categoryId, cohortId, dto);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.Value.Should().Be($"Category with ID {categoryId} not found");
    }

    [Fact]
    public async Task AddClustersToCohortCategory_WithInvalidData_ReturnsBadRequest()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);

        var dto = TestDataFactory.CreateAddClustersDTO();

        _mockService.Setup(service => service.AddClustersToCohortCategoryAsync(categoryId, cohortId, dto))
            .ThrowsAsync(new BadRequestException("Cluster does not exist or is not associated with cohort"));

        var result = await _controller.AddClustersToCohortCategory(categoryId, cohortId, dto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        badRequestResult.Value.Should().Be("Cluster does not exist or is not associated with cohort");
    }

    [Fact]
    public async Task RemoveClusterFromCohortCategory_WithValidData_ReturnsNoContent()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId = TestDataFactory.CreateTestGuid(20);

        _mockService.Setup(service => service.RemoveClusterFromCohortCategoryAsync(categoryId, cohortId, clusterId))
            .Returns(Task.CompletedTask);

        var result = await _controller.RemoveClusterFromCohortCategory(categoryId, cohortId, clusterId);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task RemoveClusterFromCohortCategory_WithNonExistentAssociation_ReturnsNotFound()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var clusterId = TestDataFactory.CreateTestGuid(20);

        _mockService.Setup(service => service.RemoveClusterFromCohortCategoryAsync(categoryId, cohortId, clusterId))
            .ThrowsAsync(new NotFoundException("Association not found"));

        var result = await _controller.RemoveClusterFromCohortCategory(categoryId, cohortId, clusterId);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.Value.Should().Be("Association not found");
    }

    [Fact]
    public async Task RemoveCohortFromCategory_WithValidData_ReturnsNoContent()
    {
        var categoryId = TestDataFactory.CreateTestGuid(1);
        var cohortId = TestDataFactory.CreateTestGuid(10);

        _mockService.Setup(service => service.RemoveCohortFromCategoryAsync(categoryId, cohortId))
            .Returns(Task.CompletedTask);

        var result = await _controller.RemoveCohortFromCategory(categoryId, cohortId);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task RemoveCohortFromCategory_WithNonExistentCategory_ReturnsNotFound()
    {
        var categoryId = TestDataFactory.CreateTestGuid(99);
        var cohortId = TestDataFactory.CreateTestGuid(10);

        _mockService.Setup(service => service.RemoveCohortFromCategoryAsync(categoryId, cohortId))
            .ThrowsAsync(new NotFoundException($"Category with ID {categoryId} not found"));

        var result = await _controller.RemoveCohortFromCategory(categoryId, cohortId);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        notFoundResult.Value.Should().Be($"Category with ID {categoryId} not found");
    }

    [Fact]
    public async Task GetCategoriesForCohort_WithValidCohortId_ReturnsOkResultWithCategories()
    {
        var cohortId = TestDataFactory.CreateTestGuid(10);
        var categories = new List<CategoryDetailDTO>
        {
            TestDataFactory.CreateCategoryDetailDTO("Category 1", TestDataFactory.CreateTestGuid(1)),
            TestDataFactory.CreateCategoryDetailDTO("Category 2", TestDataFactory.CreateTestGuid(2))
        };

        _mockService.Setup(service => service.GetCategoriesForCohortAsync(cohortId))
            .ReturnsAsync(categories);

        var result = await _controller.GetCategoriesForCohort(cohortId);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
    }
}    