from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ocupacion = models.CharField(max_length=100, blank=True, null=True)
    colonia = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal = models.CharField(max_length=10, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    telefono_celular = models.CharField(max_length=15, blank=True, null=True)
    foto_perfil = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()

class AdoptionRequest(models.Model):
    PENDIENTE = 'pendiente'
    APROBADA = 'aprobada'
    RECHAZADA = 'rechazada'
    
    STATUS_CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (APROBADA, 'Aprobada'),
        (RECHAZADA, 'Rechazada'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    pet = models.ForeignKey('Pet', on_delete=models.CASCADE)
    pet_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adoption_requests')
    pet_name = models.CharField(max_length=255, blank=True)  
    message = models.TextField(blank=True, null=True) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDIENTE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    form_data = models.JSONField(null=True, blank=True) 

    def __str__(self):
        return f"Solicitud de {self.user.username} creada"
    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Notificación para {self.user.username}: {self.message}'