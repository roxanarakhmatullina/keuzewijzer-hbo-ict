from rest_framework import routers

from django.urls import path, include

from .views import CategoryViewSet, ClusterViewSet, GraduateProfileViewSet, PrerequisiteViewSet, CohortViewSet, CohortClusterViewSet, MessageValidationViewSet

router = routers.SimpleRouter()
router.register(r'categories', CategoryViewSet, basename="categories")
router.register(r'clusters', ClusterViewSet, basename="clusters")
router.register(r'graduate-profiles', GraduateProfileViewSet, basename="graduate-profiles")
router.register(r'prerequisites', PrerequisiteViewSet, basename="prerequisites")
router.register(r'cohorts', CohortViewSet, basename="cohorts")
router.register(r'cohort-clusters', CohortClusterViewSet, basename="cohort-clusters")
router.register(r'message-validation', MessageValidationViewSet, basename="message-validation")

urlpatterns = [
    path('api/', include(router.urls)),
]












