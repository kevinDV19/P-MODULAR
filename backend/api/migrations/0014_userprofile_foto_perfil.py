# Generated by Django 5.1 on 2024-10-30 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_adoptionrequest_pet_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='foto_perfil',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]