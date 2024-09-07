from django.http import JsonResponse
from .models import Pet
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from google.auth.transport import requests
from google.oauth2 import id_token

def list_pets(request):
    pets = list(Pet.objects.values())
    return JsonResponse(pets, safe=False)

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
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), '101162202522-5sijoh7hg8jpco4ndup6a2bifsm9r9to.apps.googleusercontent.com')

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
        pets = Pet.objects.filter(**filters)
        pets_data = list(pets.values())  # Convertir QuerySet a lista de diccionarios
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse(pets_data, safe=False)
