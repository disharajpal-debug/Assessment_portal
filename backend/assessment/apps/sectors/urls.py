from django.urls import path

from .views import SectorListCreateView, SectorDetailView

urlpatterns = [
    path("", SectorListCreateView.as_view(), name="sector-list-create"),
    path("<int:pk>/", SectorDetailView.as_view(), name="sector-detail"),
]

