from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title


class GraduateProfile(models.Model):
    name = models.CharField(max_length=255)
    color = models.TextField()

    def __str__(self):
        return self.name


class Cohort(models.Model):
    name = models.CharField(max_length=255)

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
    year = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class ClusterGraduateProfileCohort(models.Model):
    graduate_profile = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE)
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE,   related_name='cohorts_profiles')
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('graduate_profile', 'cluster', 'cohort')
