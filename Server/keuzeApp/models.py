from django.db import models

class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title

class GraduateProfile(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    link = models.URLField(max_length=200)

    def __str__(self):
        return self.name


class Cluster(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    link = models.URLField(max_length=255)
    locked = models.BooleanField(default=False)
    first_semester = models.BooleanField(default=False)
    last_semester = models.BooleanField(default=False)
    free_choice = models.BooleanField(default=False)
    required_ec = models.IntegerField()
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Prerequisite(models.Model):
    required_year = models.IntegerField()

    def __str__(self):
        return self.required_year

class Cohort(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class CohortCluster(models.Model):
    cluster_id = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    cohort_id = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('cluster_id', 'cohort_id')

class ClusterGraduateProfileCohort(models.Model):
    graduate_profile_id = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE)
    cluster_id = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    cohort_id = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('graduate_profile_id', 'cluster_id', 'cohort_id')

class PrerequisiteCluster(models.Model):
    cluster_id = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    prerequisite_cluster_id = models.ForeignKey(Prerequisite, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('cluster_id', 'prerequisite_cluster_id')