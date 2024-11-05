from django.urls import path, include

from .routers import router

urlpatterns = [
    path('api/', include(router.urls)),  # No need for a tuple or namespace unless required
]