from django.db import models



class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    value = models.IntegerField()


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
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)


    def __str__(self):
        return self.name


class ClusterGraduateProfileCohort(models.Model):
    graduate_profile_id = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE)
    cluster_id = models.ForeignKey(Cluster, on_delete=models.CASCADE,   related_name='cohorts_profiles')
    cohort_id = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('graduate_profile_id', 'cluster_id', 'cohort_id')

