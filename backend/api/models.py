from django.db import models
from django.contrib.auth.models import User

class Pet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100, null=False)
    size = models.CharField(max_length=100, null=False)
    edad = models.CharField(max_length=100, null=False)
    ubicacion = models.CharField(max_length=100, null=False)
    descripcion = models.TextField()
    imagen = models.CharField(max_length=255, null=False)
    sexo = models.CharField(max_length=100, null=False)
    tipo = models.CharField(max_length=100, null=False)

    def __str__(self):
        return self.nombre

class AdoptionRequest(models.Model):
    PENDIENTE = 'pendiente'
    APROBADA = 'aprobada'
    RECHAZADA = 'rechazada'
    
    STATUS_CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (APROBADA, 'Aprobada'),
        (RECHAZADA, 'Rechazada'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # El usuario que solicita la adopción
    pet = models.ForeignKey('Pet', on_delete=models.CASCADE)  # La mascota que se va a adoptar
    pet_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoption_requests')
    message = models.TextField(blank=True, null=True)  # Mensaje opcional del usuario
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDIENTE)
    date_submitted = models.DateTimeField(auto_now_add=True)  # Fecha de la solicitud

    def __str__(self):
        return f"Solicitud de {self.user.username} para adoptar a {self.pet.name}"
    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Notificación para {self.user.username}: {self.message}'