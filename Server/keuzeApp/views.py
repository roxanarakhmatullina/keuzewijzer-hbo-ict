from django.http import HttpResponse

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response

from django.views import View
from rest_framework.parsers import JSONParser
from django.http import JsonResponse


from .models import Category, Cluster, GraduateProfile, Cohort
from .serializers import CategorySerializer, ClusterSerializer, GraduateProfileSerializer, CohortSerializer, MessageSerializer
from .clusterService import ClusterService


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

class GraduateProfileViewSet(viewsets.ModelViewSet):
    queryset = GraduateProfile.objects.all()
    serializer_class = GraduateProfileSerializer
    permission_classes = [AllowAny]


class CohortViewSet(viewsets.ModelViewSet):
    queryset = Cohort.objects.all()
    serializer_class = CohortSerializer
    permission_classes = [AllowAny]


class GraduateProfileClustersView(APIView):
    """
    Retrieve clusters associated with a graduate profile.
    """

    def get(self, request, profile_id):
        try:
            profile = GraduateProfile.objects.get(id=profile_id)
            clusters = profile.clusters.all()
            serializer = ClusterSerializer(clusters, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GraduateProfile.DoesNotExist:
            return Response({"error": "Graduate profile not found"}, status=status.HTTP_404_NOT_FOUND)



class ClusterView(View):

    def get(self, request, *args, **kwargs):
        clusters = Cluster.objects.filter(free_choice=False)  # Query clusters
        serialized_clusters = ClusterSerializer(clusters, many=True)
        output_structure = ClusterService.transform_clusters(serialized_clusters.data)
        code = ClusterService.complies_prerequisites(output_structure)
        response = {"data": output_structure, "code": code}
        return JsonResponse(response, safe=False, status=200)

    def post(self, request, *args, **kwargs):

        # Parse the incoming JSON data
        data = JSONParser().parse(request)

        # Serialize and validate data
        serializer = ClusterSerializer(data=data)
        if serializer.is_valid():
            # Save the cluster to the database
            cluster = serializer.save()

            # Retrieve and associate graduate profiles
            graduate_profile_ids = data.get('graduate_profiles', [])
            graduate_profiles = GraduateProfile.objects.filter(id__in=graduate_profile_ids)
            cluster.graduate_profiles.add(*graduate_profiles)

            # Prepare a response with the serialized data
            response_data = {
                "id": cluster.id,
                "graduate_profiles": [{"name": gp.name} for gp in graduate_profiles],
                "category_value": cluster.category_value,
                "name": cluster.name,
                "description": cluster.description,
                "link": cluster.link,
                "locked": cluster.locked,
                "first_semester": cluster.first_semester,
                "last_semester": cluster.last_semester,
                "free_choice": cluster.free_choice,
            }
            return JsonResponse(self.transform_clusters(response_data), status=201)




class ClusterView_all(View):

    def get(self, request, *args, **kwargs):
        clusters = Cluster.objects.filter(free_choice=False)  # Query clusters
        serialized_clusters = ClusterSerializer(clusters, many=True)
        return JsonResponse(serialized_clusters.data, safe=False, status=200)