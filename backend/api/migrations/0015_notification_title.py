# Generated by Django 5.1 on 2024-11-08 00:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_userprofile_foto_perfil'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='title',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]