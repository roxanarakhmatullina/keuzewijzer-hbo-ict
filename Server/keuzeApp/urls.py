from django.urls import path, include
from .views import ClusterView, ClusterView_all
from .routers import router
import os

urlpatterns = [
    path('', include(router.urls)),
    path('clusters/', ClusterView.as_view(), name='cluster-view'),
    path('clustersall/', ClusterView_all.as_view(), name='cluster-view2'),
]