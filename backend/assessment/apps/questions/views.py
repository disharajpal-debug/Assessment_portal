from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.users.permissions import IsAdminRole, IsRoleSuperUser
from .serializers import QuestionSerializer, QuestionCatalogSerializer
from .models import QuestionCatalog


class QuestionCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, updated_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuestionCatalogView(APIView):
    """
    SuperUser: GET/PUT question catalog definitions as JSON.

    GET:
      /api/questions/catalog/?category=basic
      /api/questions/catalog/?category=functional
      /api/questions/catalog/?category=sector&sector_code=textile

    PUT body:
      {
        "category": "basic" | "functional" | "sector",
        "sector_code": "textile" | null,
        "definition": [ ... ]
      }
    """

    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get(self, request):
        category = request.query_params.get("category")
        sector_code = request.query_params.get("sector_code")

        if not category:
            return Response({"detail": "category is required."}, status=status.HTTP_400_BAD_REQUEST)

        catalog = QuestionCatalog.objects.filter(category=category, sector_code=sector_code).first()
        if not catalog:
            return Response(
                {"category": category, "sector_code": sector_code, "definition": []},
                status=status.HTTP_200_OK,
            )

        serializer = QuestionCatalogSerializer(catalog)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = QuestionCatalogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = serializer.validated_data["category"]
        sector_code = serializer.validated_data.get("sector_code")
        definition = serializer.validated_data.get("definition", [])

        catalog, _ = QuestionCatalog.objects.update_or_create(
            category=category,
            sector_code=sector_code,
            defaults={
                "definition": definition,
                "updated_by": request.user,
            },
        )

        if not catalog.updated_by_id:
            catalog.updated_by = request.user
        if not catalog.created_by_id:
            catalog.created_by = request.user
        catalog.save(update_fields=["definition", "updated_by", "created_by"])

        out = QuestionCatalogSerializer(catalog)
        return Response(out.data, status=status.HTTP_200_OK)
