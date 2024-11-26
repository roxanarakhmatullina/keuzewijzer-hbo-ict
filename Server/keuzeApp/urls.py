from django.urls import path, include
from .views import ClusterView
from .routers import router
import os

# Set the API path based on the DJANGO_PRODUCTION environment variable
# api_path = ""
# if os.getenv('DJANGO_PRODUCTION') == True:
#     api_path = "/"
# else:
#     api_path = "/"

urlpatterns = [
    path('/', include(router.urls)),  # No need for a tuple or namespace unless required
    path('/clusters/', ClusterView.as_view(), name='cluster-view'),
]