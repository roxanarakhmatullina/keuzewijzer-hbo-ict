from django.urls import path, include
from .views import ClusterView
from .routers import router
import os

api_path = 'v2/api/keuzeApp/api/' if os.getenv('DJANGO_PRODUCTION') else 'api/'

urlpatterns = [
    path(f'{api_path}', include(router.urls)),
    path(f'{api_path}clusters/', ClusterView.as_view(), name='cluster-view'),
]