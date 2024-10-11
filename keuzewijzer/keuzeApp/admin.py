from django.contrib import admin
from .models import Categorie, GraduateProfile, Year, ClusterYear, Cluster, Prerequisite, Cohort, CohortCluster


# Register your models here.
admin.site.register(Categorie)
admin.site.register(GraduateProfile)
admin.site.register(Year)
admin.site.register(Cluster)
admin.site.register(Prerequisite)
admin.site.register(Cohort)
admin.site.register(ClusterYear)
admin.site.register(CohortCluster)

#username : superuser03
#email: S1218343@student.windesheim.nl
#pwd: test030
