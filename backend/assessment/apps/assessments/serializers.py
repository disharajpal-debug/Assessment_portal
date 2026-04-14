from rest_framework import serializers
from .models import Assessment, Response, AssessorAssignment
from apps.users.models import User
from apps.sectors.models import Sector


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        exclude = ['assessment']


class AssessmentSerializer(serializers.ModelSerializer):
    # Read/write shape:
    # - Client POSTs `responses: [...]`
    # - We also return `responses: [...]` from DB reverse accessor `response_set`
    responses = ResponseSerializer(many=True, write_only=True, required=False)
    responses_out = ResponseSerializer(many=True, source='response_set', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    client_name = serializers.SerializerMethodField()
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    updated_by = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewed_by = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Assessment
        fields = [
            "id",
            "user",
            "client_name",
            "sector",
            "score",
            "status",
            "responses",
            "responses_out",
            "created_by",
            "updated_by",
            "reviewed_by",
            "reviewed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
            'user',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
        )

    def get_client_name(self, obj):
        return obj.user.username if obj.user else 'Unknown Client'

    def validate_sector(self, value):
        if value in (None, ""):
            raise serializers.ValidationError("Sector is required.")

        if Sector.objects.exists():
            if not Sector.objects.filter(code=value).exists():
                raise serializers.ValidationError("Invalid sector selected.")
            return value

        valid_sectors = {choice[0] for choice in User.SECTOR_CHOICES}
        if value not in valid_sectors:
            raise serializers.ValidationError("Invalid sector selected.")
        return value

    def validate_responses(self, value):
        return value if value is not None else []

    def validate(self, attrs):
        status = attrs.get('status', 'draft')
        if status not in {'draft', 'submitted'}:
            raise serializers.ValidationError({'status': 'Invalid assessment status.'})
        responses = attrs.get('responses')
        if status == 'submitted' and not responses:
            raise serializers.ValidationError(
                {'responses': 'At least one response is required for submission.'}
            )
        return attrs

    def create(self, validated_data):
        responses_data = validated_data.pop('responses', None) or []
        assessment = Assessment.objects.create(**validated_data)

        for res in responses_data:
            Response.objects.create(assessment=assessment, **res)

        return assessment

    def update(self, instance, validated_data):
        responses_data = validated_data.pop('responses', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If responses are supplied, replace existing rows.
        if responses_data is not None:
            Response.objects.filter(assessment=instance).delete()
            for res in responses_data:
                Response.objects.create(assessment=instance, **res)

        return instance


class AssessorAssignmentSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField(read_only=True)
    assessor_name = serializers.SerializerMethodField(read_only=True)
    client_email = serializers.SerializerMethodField(read_only=True)
    assessor_email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AssessorAssignment
        fields = [
            "id",
            "client",
            "assessor",
            "status",
            "client_name",
            "assessor_name",
            "client_email",
            "assessor_email",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "client_name",
            "assessor_name",
            "client_email",
            "assessor_email",
            "created_at",
            "updated_at",
        ]

    def get_client_name(self, obj):
        return obj.client.username if obj.client else None

    def get_assessor_name(self, obj):
        return obj.assessor.username if obj.assessor else None

    def get_client_email(self, obj):
        return obj.client.email if obj.client else None

    def get_assessor_email(self, obj):
        return obj.assessor.email if obj.assessor else None

    def validate(self, attrs):
        # Enforce allowed roles for mapping.
        client = attrs.get("client")
        assessor = attrs.get("assessor")
        if client and client.role != "client":
            raise serializers.ValidationError(
                {"client": "Client user must have role 'client'."}
            )
        if assessor and assessor.role != "assessor":
            raise serializers.ValidationError(
                {"assessor": "Assessor user must have role 'assessor'."}
            )
        return attrs
