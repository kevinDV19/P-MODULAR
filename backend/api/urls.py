from django.urls import path
from . import views

urlpatterns = [
    path('pets/', views.list_pets, name='list_pets'),
    path('register/', views.register, name='register'),
    path('search/', views.search_pets, name='search_pets'),
]

