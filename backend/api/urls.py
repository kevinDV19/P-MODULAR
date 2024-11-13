from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('google/', views.google_login, name='google_login'),
    path('search/', views.search_pets, name='search_pets'),
    path('pet/<int:id>/', views.pet_detail, name='pet_detail'),
    path('pet/register/', views.register_pet, name='register_pet'),
    path('pet/edit/<int:pet_id>/', views.edit_pet, name='edit_pet'),
    path('pet/delete/<int:pet_id>/', views.delete_pet, name='delete_pet'),
    path('adoption-request/', views.AdoptionRequestListCreate.as_view(), name='adoption-request-list-create'),
    path('adoption-request/<int:pk>/', views.AdoptionRequestDetail.as_view(), name='adoption-request-detail'),
    path('pet/<int:pet_id>/adoption-requests/', views.PetAdoptionRequestsList.as_view(), name='pet-adoption-requests'),
    path('notifications/', views.NotificationList.as_view(), name='notification-list'),
    path('notifications/<int:pk>/mark-as-read/', views.NotificationMarkAsRead.as_view(), name='notification-mark-as-read'),
    path('notifications/<int:pk>/delete/', views.NotificationDelete.as_view(), name='notification-delete'),
    path('user/profile/', views.user_profile, name='user_profile'),
    path('upload-image/', views.upload_image, name='upload_image'),
]


