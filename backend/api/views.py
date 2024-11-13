from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from . import models
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from google.auth.transport import requests
from google.oauth2 import id_token
from . import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from google.cloud import storage
import uuid
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = serializers.UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": "Usuario creado satisfactoriamente"}, status=status.HTTP_201_CREATED)

    formatted_errors = {
        "error": []
    }
    if 'username' in serializer.errors:
        formatted_errors["error"].append(" El nombre de usuario ya está en uso. ")
    if 'email' in serializer.errors:
        formatted_errors["error"].append(" El correo electrónico ya está registrado. ")

    return Response(formatted_errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            '1002041286983-3nhkndd5ofm22tgggiifiadefgh7ahbe.apps.googleusercontent.com',
            clock_skew_in_seconds=10
        )
        email = idinfo.get('email')
        first_name = idinfo.get('given_name')
        last_name = idinfo.get('family_name')
        if not email:
            return Response({"error": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            "success": "User authenticated successfully",
            "username": user.username,
            "first_name": user.first_name,
            "user_id": user.id,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

    except ValueError as e:
        return Response({"error": f"Invalid token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_pets(request):
    filters = {key: value for key, value in request.GET.items() if value}
    pets = models.Pet.objects.filter(**filters)
    pets_data = list(pets.values())
    return JsonResponse(pets_data, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def pet_detail(request, id):
    pet = get_object_or_404(models.Pet, pk=id)
    serializer = serializers.PetSerializer(pet)
    return JsonResponse(serializer.data, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_pet(request):
    pet_data = request.data.copy()
    pet_data['owner'] = request.user.id
    serializer = serializers.PetSerializer(data=pet_data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_pet(request, pet_id):
    pet = get_object_or_404(models.Pet, id=pet_id, owner=request.user)
    pet_data = request.data.copy()
    if 'imagen' in pet_data and not pet_data['imagen']:
        del pet_data['imagen']
    
    serializer = serializers.PetSerializer(pet, data=pet_data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pet(request, pet_id):
    pet = get_object_or_404(models.Pet, id=pet_id, owner=request.user)
    pet.delete()
    return Response({"message": "Publicación de la mascota eliminada exitosamente."}, status=status.HTTP_204_NO_CONTENT)

client = storage.Client()
bucket_name = "image-pet"

def delete_previous_image(bucket_name, image_url):
    try:
        bucket = client.get_bucket(bucket_name)
        blob = bucket.blob(image_url)
        if blob.exists():
            blob.delete()
            print(f"Imagen {image_url} eliminada exitosamente.")
    except Exception as e:
        print(f"Error al eliminar la imagen anterior: {e}")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No se envió ninguna imagen'}, status=400)
    
    image = request.FILES['image']
    image_type = request.data.get('image_type')
    unique_id = uuid.uuid4()
    prefix = f"{image_type}/" 
    image_name = f"{prefix}{unique_id}_{image.name}"
    
    previous_image_url = request.data.get('previous_image_url')
    if previous_image_url:
        previous_image_name = '/'.join(previous_image_url.split('/')[-2:])
        delete_previous_image(bucket_name, previous_image_name)
    
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(image_name)
    blob.upload_from_file(image, content_type=image.content_type)
    
    image_url = f"https://storage.googleapis.com/{bucket_name}/{image_name}"
    return Response({'image_url': image_url})

class AdoptionRequestListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return models.AdoptionRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        pet = serializer.validated_data['pet']
        pet_owner = pet.owner
        pet_name = pet.nombre

        if models.AdoptionRequest.objects.filter(user=self.request.user, pet=pet, status=models.AdoptionRequest.PENDIENTE).exists():
            raise ValidationError({"detail": "Ya has solicitado adoptar esta mascota y está pendiente."})

        form_data = self.request.data

        for field in ['pet', 'message']:
            if field in form_data:
                del form_data[field]

        serializer.save(
            user=self.request.user, 
            pet_owner=pet_owner,
            pet_name=pet_name,
            form_data=form_data
        )

class AdoptionRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.AdoptionRequest.objects.all()
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def send_notification(self, user, title, message):
        models.Notification.objects.create(
            user=user,
            title=title,
            message=message,
            date_sent=now(),
            is_read=False
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user == instance.pet_owner:
            action = request.data.get('action')
            if action == 'aceptar':
                instance.status = models.AdoptionRequest.APROBADA
                self.send_notification(
                    instance.user,
                    "Solicitud Aprobada",
                    f"Tu solicitud para adoptar a {instance.pet.nombre} ha sido aprobada."
                )
            elif action == 'rechazar':
                instance.status = models.AdoptionRequest.RECHAZADA
                self.send_notification(
                    instance.user,
                    "Solicitud Rechazada",
                    f"Tu solicitud para adoptar a {instance.pet.nombre} ha sido rechazada."
                )
            else:
                return Response({"detail": "Acción inválida."}, status=status.HTTP_400_BAD_REQUEST)

            instance.save()
            serializer = self.get_serializer(instance)
            return Response(
                {"detail": f"Solicitud {action} correctamente.", "solicitud": serializer.data},
                status=status.HTTP_200_OK
            )

        elif request.user == instance.user:
            if instance.status != models.AdoptionRequest.PENDIENTE:
                return Response(
                    {"detail": "Solo puedes modificar solicitudes pendientes."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if "form_data" and "message" in request.data:
                instance.form_data = request.data.get("form_data")
                instance.message = request.data.get("message")
                instance.save()
            
            self.send_notification(
                instance.pet_owner,
                "Solicitud Actualizada",
                f"{request.user.first_name} ha actualizado su solicitud para adoptar a {instance.pet.nombre}."
            )
            return super().update(request, *args, **kwargs)

        return Response(
            {"detail": "No tienes permiso para modificar esta solicitud."},
            status=status.HTTP_403_FORBIDDEN
        )


class PetAdoptionRequestsList(generics.ListAPIView):
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        pet_id = self.kwargs['pet_id']
        return models.AdoptionRequest.objects.filter(pet__id=pet_id)

class NotificationList(generics.ListAPIView):
    serializer_class = serializers.NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.Notification.objects.filter(user=self.request.user)

class NotificationMarkAsRead(generics.UpdateAPIView):
    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        notification = self.get_object()
        if notification.user == self.request.user:
            serializer.save(is_read=True)
        else:
            raise PermissionDenied("No tienes permiso para marcar esta notificación.")

class NotificationDelete(generics.DestroyAPIView):
    queryset = models.Notification.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        notification = self.get_object()
        if notification.user != request.user:
            return Response({"detail": "No tienes permiso para eliminar esta notificación."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile, created = models.UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        profile_serializer = serializers.UserProfileSerializer(profile)
        
        pets = models.Pet.objects.filter(owner=user)
        pets_data = pets.values('id', 'nombre', 'imagen')

        combined_data = {
            'nombre': user.first_name,
            'apellidos': user.last_name,
            'correo': user.email,
            'username': user.username,
            **profile_serializer.data,
            'publicaciones': list(pets_data)
        }

        return Response(combined_data)

    elif request.method == 'POST':
        profile_data = {key: value for key, value in request.data.items() if key not in ['nombre', 'apellidos', 'correo']}
        
        profile_serializer = serializers.UserProfileSerializer(profile, data=profile_data, partial=True)
        
        if profile_serializer.is_valid():
            profile_serializer.save()
            return Response(profile_serializer.data)
        
        return Response(profile_serializer.errors, status=400) 


