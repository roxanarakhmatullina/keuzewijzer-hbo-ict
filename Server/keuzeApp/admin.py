from django.contrib import admin
from .models import Category, GraduateProfile, Cluster, Prerequisite, Cohort, CohortCluster


# Register your models here.
admin.site.register(Category)
admin.site.register(GraduateProfile)
admin.site.register(Cluster)
admin.site.register(Prerequisite)
admin.site.register(Cohort)
admin.site.register(CohortCluster)

#username : superuser03
#email: S1218343@student.windesheim.nl
#pwd: test030
