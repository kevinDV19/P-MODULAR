# Generated by Django 5.1 on 2024-10-23 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_remove_userprofile_apellidos_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='adoptionrequest',
            name='pet_name',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
