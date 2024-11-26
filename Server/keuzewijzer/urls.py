"""
URL configuration for keuzewijzer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import os
from dotenv import load_dotenv

load_dotenv()
print(f"Loaded DJANGO_PRODUCTION: {os.getenv('DJANGO_PRODUCTION')}")
inProduction = os.getenv('DJANGO_PRODUCTION')

if inProduction == "True":
    api_path = "v2/api"
else:
    api_path = "api"

urlpatterns = [
    path(f'{api_path}/admin/', admin.site.urls),
    path(f'{api_path}', include('keuzeApp.urls'))
]


