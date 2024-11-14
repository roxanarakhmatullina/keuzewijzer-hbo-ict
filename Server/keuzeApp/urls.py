from django.urls import path, include

from .views import ClusterView
from .routers import router

urlpatterns = [
    path('api/', include(router.urls)),  # No need for a tuple or namespace unless required
    path('api/clusters/', ClusterView.as_view(), name='cluster-view'),
]