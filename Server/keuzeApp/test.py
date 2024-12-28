from itertools import chain
import copy

cluster_json = [
{
    "id": 4,
    "category_value": 1,
    "name": "Propedeuse 2",
    "description": "Propedeuse one description sample",
    "link": "https://liveadminwindesheim.sharepoint.com/sites/std-HBO-ICT-voltijd/SitePages/Eerste%20jaar%20en%20introductie.aspx?csf=1&web=1&e=mFNNDa",
    "locked": True,
    "first_semester": True,
    "last_semester": True,
    "free_choice": False,
    "chosen": False,
    "retake": 0,
    "category_id": 1,
    "prerequisite_ids": []
},
    {
    "id": 4,
    "category_value": 1,
    "name": "Propedeuse 1",
    "description": "Propedeuse one description sample",
    "link": "https://liveadminwindesheim.sharepoint.com/sites/std-HBO-ICT-voltijd/SitePages/Eerste%20jaar%20en%20introductie.aspx?csf=1&web=1&e=mFNNDa",
    "locked": True,
    "first_semester": True,
    "last_semester": False,
    "free_choice": False,
    "chosen": True,
    "retake": 1,
    "category_id": 1,
    "prerequisite_ids": []
},
    {
    "id": 4,
    "category_value": 2,
    "name": "Clus2.1",
    "description": "Propedeuse one description sample",
    "link": "https://liveadminwindesheim.sharepoint.com/sites/std-HBO-ICT-voltijd/SitePages/Eerste%20jaar%20en%20introductie.aspx?csf=1&web=1&e=mFNNDa",
    "locked": True,
    "first_semester": True,
    "last_semester": False,
    "free_choice": False,
    "chosen": False,
    "retake": 0,
    "category_id": 2,
    "prerequisite_ids": []
},
    {
    "id": 4,
    "category_value": 2,
    "name": "Clus2.2",
    "description": "Propedeuse one description sample",
    "link": "https://liveadminwindesheim.sharepoint.com/sites/std-HBO-ICT-voltijd/SitePages/Eerste%20jaar%20en%20introductie.aspx?csf=1&web=1&e=mFNNDa",
    "locked": True,
    "first_semester": True,
    "last_semester": False,
    "free_choice": False,
    "chosen": True,
    "retake": 1,
    "category_id": 2,
    "prerequisite_ids": []
},
    {
    "id": 4,
    "category_value": 2,
    "name": "Clus2.3",
    "description": "Propedeuse one description sample",
    "link": "https://liveadminwindesheim.sharepoint.com/sites/std-HBO-ICT-voltijd/SitePages/Eerste%20jaar%20en%20introductie.aspx?csf=1&web=1&e=mFNNDa",
    "locked": True,
    "first_semester": True,
    "last_semester": True,
    "free_choice": False,
    "chosen": False,
    "retake": 0,
    "category_id": 2,
    "prerequisite_ids": []
},
]


def add_level(output_structure):

    # Logic from the `add_level` method
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


def retake_cluster(cluster, output_structure, current_index, autumn):
    displaced_clusters = []
    if cluster["retake"] <= 0 or not cluster["chosen"]:
        raise ValueError("Invalid cluster: 'retake' must be greater than 0 and 'chosen' must be True.")

    year_index = current_index
    times = cluster["retake"]

    while year_index < len(output_structure) and times >= 0:
        year = output_structure[year_index]
        if autumn and cluster["first_semester"] and times >=0:
            while year["firstCluster"]:
                displaced_clusters.append(year["firstCluster"].pop())
            cluster_copy = copy.deepcopy(cluster)
            cluster_copy["retake"] = times
            year["firstCluster"].append(cluster_copy)

            if cluster["category_value"] == 1:
                year["levelsFirst"]=["one"]
            elif cluster["category_value"] == 2:
                year["levelsFirst"]=["two"]
            elif cluster["category_value"] == 3:
                year["levelsFirst"] = ["three"]
            times -= 1

        if cluster["last_semester"] and times >=0:
            while year["lastCluster"]:
                displaced_clusters.append(year["lastCluster"].pop())
            cluster_copy = copy.deepcopy(cluster)
            cluster_copy["retake"] = times
            year["lastCluster"].append(cluster_copy)

            if cluster["category_value"] == 1:
                year["levelsLast"]=["one"]
            elif cluster["category_value"] == 2:
                year["levelsLast"]=["two"]
            elif cluster["category_value"] == 3:
                year["levelsLast"] = ["three"]
            times -= 1

        autumn = True
        year_index +=1

        if times >=0 and year_index == len(output_structure):
            add_level(output_structure)

    return displaced_clusters

