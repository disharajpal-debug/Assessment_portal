from django.urls import path

from .views import QuestionCreateView, QuestionCatalogView

urlpatterns = [
    path('create/', QuestionCreateView.as_view(), name='question-create'),
    path('catalog/', QuestionCatalogView.as_view(), name='question-catalog'),
]
