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



    def add_level(self, output_structure):
        # Get the highest existing id in the structure
        if output_structure:
            next_id = str(int(output_structure[-1]["id"]) + 1)  # Increment the last id
        else:
            next_id = "1"

        new_level = {
            "id": next_id,
            "firstCluster": [],
            "lastCluster": [],
            "levelsFirst": [],
            "levelsLast": []
        }
        output_structure.append(new_level)

    def retake_cluster(self, cluster, output_structure, current_index, autumn):

        #Take sthat there are no clusters added on the next years. If this was the case it wouldnt forcefully position the year on the next available spot.

        if cluster["retake"] <= 0 or not cluster["chosen"]:
            raise ValueError("Invalid cluster: 'retake' must be greater than 0 and 'chosen' must be True.")

        year_index = current_index
        times = cluster["retake"]
        while year_index < len(output_structure) and times>0:
            year = output_structure[year_index]

            if not autumn:
                if cluster["levelsFirst"]:
                    year["firstCluster"].append(cluster)
                    times -=1

            if cluster["levelsLast"]:
                year["lastCluster"].append(cluster)
                times -=1
            autumn = False

            year_index=+1
            if times>0 and index == len(output_structure):
                self.add_level(output_structure)

        return output_structure





    def transform_clusters(self, input_json):

        output_structure = []

        for i in range(4): self.add_level(output_structure)

        afstuderen_name = "Afstuderen"
        freechoice_name = "Vrije keuze"

        level_one = []
        level_two = []
        level_three = []
        level_zero = []

        for cluster in input_json:

            cluster["graduateProfileTags"] = [(item["graduate_profile_id"]["name"], item["cohort_id"]["name"]) for item in cluster.pop("cohorts_profiles")]

            transformed_cluster = {
                "id": cluster['id'],
                "name": cluster["name"],
                "link": cluster["link"],
                "locked": cluster["locked"],
                "free_choice": cluster["free_choice"],
                "graduateProfileTags": cluster["graduateProfileTags"],
                "first_semester": cluster["first_semester"],
                "last_semester": cluster["last_semester"],
                "retake": cluster["retake"],
                "chosen":cluster["chosen"]
            }

            if (cluster["category_value"] == 1):
                level_one.append(transformed_cluster)

            elif (cluster["category_value"] == 2):
                level_two.append(transformed_cluster)

            elif (cluster["category_value"] == 3):
                level_three.append(transformed_cluster)

            elif (cluster["category_value"] == 0):
                level_zero.append(transformed_cluster)


        cluster_index = 0
        while cluster_index < len(level_one):
            cluster = level_one[cluster_index]

            if cluster["first_semester"]:
                output_structure[0]["firstCluster"].append(cluster)

                if "one" not in output_structure[0]["levelsFirst"]:
                    output_structure[0]["levelsFirst"].append("one")

            elif cluster["last_semester"]:
                output_structure[0]["lastCluster"].append(cluster)

                if "one" not in output_structure[0]["levelsLast"]:
                    output_structure[0]["levelsLast"].append("one")

            cluster_index +=1

        threshold = 0
        check = False
        year_index = 0
        while year_index < len(output_structure):
            year = output_structure[year_index]

            if threshold >= 2 and "one" not in year["levelsFirst"]:
                for cluster in level_two:
                    if cluster["first_semester"]:
                        year["firstCluster"].append(cluster)
                        if "two" not in year["levelsFirst"]:
                            year["levelsFirst"].append("two")
                        if cluster["retake"]>0:
                            self.retake_cluster(cluster, output_structure, year_index, True)

                if check: break
                check = True

            if "one" in year["levelsFirst"]:
                threshold += 1


            if threshold >= 2:
                for cluster in level_two:
                    if cluster["last_semester"]:
                        year["lastCluster"].append(cluster)
                        if "two" not in year["levelsLast"]:
                            year["levelsLast"].append("two")
                        if cluster["retake"]>0:
                            self.retake_cluster(cluster, output_structure, year_index, False)
                if check: break
                check = True


            if "one" in year["levelsLast"]:
                threshold +=1

            year_index +=1


        threshold = 0
        check = False
        year_index = 0
        while year_index < len(output_structure):
            year = output_structure[year_index]

            print("year start")

            if threshold >= 2:
                for cluster in level_three:
                    if cluster["first_semester"]:
                        year["firstCluster"].append(cluster)
                        if "three" not in year["levelsFirst"]:
                            year["levelsFirst"].append("three")
                if check: break
                check = True

            if "two" in year["levelsFirst"]:
                threshold += 1

            if threshold >= 2:
                for cluster in level_three:
                    if cluster["last_semester"]:
                        year["lastCluster"].append(cluster)
                        if "three" not in year["levelsLast"]:
                            year["levelsLast"].append("three")
                if check: break
                check = True

            if "two" in year["levelsLast"]:
                threshold += 1

            year_index += 1


        for cluster in level_zero:

            if cluster["name"] == afstuderen_name:
                for year in output_structure:
                    if not year["levelsFirst"]:
                        year["firstCluster"].append(cluster)
                        year["levelsFirst"].append("zero")
                    if not year["levelsLast"]:
                        year["lastCluster"].append(cluster)
                        year["levelsLast"].append("zero")

            elif    freechoice_name in cluster["name"]:
                for year in output_structure:
                    if not year["levelsFirst"] and cluster["first_semester"]:
                        year["firstCluster"].append(cluster)
                        year["levelsFirst"].append("zero")
                        break
                    if not year["levelsLast"] and cluster["last_semester"]:
                        year["lastCluster"].append(cluster)
                        year["levelsLast"].append("zero")
                        break

        return output_structure

    def get(self, request, *args, **kwargs):

        clusters = Cluster.objects.all()  # Example query
        serialized_clusters = ClusterSerializer(clusters, many=True)
        return JsonResponse(self.transform_clusters(serialized_clusters.data), safe=False, status=200)

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




class ClusterView2(View):

    def transform_clusters(self, input_json):

        output_structure = []

        for cluster in input_json:

            cluster["graduateProfileTags"] = [profile["name"] for profile in cluster.pop("graduate_profiles")]

            transformed_cluster = {
                "id": cluster['id'],
                "name": cluster["name"],
                "link": cluster["link"],
                "locked": cluster["locked"],
                "free_choice": cluster["free_choice"],
                "graduateProfileTags": cluster["graduateProfileTags"],
                "autumn_semester": cluster["first_semester"],
                "spring_semester": cluster["last_semester"],
                "order": cluster["order"],
             }
            output_structure.append(transformed_cluster)


        return output_structure



    def get(self, request, *args, **kwargs):

        clusters = Cluster.objects.all()  # Example query
        serialized_clusters = ClusterSerializer(clusters, many=True)
        return JsonResponse(serialized_clusters.data, safe=False, status=200)
