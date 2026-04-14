from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User
from apps.sectors.models import Sector


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=False, default='client')
    company_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sector = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    assessor_sectors = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'company_name', 'sector', 'assessor_sectors']

    def validate_password(self, value):
        from django.core.exceptions import ValidationError as DjangoValidationError
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate_sector(self, value):
        """
        Validate sector codes using DB `Sector` master data when available.
        Falls back to legacy static choices if sector table is empty (dev safety).
        """
        if value in (None, ''):
            return None

        if Sector.objects.exists():
            if not Sector.objects.filter(code=value).exists():
                raise serializers.ValidationError('Invalid sector selected.')
            return value

        valid_sectors = {choice[0] for choice in User.SECTOR_CHOICES}
        if value not in valid_sectors:
            raise serializers.ValidationError('Invalid sector selected.')
        return value

    def create(self, validated_data):
        assessor_sector_codes = validated_data.pop('assessor_sectors', [])
        company_name = validated_data.get('company_name')
        if company_name in ('', None):
            company_name = None
        # Normalize empty sector values to `None` so superuser (and any role)
        # doesn't store an empty string.
        sector = validated_data.get('sector')
        if sector in ('', None):
            sector = None
        role = validated_data.get('role', 'client')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=role,
            company_name=company_name,
            sector=sector,
        )
        if role == 'assessor' and assessor_sector_codes:
            sectors = Sector.objects.filter(code__in=assessor_sector_codes)
            user.assessor_sectors.set(sectors)
        return user

    def validate(self, attrs):
        role = attrs.get('role', 'client')
        assessor_sector_codes = attrs.get('assessor_sectors') or []
        company_name = attrs.get('company_name')

        if role == 'client':
            attrs['assessor_sectors'] = []
            clean_company_name = str(company_name or "").strip()
            if not clean_company_name:
                raise serializers.ValidationError(
                    {'company_name': 'Company name is required for client registration.'}
                )
            attrs['company_name'] = clean_company_name
        if role == 'assessor':
            if len(assessor_sector_codes) == 0:
                raise serializers.ValidationError(
                    {'assessor_sectors': 'Select at least one sector for assessor.'}
                )
            valid_codes = set(
                Sector.objects.filter(code__in=assessor_sector_codes).values_list('code', flat=True)
            )
            invalid_codes = [code for code in assessor_sector_codes if code not in valid_codes]
            if invalid_codes:
                raise serializers.ValidationError(
                    {'assessor_sectors': f'Invalid sectors: {", ".join(invalid_codes)}'}
                )
        return attrs


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, allow_blank=False)
    password = serializers.CharField(required=True, allow_blank=False, write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')
        request = self.context.get('request')

        # Try authenticating with username
        user = authenticate(
            request=request,
            username=username_or_email,
            password=password,
        )

        # If username fails, try email
        if not user and '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(
                    request=request,
                    username=user_obj.username,
                    password=password,
                )
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    assessor_sectors = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'company_name', 'sector', 'assessor_sectors', 'is_active', 'date_joined']

    def get_assessor_sectors(self, obj):
        return list(obj.assessor_sectors.values_list('code', flat=True))


class UserRoleUpdateSerializer(serializers.ModelSerializer):
    """
    Used by SuperUser to edit role + sector of existing users.
    """

    company_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sector = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    assessor_sectors = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = User
        fields = ['role', 'company_name', 'sector', 'assessor_sectors']

    def validate_role(self, value):
        valid_roles = {choice[0] for choice in User.ROLE_CHOICES}
        if value not in valid_roles:
            raise serializers.ValidationError('Invalid role selected.')
        return value

    def validate(self, attrs):
        role = attrs.get('role', getattr(self.instance, 'role', 'client'))
        assessor_sector_codes = attrs.get('assessor_sectors', None)

        if role == 'client' and 'company_name' in attrs:
            cn = attrs.get('company_name')
            if cn is not None:
                cn = str(cn).strip()
                if not cn:
                    raise serializers.ValidationError(
                        {'company_name': 'Company name is required for client users.'}
                    )
                attrs['company_name'] = cn

        if role == 'assessor':
            # If not provided during partial update, keep existing assignments.
            if assessor_sector_codes is not None:
                if len(assessor_sector_codes) == 0:
                    raise serializers.ValidationError(
                        {'assessor_sectors': 'Select at least one sector for assessor.'}
                    )
                valid_codes = set(
                    Sector.objects.filter(code__in=assessor_sector_codes).values_list('code', flat=True)
                )
                invalid_codes = [code for code in assessor_sector_codes if code not in valid_codes]
                if invalid_codes:
                    raise serializers.ValidationError(
                        {'assessor_sectors': f'Invalid sectors: {", ".join(invalid_codes)}'}
                    )
        else:
            attrs['assessor_sectors'] = []
        return attrs

    def update(self, instance, validated_data):
        assessor_sector_codes = validated_data.pop('assessor_sectors', None)
        instance = super().update(instance, validated_data)
        if assessor_sector_codes is not None:
            sectors = Sector.objects.filter(code__in=assessor_sector_codes)
            instance.assessor_sectors.set(sectors)
        elif instance.role != 'assessor':
            instance.assessor_sectors.clear()
        return instance


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """
    Admin ops: edit user profile fields + active status.
    """

    sector = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    assessor_sectors = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
    )
    company_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ["username", "email", "company_name", "sector", "assessor_sectors", "is_active"]

    def validate_sector(self, value):
        if value in (None, ""):
            return None

        if Sector.objects.exists():
            if not Sector.objects.filter(code=value).exists():
                raise serializers.ValidationError("Invalid sector selected.")
            return value

        valid_sectors = {choice[0] for choice in User.SECTOR_CHOICES}
        if value not in valid_sectors:
            raise serializers.ValidationError("Invalid sector selected.")
        return value

    def validate(self, attrs):
        # Assessor must always have at least one allowed sector.
        if getattr(self.instance, "role", None) == "assessor" and "assessor_sectors" in attrs:
            assessor_sector_codes = attrs.get("assessor_sectors") or []
            if len(assessor_sector_codes) == 0:
                raise serializers.ValidationError(
                    {"assessor_sectors": "Select at least one sector for assessor."}
                )
            valid_codes = set(
                Sector.objects.filter(code__in=assessor_sector_codes).values_list("code", flat=True)
            )
            invalid_codes = [code for code in assessor_sector_codes if code not in valid_codes]
            if invalid_codes:
                raise serializers.ValidationError(
                    {"assessor_sectors": f'Invalid sectors: {", ".join(invalid_codes)}'}
                )
        return attrs

    def update(self, instance, validated_data):
        assessor_sector_codes = validated_data.pop("assessor_sectors", None)
        instance = super().update(instance, validated_data)
        if getattr(instance, "role", None) == "assessor" and assessor_sector_codes is not None:
            sectors = Sector.objects.filter(code__in=assessor_sector_codes)
            instance.assessor_sectors.set(sectors)
        return instance