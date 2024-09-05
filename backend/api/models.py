from django.db import models

class Pet(models.Model):
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
