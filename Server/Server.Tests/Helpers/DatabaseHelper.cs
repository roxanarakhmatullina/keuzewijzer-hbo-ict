using System;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Server.Tests.Helpers
{
    public static class DatabaseHelper
    {
        public static DataContext CreateInMemoryDatabase()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                // Suppress 'transactions not supported' warning for in-memory db.
                .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;
                
            var context = new DataContext(options);
            return context;
        }
        
        public static void SeedDatabase(DataContext context)
        {
            var category1 = TestDataFactory.CreateCategory("HBO-ICT", TestDataFactory.CreateTestGuid(1));
            var category2 = TestDataFactory.CreateCategory("Miscellaneous", TestDataFactory.CreateTestGuid(2));
            
            var cohort1 = TestDataFactory.CreateCohort(TestDataFactory.CreateTestGuid(11), "2024");
            var cohort2 = TestDataFactory.CreateCohort(TestDataFactory.CreateTestGuid(12), "2025");
            
            var cluster1 = TestDataFactory.CreateCluster(TestDataFactory.CreateTestGuid(21), "Web Development");
            var cluster2 = TestDataFactory.CreateCluster(TestDataFactory.CreateTestGuid(22), "Quality in Software Development");
            var cluster3 = TestDataFactory.CreateCluster(TestDataFactory.CreateTestGuid(23), "Business Process Management");
            
            // Cohort-cluster relationships.
            cluster1.Cohorts = new List<Cohort> { cohort1, cohort2 };
            cluster2.Cohorts = new List<Cohort> { cohort1, cohort2 };
            cluster3.Cohorts = new List<Cohort> { cohort2 };
            
            context.Categories.AddRange(category1, category2);
            context.Cohorts.AddRange(cohort1, cohort2);
            context.Clusters.AddRange(cluster1, cluster2, cluster3);
            
            // Category-cohort-cluster junctions.
            var junction1 = TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(31),
                category1.Id, cohort1.Id, cluster1.Id,
                category1, cohort1, cluster1);
                
            var junction2 = TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(32),
                category1.Id, cohort1.Id, cluster2.Id,
                category1, cohort1, cluster2);
                
            var junction3 = TestDataFactory.CreateCategoryCohortCluster(
                TestDataFactory.CreateTestGuid(33),
                category2.Id, cohort2.Id, cluster3.Id,
                category2, cohort2, cluster3);
            
            context.CategoryCohortClusters.AddRange(junction1, junction2, junction3);
            
            context.SaveChanges();
        }
    }
}
