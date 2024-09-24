from rest_framework import serializers
from . import models

class AdoptionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AdoptionRequest
        fields = ['id', 'user', 'pet', 'message', 'status', 'date_submitted', 'pet_owner']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = ['id', 'message', 'date_sent', 'is_read']

