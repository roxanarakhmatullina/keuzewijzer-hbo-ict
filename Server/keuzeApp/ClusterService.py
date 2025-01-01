
import copy

from django.template.context_processors import static

from Server.keuzeApp.test import deduplicate_clusters_by_retake


class ClusterService:
    @staticmethod
    def is_free(semester):
        return all(cluster["retake"] == 0 for cluster in semester) if semester else True


    @staticmethod
    def add_level(output_structure):

        if output_structure:
            next_id = str(int(output_structure[-1]["id"]) + 1)
        else:
            next_id = "1"

        new_level = {
            "id": next_id,
            "firstCluster": [],
            "lastCluster": [],
            "levelsFirst": [],
            "levelsLast": [],
        }
        output_structure.append(new_level)

    @staticmethod
    def complies_prerequisites(studyYear):

        complied = []

        for year in studyYear:
            for cluster in year["firstCluster"]:
                if cluster["chosen"]:
                    complied.append(cluster["id"])
                    if all(requisite_id not in complied for requisite_id in cluster["requisites"]):
                        return cluster["id"]

            for cluster in year["lastCluster"]:
                if cluster["chosen"]:
                    complied.append(cluster["id"])
                    if all(requisite_id not in complied for requisite_id in cluster["requisites"]):
                        return cluster["id"]

        return 0

    @staticmethod
    def deduplicate_clusters(clusters):

        highest_retake_clusters = {}

        for cluster in clusters:
            cluster_id = cluster["id"]
            if (cluster_id not in highest_retake_clusters or
                    cluster["retake"] > highest_retake_clusters[cluster_id]["retake"]):
                highest_retake_clusters[cluster_id] = cluster

        return list(highest_retake_clusters.values())

    @staticmethod
    def decompress_validate_studyyear (studyYear):

        clusters = []

        if ClusterService.complies_prerequisites(studyYear): return

        for year in studyYear:

            if sum(1 for cluster in year["firstCluster"] if cluster.get("chosen", False)):
                return False
            if sum(1 for cluster in year["firstCluster"] if cluster.get("chosen", False)):
                return False


            for cluster in year["firstCluster"]:
                clusters.append(cluster)

            for cluster in year["lastCluster"]:
                clusters.append(cluster)

        unique_clusters = deduplicate_clusters_by_retake(clusters)

        return unique_clusters

    @staticmethod
    def retake_cluster(cluster, output_structure, current_index, autumn):
        displaced_clusters = []
        if cluster["retake"] <= 0 or not cluster["chosen"]:
            raise ValueError("Invalid cluster: 'retake' must be greater than 0 and 'chosen' must be True.")

        year_index = current_index
        times = cluster["retake"]

        while year_index < len(output_structure) and times >= 0:
            year = output_structure[year_index]
            if autumn and cluster["first_semester"] and times >= 0:
                while year["firstCluster"]:
                    displaced_clusters.append(year["firstCluster"].pop())
                cluster_copy = copy.deepcopy(cluster)
                cluster_copy["retake"] = times
                year["firstCluster"].append(cluster_copy)

                if cluster["category_value"] == 1:
                    year["levelsFirst"] = ["one"]
                elif cluster["category_value"] == 2:
                    year["levelsFirst"] = ["two"]
                elif cluster["category_value"] == 3:
                    year["levelsFirst"] = ["three"]
                times -= 1

            if cluster["last_semester"] and times >= 0:
                while year["lastCluster"]:
                    displaced_clusters.append(year["lastCluster"].pop())
                cluster_copy = copy.deepcopy(cluster)
                cluster_copy["retake"] = times
                year["lastCluster"].append(cluster_copy)

                if cluster["category_value"] == 1:
                    year["levelsLast"] = ["one"]
                elif cluster["category_value"] == 2:
                    year["levelsLast"] = ["two"]
                elif cluster["category_value"] == 3:
                    year["levelsLast"] = ["three"]
                times -= 1

            autumn = True
            year_index += 1

            if times >= 0 and year_index == len(output_structure):
                ClusterService.add_level(output_structure)

        return displaced_clusters

    @staticmethod
    def transform_clusters(input_json):

        # No puede haber dos edlegidos que se posicionarian en la misma

        output_structure = []
        for i in range(3):
            ClusterService.add_level(output_structure)

        propedeuze_name = "Propedeuse 1"
        afstuderen_name = "Afstuderen"
        freechoice_name = "Vrije keuze"

        level_one = []
        level_two = []
        level_three = []
        level_zero = []

        for cluster in input_json:

            transformed_cluster = {
                "id": cluster["id"],
                "name": cluster["name"],
                "link": cluster["link"],
                "locked": cluster["locked"],
                "free_choice": cluster["free_choice"],
                "first_semester": cluster["first_semester"],
                "last_semester": cluster["last_semester"],
                "retake": cluster["retake"],
                "chosen": cluster["chosen"],
                "requisites": cluster["prerequisite_ids"],
                "category_value": cluster["category_value"],
            }

            if cluster["category_value"] == 1:
                level_one.append(transformed_cluster)
            elif cluster["category_value"] == 2:
                level_two.append(transformed_cluster)
            elif cluster["category_value"] == 3:
                level_three.append(transformed_cluster)
            elif cluster["category_value"] == 0:
                level_zero.append(transformed_cluster)

        cluster_index = 0
        check = True

        # LEVEL ONE

        while cluster_index < len(level_one):

            current_cluster = level_one[cluster_index]
            # Two cases forcing propedeuze to be first
            if current_cluster["name"] != propedeuze_name and check:
                level_one.append(level_one.pop(0))

            elif current_cluster["name"] == propedeuze_name:
                if current_cluster["retake"] == 0:
                    output_structure[0]["firstCluster"].append(current_cluster)
                else:
                    displaced = ClusterService.retake_cluster(current_cluster, output_structure, 0, True)
                    for cluster in displaced:
                        level_one.append(cluster)

                if "one" not in output_structure[0]["levelsFirst"]:
                    output_structure[0]["levelsFirst"].append("one")
                check = False
                cluster_index += 1

            # Last case whenever propedeuze id done
            elif not check:
                year_index = 0
                while year_index < len(output_structure):
                    year = output_structure[year_index]

                    # Only adding if there is not any level in the semester becaus elevel one cant share
                    if current_cluster["first_semester"] and "one" not in year["levelsFirst"] and ClusterService.is_free(
                            year["firstCluster"]):
                        if current_cluster["retake"] == 0:
                            year["firstCluster"].append(current_cluster)
                        else:
                            ClusterService.retake_cluster(current_cluster, output_structure, 0, True)
                        year["levelsFirst"].append("one")
                        break

                    elif current_cluster["last_semester"] and "one" not in year["levelsLast"] and ClusterService.is_free(
                            year["firstCluster"]):
                        if current_cluster["retake"] == 0:
                            year["lastCluster"].append(current_cluster)
                        else:
                            ClusterService.retake_cluster(current_cluster, output_structure, 0, True)
                        year["levelsLast"].append("one")
                        break

                    year_index += 1
                cluster_index += 1

        # LEVEL 2

        to_extend = []
        threshold = 0
        check = False
        year_index = 0
        while year_index < len(output_structure):
            year = output_structure[year_index]

            if threshold >= 2 and "one" not in year["levelsFirst"] and ClusterService.is_free(year["firstCluster"]):

                cluster_index = 0
                while cluster_index < len(level_two):
                    cluster = level_two[cluster_index]
                    if cluster["first_semester"]:
                        if cluster["retake"] > 0:
                            to_extend.extend(ClusterService.retake_cluster(cluster, output_structure, year_index, True))
                        else:
                            year["firstCluster"].append(cluster)
                        level_two.remove(cluster)
                        if "two" not in year["levelsFirst"]:
                            year["levelsFirst"].append("two")
                    else:
                        cluster_index += 1
                if check: break
                check = True

            if "one" in year["levelsFirst"]:
                threshold += 1

            if threshold >= 2 and "one" not in year["levelsLast"] and ClusterService.is_free(year["firstCluster"]):

                cluster_index = 0
                while cluster_index < len(level_two):
                    cluster = level_two[cluster_index]
                    if cluster["last_semester"]:
                        if cluster["retake"] > 0:
                            to_extend = ClusterService.retake_cluster(cluster, output_structure, year_index, False)
                        else:
                            year["lastCluster"].append(cluster)
                        level_two.remove(cluster)
                        if "two" not in year["levelsLast"]:
                            year["levelsLast"].append("two")
                    else:
                        cluster_index += 1

                if check: break
                check = True

            if "one" in year["levelsLast"]:
                threshold += 1

            if to_extend:
                level_two.extend(to_extend)
                to_extend = []

            year_index += 1

            if level_two and year_index == len(output_structure):
                ClusterService.add_level(output_structure)

        # LEVEL 3

        to_extend = []
        threshold = 0
        check = False
        year_index = 0
        while year_index < len(output_structure):
            year = output_structure[year_index]

            if threshold >= 2 and "one" not in year["levelsFirst"] and "two" not in year["levelsFirst"] and ClusterService.is_free(year["firstCluster"]):

                cluster_index = 0
                while cluster_index < len(level_three):
                    cluster = level_three[cluster_index]

                    if cluster["first_semester"]:
                        if cluster["retake"] > 0:
                            to_extend.extend(ClusterService.retake_cluster(cluster, output_structure, year_index, True))
                        else:
                            year["firstCluster"].append(cluster)
                        level_three.remove(cluster)
                        if "three" not in year["levelsFirst"]:
                            year["levelsFirst"].append("three")
                    else:
                        cluster_index += 1

                if check: break
                check = True

            if "two" in year["levelsFirst"]:
                threshold += 1

            if threshold >= 2 and "one" not in year["levelsLast"]and "two" not in year["levelsLast"] and ClusterService.is_free(year["lastCluster"]):

                cluster_index = 0
                while cluster_index < len(level_three):
                    cluster = level_three[cluster_index]
                    if cluster["last_semester"]:
                        if cluster["retake"] > 0:
                            to_extend = ClusterService.retake_cluster(cluster, output_structure, year_index, False)
                        else:
                            year["lastCluster"].append(cluster)
                        level_three.remove(cluster)
                        if "three" not in year["levelsLast"]:
                            year["levelsLast"].append("three")
                    else:
                        cluster_index += 1

                if check: break
                check = True

            if "two" in year["levelsLast"]:
                threshold += 1

            year_index += 1

        # LEVEL 0  (free choice position and afstuderen)


        check1 = False
        check2 = False
        while level_zero:
            cluster = level_zero[0]
            if cluster["name"] == afstuderen_name and check1 and check2:
                year_index=0
                while year_index <= len(output_structure):
                    year = output_structure[year_index]

                    if not year["levelsFirst"]:
                        year["firstCluster"].append(cluster)
                        year["levelsFirst"].append("zero")
                        break

                    elif not year["levelsLast"]:
                        year["lastCluster"].append(cluster)
                        year["levelsLast"].append("zero")
                        break

                    year_index +=1
                level_zero.remove(cluster)

            elif cluster["name"] == afstuderen_name:
                level_zero.append(level_zero.pop(0))

            if freechoice_name in cluster["name"]:
                year_index=0

                while year_index < len(output_structure):

                    year = output_structure[year_index]
                    if not year["levelsFirst"] and cluster["first_semester"]:
                        year["firstCluster"].append(cluster)
                        if "zero" not in year["levelsFirst"]:
                            year["levelsFirst"].append("zero")
                        level_zero.remove(cluster)
                        if check1:
                            check2 = True
                        else:
                            check1 = True
                        break

                    elif not year["levelsLast"] and cluster["last_semester"]:
                        year["lastCluster"].append(cluster)
                        if "zero" not in year["levelsLast"]:
                            year["levelsLast"].append("zero")
                        level_zero.remove(cluster)
                        if check1:
                            check2 = True
                        else:
                            check1 = True
                        break

                    elif year_index+1 == len(output_structure) and level_zero:
                        ClusterService.add_level(output_structure)

                    year_index +=1

        return output_structure
