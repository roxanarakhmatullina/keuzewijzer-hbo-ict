from rest_framework import routers

from django.urls import path, include

from .views import CategoryViewSet, GraduateProfileViewSet, CohortViewSet, MessageValidationViewSet

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet, basename="categories")
router.register(r'graduate-profiles', GraduateProfileViewSet, basename="graduate-profiles")
router.register(r'cohorts', CohortViewSet, basename="cohorts")
router.register(r'message-validation', MessageValidationViewSet, basename="message-validation")