def is_free(semester):
    return all(cluster["retake"] == 0 for cluster in semester) if semester else True

def transform_clusters(input_json):


    # No puede haber dos edlegidos que se posicionarian en la misma

    output_structure = []
    for i in range(3):
        add_level(output_structure)

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
        #Two cases forcing propedeuze to be first
        if current_cluster["name"] != propedeuze_name and check:
            level_one.append(level_one.pop(0))

        elif current_cluster["name"] == propedeuze_name:
            if current_cluster["retake"] == 0:
                output_structure[0]["firstCluster"].append(current_cluster)
            else:
                displaced = retake_cluster(current_cluster, output_structure, 0, True)
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
                if current_cluster["first_semester"] and "one" not in year["levelsFirst"] and is_free(year["firstCluster"]):
                    if current_cluster["retake"] == 0:
                        year["firstCluster"].append(current_cluster)
                    else:
                        retake_cluster(current_cluster, output_structure, 0, True)
                    year["levelsFirst"].append("one")
                    break

                elif current_cluster["last_semester"] and "one" not in year["levelsLast"] and is_free(year["firstCluster"]):
                    if current_cluster["retake"] == 0:
                        year["lastCluster"].append(current_cluster)
                    else:
                        retake_cluster(current_cluster, output_structure, 0, True)
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

        if threshold >= 2 and "one" not in year["levelsFirst"] and is_free(year["firstCluster"]):

            cluster_index = 0
            while cluster_index < len(level_two):
                cluster = level_two[cluster_index]
                if cluster["first_semester"]:
                    if cluster["retake"] > 0:
                        to_extend.extend(retake_cluster(cluster, output_structure, year_index, True))
                    else:
                        year["firstCluster"].append(cluster)
                    level_two.remove(cluster)
                    if "two" not in year["levelsFirst"]:
                        year["levelsFirst"].append("two")
                else:
                    cluster_index +=1
            if check: break
            check = True

        if "one" in year["levelsFirst"]:
            threshold += 1

        if threshold >= 2 and "one" not in year["levelsLast"] and is_free(year["firstCluster"]):

            cluster_index = 0
            while cluster_index < len(level_two):
                cluster = level_two[cluster_index]
                if cluster["last_semester"]:
                    if cluster["retake"] > 0:
                        to_extend = retake_cluster(cluster, output_structure, year_index, False)
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
            to_extend=[]

        year_index += 1

        if level_two and year_index == len(output_structure):
            add_level(output_structure)


    #LEVEL 3

    to_extend = []
    threshold = 0
    check = False
    year_index = 0
    while year_index < len(output_structure):
        year = output_structure[year_index]

        if threshold >= 2 and "one" not in year["levelsFirst"] and "two" not in year["levelsFirst"] and is_free(year["firstCluster"]):

            cluster_index = 0
            while cluster_index < len(level_three):
                cluster = level_three[cluster_index]

                if cluster["first_semester"]:
                    if cluster["retake"] > 0:
                        to_extend.extend(retake_cluster(cluster, output_structure, year_index, True))
                    else:
                        year["firstCluster"].append(cluster)
                    level_three.remove(cluster)
                    if "three" not in year["levelsFirst"]:
                        year["levelsFirst"].append("three")
                else:
                    cluster_index +=1

            if check: break
            check = True

        if "two" in year["levelsFirst"]:
            threshold += 1

        if threshold >= 2 and "one" not in year["levelsLast"] and is_free(year["firstCluster"]):

            cluster_index = 0
            while cluster_index < len(level_three):
                cluster = level_three[cluster_index]
                if cluster["last_semester"]:
                    if cluster["retake"] > 0:
                        to_extend = retake_cluster(cluster, output_structure, year_index, False)
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


    #LEVEL 0  (free choice position and afstuderen)

    check = 0
    for cluster in level_zero:



        if freechoice_name in cluster["name"]:
            for year in output_structure:
                if not year["levelsFirst"] and cluster["first_semester"]:
                    year["firstCluster"].append(cluster)
                    year["levelsFirst"].append("zero")
                    break
                if not year["levelsLast"] and cluster["last_semester"]:
                    year["lastCluster"].append(cluster)
                    year["levelsLast"].append("zero")
                    break

        if cluster["name"] == afstuderen_name and check:
            for year in output_structure:
                if not year["levelsFirst"]:
                    year["firstCluster"].append(cluster)
                    year["levelsFirst"].append("zero")
                if not year["levelsLast"]:
                    year["lastCluster"].append(cluster)
                    year["levelsLast"].append("zero")

    return output_structure




print(transform_clusters(cluster_json))
