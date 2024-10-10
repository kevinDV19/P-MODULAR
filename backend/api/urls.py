from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('google/', views.google_login, name='google_login'),
    path('search/', views.search_pets, name='search_pets'),
    path('pets/<int:id>/', views.pet_detail, name='pet_detail'),
    path('adoption-request/', views.AdoptionRequestListCreate.as_view(), name='adoption-request-list-create'),
    path('adoption-request/<int:pk>/', views.AdoptionRequestDetail.as_view(), name='adoption-request-detail'),
    path('notifications/', views.NotificationList.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', views.NotificationMarkAsRead.as_view(), name='notification-mark-as-read'),
    path('user/profile/', views.user_profile, name='user-profile'),
]


