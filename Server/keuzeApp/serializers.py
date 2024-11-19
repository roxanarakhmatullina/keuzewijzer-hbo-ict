# keuzeApp/serializers.py
from rest_framework import serializers
from .models import *



class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=255)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'  # Utilizamos todos los campos

class GraduateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = GraduateProfile
        fields = ['name', 'color']

class ClusterSerializer(serializers.ModelSerializer):
    
    graduate_profiles = GraduateProfileSerializer(many=True, read_only=True)

    category_id  = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Cluster
        fields = '__all__'

# Serializer for Prerequisite model
class PrerequisiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prerequisite
        fields = '__all__'

# Serializer for Cohort model
class CohortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cohort
        fields = '__all__'



