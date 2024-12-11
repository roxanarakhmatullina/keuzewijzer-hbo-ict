from django.contrib import admin
from .models import *

class ClusterAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    filter_horizontal = [] # This allows for a better UI for Many-to-Many fields

# Register your models here.
admin.site.register(Category)
admin.site.register(GraduateProfile)
admin.site.register(Cluster, ClusterAdmin)
admin.site.register(Prerequisite)
admin.site.register(Cohort)
admin.site.register(ClusterGraduateProfileCohort)

#username : superuser03
#email: S1218343@student.windesheim.nl
#pwd: test030
