from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UserRoleUpdateSerializer,
)
from .models import User
from .permissions import IsRoleSuperUser


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'company_name': user.company_name,
                    'sector': user.sector,
                },
            },
            status=status.HTTP_200_OK,
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Public registration creates only client users.
        payload = {**request.data, 'role': 'client'}
        serializer = RegisterSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                'id': request.user.id,
                'username': request.user.username,
                'role': request.user.role,
                'company_name': request.user.company_name,
                'sector': request.user.sector,
            },
            status=status.HTTP_200_OK,
        )


class UserListCreateView(APIView):
    """
    SuperUser: list and create users.
    """

    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get(self, request):
        users = User.objects.all().order_by("-date_joined")
        return Response(UserSerializer(users, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        # Reuse the same serializer as the public registration endpoint.
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class UserDetailView(APIView):
    """
    SuperUser: update role/sector and delete users.
    """

    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get_object(self, pk):
        return User.objects.get(pk=pk)

    def put(self, request, pk):
        user = self.get_object(pk)
        serializer = UserRoleUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response({"detail": "User deleted."}, status=status.HTTP_204_NO_CONTENT)
