from rest_framework import serializers
from . import models
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserProfile
        fields = ['ocupacion', 'colonia', 'codigo_postal', 'municipio', 'telefono_celular', 'foto_perfil', 'user']


class AdoptionRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_photo = serializers.CharField(source='user.userprofile.foto_perfil', read_only=True)

    class Meta:
        model = models.AdoptionRequest
        fields = [
            'id', 'user', 'user_name', 'user_photo', 'pet', 'pet_name', 
            'message', 'status', 'date_submitted', 'pet_owner', 'form_data'
        ]
        read_only_fields = ['user', 'pet_owner', 'date_submitted']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = ['id', 'title', 'message', 'date_sent', 'is_read']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError()
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError()
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pet
        fields = ['owner', 'id', 'nombre', 'descripcion', 'tipo', 'imagen', 'size', 'sexo', 'ubicacion', 'edad']



