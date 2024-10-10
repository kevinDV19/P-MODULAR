from django.http import JsonResponse
from . import models
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from google.auth.transport import requests
from google.oauth2 import id_token
from . import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

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
            '101162202522-uoj3u5jcdsp6lhj7a9kr15e4jcvqmebf.apps.googleusercontent.com', 
            clock_skew_in_seconds = 10
        )

        email = idinfo.get('email')
        first_name = idinfo.get('given_name')
        last_name = idinfo.get('family_name')

        if not email:
            return Response({"error": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()

        if not user:
            username = email.split('@')[0]  
            user = User.objects.create_user(username=username, email=email, first_name=first_name, last_name=last_name)
            

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": "User authenticated successfully",
            "username": user.username,
            "first_name": user.first_name,
            "access": str(refresh.access_token),  
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

    except ValueError as e:
        return Response({"error": f"Invalid token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
def search_pets(request):
    tipo = request.GET.get('tipo', '')
    size = request.GET.get('size', '')
    sexo = request.GET.get('sexo', '')
    ubicacion = request.GET.get('ubicacion', '')
    edad = request.GET.get('edad', '')

    filters = {}
    if tipo:
        filters['tipo'] = tipo
    if size:
        filters['size'] = size
    if sexo:
        filters['sexo'] = sexo
    if ubicacion:
        filters['ubicacion'] = ubicacion
    if edad:
        filters['edad'] = edad

    try:
        pets = models.Pet.objects.filter(**filters)
        pets_data = list(pets.values())  
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse(pets_data, safe=False)

def pet_detail(request, id):
    try:
        pet = models.Pet.objects.get(pk=id)
        serializer = serializers.PetSerializer(pet)  
        return JsonResponse(serializer.data, status=200)  
    except models.Pet.DoesNotExist:
        return JsonResponse({'error': 'Pet not found'}, status=404)

class AdoptionRequestListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return models.AdoptionRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        pet = serializer.validated_data['pet']
        pet_owner = pet.owner

        if models.AdoptionRequest.objects.filter(user=self.request.user, pet=pet, status=models.AdoptionRequest.PENDIENTE).exists():
            raise ValidationError({"detail": "Ya has solicitado adoptar esta mascota y está pendiente."})

        form_data = self.request.data

        for field in ['pet', 'message']:
            if field in form_data:
                del form_data[field]

        serializer.save(
            user=self.request.user, 
            pet_owner=pet_owner,
            form_data=form_data
        )

class AdoptionRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.AdoptionRequest.objects.all()
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user == instance.pet_owner:
            action = request.data.get('action')
            if action == 'aceptar':
                instance.status = models.AdoptionRequest.APROBADA
            elif action == 'rechazar':
                instance.status = models.AdoptionRequest.RECHAZADA
            else:
                return Response({"detail": "Acción inválida."}, status=status.HTTP_400_BAD_REQUEST)
            
            instance.save()
            serializer = self.get_serializer(instance)
            return Response({"detail": f"Solicitud {action} correctamente.", "solicitud": serializer.data}, status=status.HTTP_200_OK)
        
        elif request.user == instance.user:
            if instance.status != models.AdoptionRequest.PENDIENTE:
                return Response({"detail": "Solo puedes modificar solicitudes pendientes."}, status=status.HTTP_400_BAD_REQUEST)
            
            return super().update(request, *args, **kwargs)

        return Response({"detail": "No tienes permiso para modificar esta solicitud."}, status=status.HTTP_403_FORBIDDEN)

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
        notification = serializer.save(is_read=True)

@api_view(['GET', 'POST'])
def user_profile(request):
    user = request.user
    profile, created = models.UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        profile_serializer = serializers.UserProfileSerializer(profile)
     
        combined_data = {
            'nombre': user.first_name,
            'apellidos': user.last_name,
            'correo': user.email,
            **profile_serializer.data
        }

        return Response(combined_data)

    elif request.method == 'POST':
        profile_data = {key: value for key, value in request.data.items() if key not in ['nombre', 'apellidos', 'correo']}
        
        profile_serializer = serializers.UserProfileSerializer(profile, data=profile_data, partial=True)
        
        if profile_serializer.is_valid():
            profile_serializer.save()
            return Response(profile_serializer.data)
        
        return Response(profile_serializer.errors, status=400)


