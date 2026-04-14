from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('assessor', 'Assessor'),
        ('admin', 'Admin'),
        ('superuser', 'SuperUser'),
    )

    SECTOR_CHOICES = (
        ('textile', 'Textile'),
        ('pharmaceutical', 'Pharmaceutical'),
        ('chemicals', 'Chemicals'),
        ('wire_cable', 'Wire & Cable'),
        ('engineering_goods', 'Engineering Goods'),
        ('plastic_packaging', 'Plastic & Packaging'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    sector = models.CharField(max_length=100, null=True, blank=True)
    assessor_sectors = models.ManyToManyField(
        'sectors.Sector',
        blank=True,
        related_name='assigned_assessors',
    )
