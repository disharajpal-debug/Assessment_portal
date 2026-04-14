from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.sectors.serializers import SectorSerializer
from apps.users.permissions import IsRoleSuperUser

from .models import Sector


class SectorListCreateView(APIView):
    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get(self, request):
        queryset = Sector.objects.all()
        serializer = SectorSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SectorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SectorDetailView(APIView):
    permission_classes = [IsAuthenticated, IsRoleSuperUser]

    def get_object(self, pk):
        return Sector.objects.get(pk=pk)

    def put(self, request, pk):
        sector = self.get_object(pk)
        serializer = SectorSerializer(sector, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        sector = self.get_object(pk)
        sector.delete()
        return Response({"detail": "Sector deleted."}, status=status.HTTP_204_NO_CONTENT)
