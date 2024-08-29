from django.http import JsonResponse
from .models import Pet

def list_pets(request):
    pets = list(Pet.objects.values())
    return JsonResponse(pets, safe=False)
