# keuzeApp/serializers.py
from rest_framework import serializers
from .models import *



class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=255)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['title', 'description']  # Utilizamos todos los campos

class GraduateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraduateProfile
        fields = ['name', 'color']

class CohortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cohort
        fields = ['id', 'name']


class GraduateProfileSerializerClusters(serializers.ModelSerializer):
    class Meta:
        model = GraduateProfile
        fields = ['name']

class CohortSerializerClusters(serializers.ModelSerializer):
    class Meta:
        model = Cohort
        fields = [ 'name']


class ClusterGraduateProfileCohortSerializer(serializers.ModelSerializer):

    graduate_profile = GraduateProfileSerializerClusters()
    cohort = CohortSerializerClusters()
    class Meta:
        model = ClusterGraduateProfileCohort
        fields = ['graduate_profile', 'cohort']


class ClusterSerializer(serializers.ModelSerializer):
    cohorts_profiles = ClusterGraduateProfileCohortSerializer(many=True, read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Cluster
        fields = '__all__'

