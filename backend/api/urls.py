from django.urls import path
from . import views

urlpatterns = [
    path('pets/', views.list_pets, name='list_pets'),
]
