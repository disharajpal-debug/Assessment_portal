from rest_framework import serializers
from apps.users.models import User
from apps.sectors.models import Sector
from .models import Question, QuestionCatalog


class QuestionSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    updated_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ('created_by', 'updated_by', 'created_at', 'updated_at')

    def validate_sector(self, value):
        if value in (None, ''):
            return value

        if Sector.objects.exists():
            if not Sector.objects.filter(code=value).exists():
                raise serializers.ValidationError('Invalid sector selected.')
            return value

        valid_sectors = {choice[0] for choice in User.SECTOR_CHOICES}
        if value not in valid_sectors:
            raise serializers.ValidationError('Invalid sector selected.')
        return value


class QuestionCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionCatalog
        fields = ["id", "category", "sector_code", "definition", "updated_at", "created_at"]
        read_only_fields = ["id", "updated_at", "created_at"]

    def validate(self, attrs):
        category = attrs.get("category")
        sector_code = attrs.get("sector_code")

        if category == "sector":
            if not sector_code:
                raise serializers.ValidationError({"sector_code": "sector_code is required for category='sector'."})

        if category in ("basic", "functional"):
            # Ignore sector_code for non-sector categories.
            attrs["sector_code"] = None

        # Light validation against Sector master data when present.
        if sector_code and Sector.objects.exists():
            if not Sector.objects.filter(code=sector_code).exists():
                raise serializers.ValidationError({"sector_code": "Invalid sector selected."})

        definition = attrs.get("definition")
        if definition is None:
            attrs["definition"] = []
        if not isinstance(definition, list):
            raise serializers.ValidationError({"definition": "Definition must be a list (question nodes tree)."})

        return attrs
