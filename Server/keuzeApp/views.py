from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from .models import Category, Cluster, GraduateProfile, Prerequisite, Cohort, CohortCluster
from .serializers import CategorySerializer, ClusterSerializer, GraduateProfileSerializer, PrerequisiteSerializer, CohortSerializer, CohortClusterSerializer, MessageSerializer


def index(request):
    return HttpResponse("This is the default index view :)")

class MessageValidationViewSet(viewsets.ViewSet):
    def create(self, request):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            # Here you can add your custom validation logic
            message = serializer.validated_data['message']
            is_valid = self.validate_message(message)
            return Response({'is_valid': is_valid}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def validate_message(self, message):
        # Implement your validation logic here
        return len(message) > 0  # Example: check if the message is not empty


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ClusterViewSet(viewsets.ModelViewSet):
    queryset = Cluster.objects.all()
    serializer_class = ClusterSerializer
    permission_classes = [AllowAny]

class GraduateProfileViewSet(viewsets.ModelViewSet):
    queryset = GraduateProfile.objects.all()
    serializer_class = GraduateProfileSerializer
    permission_classes = [AllowAny]

class PrerequisiteViewSet(viewsets.ModelViewSet):
    queryset = Prerequisite.objects.all()
    serializer_class = PrerequisiteSerializer
    permission_classes = [AllowAny]

class CohortViewSet(viewsets.ModelViewSet):
    queryset = Cohort.objects.all()
    serializer_class = CohortSerializer
    permission_classes = [AllowAny]

class CohortClusterViewSet(viewsets.ModelViewSet):
    queryset = CohortCluster.objects.all()
    serializer_class = CohortClusterSerializer
    permission_classes = [AllowAny]

