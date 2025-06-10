using System;
using System.Collections.Generic;
using Server.Models;
using Server.DataTransferObjects;

namespace Server.Tests.Helpers
{
    public static class TestDataFactory
    {
        public static Guid CreateTestGuid(int number = 1)
        {
            return new Guid($"00000000-0000-0000-0000-{number:D12}");
        }
        
        public static Category CreateCategory(string? name = "Test Category", Guid? id = null)
        {
            return new Category
            {
                Id = id ?? CreateTestGuid(),
                Name = name ?? "Test Category"
            };
        }
        
        public static CategoryDTO CreateCategoryDTO(string? name = "Test Category", Guid? id = null)
        {
            return new CategoryDTO
            {
                Id = id ?? CreateTestGuid(),
                Name = name ?? "Test Category"
            };
        }
        
        public static CategoryDetailDTO CreateCategoryDetailDTO(
            string? name = "Test Category", 
            Guid? id = null,
            List<CohortClustersDetailDTO>? cohortClusters = null)
        {
            return new CategoryDetailDTO
            {
                Id = id ?? CreateTestGuid(),
                Name = name ?? "Test Category",
                CohortClusters = cohortClusters ?? new List<CohortClustersDetailDTO>()
            };
        }
        
        public static CategoryCreateUpdateDTO CreateCategoryCreateUpdateDTO(
            string? name = "Test Category",
            List<CohortClustersDTO>? cohortClusters = null)
        {
            return new CategoryCreateUpdateDTO
            {
                Name = name ?? "Test Category",
                CohortClusters = cohortClusters ?? new List<CohortClustersDTO>()
            };
        }
        
        public static CohortClustersDTO CreateCohortClustersDTO(
            Guid? cohortId = null,
            List<Guid>? clusterIds = null)
        {
            return new CohortClustersDTO
            {
                CohortId = cohortId ?? CreateTestGuid(),
                ClusterIds = clusterIds ?? new List<Guid>()
            };
        }
        
        public static CohortClustersDetailDTO CreateCohortClustersDetailDTO(
            Guid? cohortId = null,
            string cohortName = "Test Cohort",
            List<ClusterDetailDTO>? clusters = null)
        {
            return new CohortClustersDetailDTO
            {
                CohortId = cohortId ?? CreateTestGuid(),
                CohortName = cohortName ?? "Test Cohort",
                Clusters = clusters ?? new List<ClusterDetailDTO>()
            };
        }
        
        public static ClusterDetailDTO CreateClusterDetailDTO(
            Guid? id = null,
            string name = "Test Cluster")
        {
            return new ClusterDetailDTO
            {
                Id = id ?? CreateTestGuid(),
                Name = name
            };
        }
        
        public static AddClustersDTO CreateAddClustersDTO(List<Guid>? clusterIds = null)
        {
            return new AddClustersDTO
            {
                ClusterIds = clusterIds ?? new List<Guid> { CreateTestGuid() }
            };
        }
        
        public static Cohort CreateCohort(
            Guid? id = null,
            string name = "Test Cohort",
            bool isAvailable = true)
        {
            return new Cohort
            {
                Id = id ?? CreateTestGuid(),
                Name = name ?? "Test Cohort",
                isAvailable = isAvailable
            };
        }
        
        public static Cluster CreateCluster(
            Guid? id = null,
            string name = "Test Cluster",
            bool firstSemester = true,
            bool lastSemester = false,
            ClusterLevel level = ClusterLevel.Level1)
        {
            return new Cluster
            {
                Id = id ?? CreateTestGuid(),
                Name = name ?? "Test Cluster",
                FirstSemester = firstSemester,
                LastSemester = lastSemester,
                Level = level
            };
        }
        
        public static CategoryCohortCluster CreateCategoryCohortCluster(
            Guid? id = null,
            Guid? categoryId = null,
            Guid? cohortId = null,
            Guid? clusterId = null,
            Category? category = null,
            Cohort? cohort = null,
            Cluster? cluster = null)
        {
            return new CategoryCohortCluster
            {
                Id = id ?? CreateTestGuid(),
                CategoryId = categoryId ?? (category?.Id ?? CreateTestGuid()),
                CohortId = cohortId ?? (cohort?.Id ?? CreateTestGuid()),
                ClusterId = clusterId ?? (cluster?.Id ?? CreateTestGuid()),
                Category = category,
                Cohort = cohort,
                Cluster = cluster
            };
        }
    }
}
