from rest_framework import serializers

from .models import Sector


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ["id", "code", "name", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

