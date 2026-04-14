from django.db import models
from apps.users.models import User


class Question(models.Model):
    sector = models.CharField(max_length=100)
    text = models.TextField()
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='questions_created',
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='questions_updated',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class QuestionCatalog(models.Model):
    """
    Stores question trees (nested questions + options with score + N/A) as JSON.

    This enables the SuperUser dashboard to manage the question protocol without
    requiring complex recursive DB writes.
    """

    CATEGORY_CHOICES = (
        ("basic", "Basic"),
        ("functional", "Functional"),
        ("sector", "Sector"),
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    # Only used when category='sector'.
    sector_code = models.CharField(max_length=50, null=True, blank=True)

    # Definition is expected to be an array of question nodes:
    # { id, type, text, area?, sector?, options:[{text, score?, isNA?}], children:[...] }
    definition = models.JSONField(default=list)

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="question_catalogs_created",
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="question_catalogs_updated",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("category", "sector_code")
        ordering = ["category", "sector_code"]

    def __str__(self) -> str:
        return f"{self.category}:{self.sector_code or '-'}"
