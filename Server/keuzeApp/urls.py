from django.urls import path, include
from .views import ClusterView
from .routers import router
import os

urlpatterns = [
    path('/', include(router.urls)),  # No need for a tuple or namespace unless required
    path('/clusters/', ClusterView.as_view(), name='cluster-view'),
]