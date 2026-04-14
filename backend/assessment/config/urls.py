"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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

from .views import api_root, v1_models
from apps.assessments.views import AssessorDashboardView

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    # OpenAI-compatible stub endpoint (used by some tooling).
    path('v1/models', v1_models),
    path('v1/models/', v1_models),
    path('api/auth/', include('apps.users.urls')),
    path('api/assessment/', include('apps.assessments.urls')),
    path('api/assessor/dashboard/', AssessorDashboardView.as_view(), name='api-assessor-dashboard'),
    path('api/questions/', include('apps.questions.urls')),
    path('api/sectors/', include('apps.sectors.urls')),
]
