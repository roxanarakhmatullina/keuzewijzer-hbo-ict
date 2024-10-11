# keuzeApp/serializers.py
from rest_framework import serializers
from .models import Categorie, GraduateProfile, Year, Cluster, Prerequisite, Cohort, ClusterYear, CohortCluster, ClusterGraduateProfileCohort

# Serializer for Categorie model
class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'  # Utilizamos todos los campos

# Serializer for GraduateProfile model
class GraduateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraduateProfile
        fields = '__all__'

# Serializer for Year model
class YearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Year
        fields = '__all__'

# Serializer for Cluster model
class ClusterSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Categorie.objects.all())  # Usar ID en lugar de objeto anidado

    class Meta:
        model = Cluster
        fields = '__all__'

# Serializer for Prerequisite model
class PrerequisiteSerializer(serializers.ModelSerializer):
    cluster = serializers.PrimaryKeyRelatedField(queryset=Cluster.objects.all())  # Usar ID en lugar de objeto anidado
    prerequisite_cluster = serializers.PrimaryKeyRelatedField(queryset=Cluster.objects.all())

    class Meta:
        model = Prerequisite
        fields = '__all__'

# Serializer for Cohort model
class CohortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cohort
        fields = '__all__'

# Serializer for ClusterYear model
class ClusterYearSerializer(serializers.ModelSerializer):
    cluster = serializers.PrimaryKeyRelatedField(queryset=Cluster.objects.all())  # Usar ID en lugar de objeto anidado
    year = serializers.PrimaryKeyRelatedField(queryset=Year.objects.all())

    class Meta:
        model = ClusterYear
        fields = '__all__'

# Serializer for CohortCluster model
class CohortClusterSerializer(serializers.ModelSerializer):
    cluster = serializers.PrimaryKeyRelatedField(queryset=Cluster.objects.all())  # Usar ID en lugar de objeto anidado
    cohort = serializers.PrimaryKeyRelatedField(queryset=Cohort.objects.all())

    class Meta:
        model = CohortCluster
        fields = '__all__'

# Serializer for ClusterGraduateProfileCohort model
class ClusterGraduateProfileCohortSerializer(serializers.ModelSerializer):
    graduate_profile = serializers.PrimaryKeyRelatedField(queryset=GraduateProfile.objects.all())  # Usar ID en lugar de objeto anidado
    cluster = serializers.PrimaryKeyRelatedField(queryset=Cluster.objects.all())
    cohort = serializers.PrimaryKeyRelatedField(queryset=Cohort.objects.all())

    class Meta:
        model = ClusterGraduateProfileCohort
        fields = '__all__'
