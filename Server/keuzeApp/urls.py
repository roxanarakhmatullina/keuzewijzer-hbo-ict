from django.urls import path, include
from .views import ClusterView, ClusterViewAll
from .routers import router
import os

urlpatterns = [
    path('', include(router.urls)),
    path('clusters/', ClusterView.as_view(), name='cluster-view'),
    path('clustersall/', ClusterViewAll.as_view(), name='cluster-view2'),
]