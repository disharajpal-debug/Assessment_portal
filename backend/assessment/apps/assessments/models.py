from django.db import models
from apps.users.models import User


class Assessment(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sector = models.CharField(max_length=100)
    score = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assessments_created',
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assessments_updated',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    # Assessor/admin review tracking (who last reviewed/adjusted this assessment)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assessments_reviewed",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)


class Response(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    question_id = models.CharField(max_length=32)
    selected_option = models.CharField(max_length=255)

    highlight = models.TextField(blank=True)
    lowlight = models.TextField(blank=True)
    recommendation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)


class AssessorAssignment(models.Model):
    """
    SuperUser mapping: client <-> assessor route with an optional workflow status.
    """

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assessor_assignments_as_client",
    )
    assessor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assessor_assignments_as_assessor",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assessor_assignments_created",
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assessor_assignments_updated",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        unique_together = ("client", "assessor")
        ordering = ["-created_at"]
