from django.urls import path, include
from .views import ClusterView, ClusterView2
from .routers import router
import os

urlpatterns = [
    path('', include(router.urls)),
    path('clusters/', ClusterView.as_view(), name='cluster-view'),
    path('clusters2/', ClusterView2.as_view(), name='cluster-view2'),
]