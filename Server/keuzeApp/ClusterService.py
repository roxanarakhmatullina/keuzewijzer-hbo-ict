
class ClusterService:
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
        # Logic from `complies_prerequisites`
        complied = []
        level_three = False

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

            if not level_three and ("three" in year["levelsFirst"] or "three" in year["levelsLast"]):
                level_three = True

        return 0 if level_three else -1



    @staticmethod
    def retake_cluster(cluster, output_structure, current_index, autumn):
        displaced_clusters = []
        if cluster["retake"] <= 0 or not cluster["chosen"]:
            raise ValueError("Invalid cluster: 'retake' must be greater than 0 and 'chosen' must be True.")

        year_index = current_index
        times = cluster["retake"]

        while year_index < len(output_structure) and times >= 1:
            year = output_structure[year_index]
            if autumn and cluster["first_semester"]:
                while year["firstCluster"]:
                    displaced_clusters.append(year["firstCluster"].pop())
                year["firstCluster"].append(cluster)
                year["levelsFirst"] = ["one"]
                times -= 1

            if cluster["last_semester"]:
                while year["lastCluster"]:
                    displaced_clusters.append(year["lastCluster"].pop())
                year["lastCluster"].append(cluster)
                year["levelsLast"] = ["one"]
                times -= 1

            autumn = True
            year_index += 1

        return displaced_clusters

    @staticmethod
    def transform_clusters(input_json):

        output_structure = []
        for i in range(3):
            ClusterService.add_level(output_structure)

        propedeuze_name = "Propedeuze 1"
        afstuderen_name = "Afstuderen"
        freechoice_name = "Vrije keuze"

        level_one = []
        level_two = []
        level_three = []
        level_zero = []

        # Classify semesters by level

        for cluster in input_json:
            cluster["graduateProfileTags"] = [
                (item["graduate_profile_id"]["name"], item["cohort_id"]["name"])
                for item in cluster.pop("cohorts_profiles")
            ]
            transformed_cluster = {
                "id": cluster["id"],
                "name": cluster["name"],
                "link": cluster["link"],
                "locked": cluster["locked"],
                "free_choice": cluster["free_choice"],
                "graduateProfileTags": cluster["graduateProfileTags"],
                "first_semester": cluster["first_semester"],
                "last_semester": cluster["last_semester"],
                "retake": cluster["retake"],
                "chosen": cluster["chosen"],
                "requisites": cluster["prerequisite_ids"],
            }

            if cluster["category_value"] == 1:
                level_one.append(transformed_cluster)
            elif cluster["category_value"] == 2:
                level_two.append(transformed_cluster)
            elif cluster["category_value"] == 3:
                level_three.append(transformed_cluster)
            elif cluster["category_value"] == 0:
                level_zero.append(transformed_cluster)

        # LEVEL 1

        cluster_index = 0
        check = True
        while cluster_index < len(level_one):

            # First case until we reach Prop 1
            current_cluster = level_one[cluster_index]
            if current_cluster["name"] != propedeuze_name and check:
                level_one.append(level_one.pop(0))
            #Second case inserting Prop 2
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

            # Third case iterate on the other level 1 semesters
            elif not check:
                print("case three")
                year_index = 0
                while year_index < len(output_structure):
                    year = output_structure[year_index]

                    # Only adding if there is not any level in the semester becas elevel one cant share
                    if current_cluster["first_semester"] and "one" not in year["levelsFirst"]:
                        if current_cluster["retake"] == 0:
                            year["firstCluster"].append(current_cluster)
                        else:
                            ClusterService.retake_cluster(current_cluster, output_structure, 0, True)
                        year["levelsFirst"].append("one")

                    elif current_cluster["last_semester"] and "one" not in year["levelsLast"]:
                        if current_cluster["retake"] == 0:
                            year["lastCluster"].append(current_cluster)
                        else:
                            ClusterService.retake_cluster(current_cluster, output_structure, 0, True)
                        year["levelsLast"].append("one")

                    year_index += 1
                cluster_index += 1


        #LEVEL 2

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
                        if cluster["retake"] > 0:
                            ClusterService.retake_cluster(cluster, output_structure, year_index, True)

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
                        if cluster["retake"] > 0:
                            ClusterService.retake_cluster(cluster, output_structure, year_index, False)
                if check: break
                check = True

            if "one" in year["levelsLast"]:
                threshold += 1

            year_index += 1


        # LEVEL 2

        threshold = 0
        check = False
        year_index = 0
        while year_index < len(output_structure):
            year = output_structure[year_index]

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

            elif freechoice_name in cluster["name"]:
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
