# Generated by Django 5.1 on 2024-09-03 19:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_pet_edad_alter_pet_imagen_alter_pet_nombre_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pet',
            name='size',
            field=models.CharField(max_length=100),
        ),
    ]
