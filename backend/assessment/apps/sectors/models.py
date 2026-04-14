from django.db import models

from apps.users.models import User


class Sector(models.Model):
    """
    Sector master data for the portal.

    The frontend uses sector codes (e.g. `textile`, `pharmaceutical`) and expects them
    to be validated consistently across registration, assessment questions, and reporting.
    """

    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sectors_created",
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sectors_updated",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"
