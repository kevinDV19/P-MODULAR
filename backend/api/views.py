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

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"success": "User created successfully"}, status=status.HTTP_201_CREATED)

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
        name = idinfo.get('name')
        google_id = idinfo.get('sub')

        if not email:
            return Response({"error": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()

        if not user:
            username = email.split('@')[0]  
            user = User.objects.create_user(username=username, email=email)
            return Response({"success": "User created successfully", "username": user.username}, status=status.HTTP_201_CREATED)

        return Response({"success": "User authenticated successfully", "username": user.username}, status=status.HTTP_200_OK)

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
        pet =models.Pet.objects.get(pk=id)
        return JsonResponse({
            'id': pet.id,             
            'nombre': pet.nombre, 
            'descripcion': pet.descripcion, 
            'imagen': pet.imagen, 
            'size': pet.size, 
            'sexo': pet.sexo, 
            'ubicacion': pet.ubicacion,
            'edad': pet.edad,
        })
    except models.Pet.DoesNotExist:
        return JsonResponse({'error': 'Pet not found'}, status=404)

# Vista para listar y crear solicitudes de adopción
class AdoptionRequestListCreate(generics.ListCreateAPIView):
    queryset = models.AdoptionRequest.objects.all()
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def perform_create(self, serializer):
        pet = serializer.validated_data['pet']
        pet_owner = pet.owner  # Asumiendo que tienes un campo 'owner' en el modelo Pet
        serializer.save(user=self.request.user, pet_owner=pet_owner)

# Vista para manejar solicitudes individuales (detalles, actualización, eliminación)
class AdoptionRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.AdoptionRequest.objects.all()
    serializer_class = serializers.AdoptionRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = request.method == 'PATCH'
        instance = self.get_object()
        
        if request.data.get('action') == 'aceptar':
            instance.status = models.AdoptionRequest.APROBADA
        elif request.data.get('action') == 'rechazar':
            instance.status = models.AdoptionRequest.RECHAZADA
        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

