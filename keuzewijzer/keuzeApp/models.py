from django.db import models

class Categorie(models.Model):
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

class Year(models.Model):
    year = models.IntegerField()

    def __str__(self):
        return str(self.year)

class Cluster(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Categorie, on_delete=models.CASCADE)
    link = models.URLField(max_length=200)
    locked = models.BooleanField(default=False)
    offering_period = models.IntegerField()
    is_first_cluster = models.BooleanField(default=False)
    is_last_cluster = models.BooleanField(default=False)
    free_choice = models.BooleanField(default=False)
    year = models.IntegerField()

    def __str__(self):
        return self.name

class Prerequisite(models.Model):
    cluster = models.ForeignKey(Cluster, related_name='cluster_prerequisite', on_delete=models.CASCADE)
    prerequisite_cluster = models.ForeignKey(Cluster, related_name='prerequisite_cluster', on_delete=models.CASCADE)
    required_year = models.IntegerField()

    def __str__(self):
        return f"{self.cluster.name} -> {self.prerequisite_cluster.name}"

class Cohort(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class ClusterYear(models.Model):
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    year = models.ForeignKey(Year, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('cluster', 'year')

class CohortCluster(models.Model):
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('cluster', 'cohort')

class ClusterGraduateProfileCohort(models.Model):
    graduate_profile = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE)
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('graduate_profile', 'cluster', 'cohort')
