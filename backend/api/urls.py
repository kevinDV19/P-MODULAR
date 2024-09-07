from django.urls import path
from . import views

urlpatterns = [
    path('pets/', views.list_pets, name='list_pets'),
    path('register/', views.register, name='register'),
    path('google/', views.google_login, name='google_login'),
    path('search/', views.search_pets, name='search_pets'),
]

