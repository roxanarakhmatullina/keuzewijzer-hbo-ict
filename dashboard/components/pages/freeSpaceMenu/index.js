'use client'
import { use, useEffect, useState } from "react";
import api from "@/hooks/api";
import Table from "@/components/table";
import Popup from "@/components/popup";
import Add from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import { useAuth } from "@/Providers/AuthProvider";
import Input from "@/components/input";
import Select from "@/components/select";
import Loading from "@/components/loading";
import { filterData } from "@/hooks/filter";
import Label from "@/components/label";
import MultiSelection from "@/components/multiselection";
import SearchView from "@/components/views/search";

const FreeSpacePage = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState(null);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(null);
    const [cohorts, setCohorts] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [categoryCohorts, setCategoryCohorts] = useState([]);
    const [categoryClusters, setCategoryClusters] = useState([]);
    const [categoryDTO, setCategoryDTO] = useState({
        id: "",
        name: "",
        cohortClusters: [],
    });
    const { setLoading } = useAuth();

    //Debugging
    useEffect(() => {
        console.log("categoryDTO", categoryDTO);
    }, [categoryDTO]);

    // Fetch everything on load
    useEffect(() => {
        fetchCategories();
        fetchCohorts();
    }, []);

    // Fetch all the categories
    const fetchCategories = async () => {
        setLoading(true);
        await api.get('/Category')
            .then(res => {
                setCategories(res.data);
                setFilteredCategories(res.data);
            })
            .finally(() => setLoading(false));
    }

    // Fetch all the cohorts
    const fetchCohorts = async () => {
        await api.get('/Cohort/dashboard')
            .then(res => {
                setCohorts(res.data);
            });
    }

    // Fetch all the clusters for the selected cohorts
    useEffect(() => {
        if (categoryCohorts) {
            fetchCategoryClusters();
        }
    }, [categoryCohorts]);

    const fetchCategoryClusters = async () => {
        if (categoryCohorts.length === 0) {
            setClusters([]);
            return;
        }

        const clustersByCohort = {};

        for (const cohort of categoryCohorts) {
            await api.get(`/Cohort/${cohort}/clusters`).then(res => {
                clustersByCohort[cohort] = res.data;
            });
        }

        setClusters(clustersByCohort);
    };

    // Handle the change of the cohort selection
    const handleChangeCohort = (checked, cohort) => {
        let newCohortsList;

        if (checked) {
            newCohortsList = [...categoryCohorts, cohort];
        } else {
            newCohortsList = categoryCohorts.filter(c => c !== cohort);
        }

        setCategoryCohorts(newCohortsList);
        setCategoryDTO(prevState => ({
            ...prevState,
            cohortClusters: newCohortsList.map(c =>
                prevState.cohortClusters.some(cc => cc.cohortId === c) 
                    ? prevState.cohortClusters.find(cc => cc.cohortId === c) 
                    : { cohortId: c, clusterIds: [] }
            )
        }));
    };

    // Handle the change of the cluster selection
    const handleChangeClusters = (checked, cluster, cohort) => {
        const newClustersLists = { ...categoryClusters };

        if (checked) {
            // Ensure the cohort key exists and is an array before adding the cluster
            newClustersLists[cohort] = [...(newClustersLists[cohort] || []), cluster];
        } else {
            // Remove the cluster from the cohort's list
            newClustersLists[cohort] = (newClustersLists[cohort] || []).filter(c => c !== cluster);
        }

        setCategoryClusters(newClustersLists);

        setCategoryDTO(prevState => ({
            ...prevState,
            cohortClusters: prevState.cohortClusters.map(cc => 
                cc.cohortId === cohort ? { ...cc, clusterIds: newClustersLists[cohort] || [] } : cc
            )
        }));
    };

    // Handle the popup state
    const handlePopup = (e, state) => {
        if (state === false) {
            if (!e.target.closest('#popup')) setPopup(false);
            else if (e.target.id === "cancel") setPopup(false);
            setCohorts([]);
        } else {
            setPopup(state);
            fetchCohorts();
        }
    };

    // Handle the save action
    const handleSave = (e) => {
        setLoading(true);
        if (state === "new") {
            api.post('/Category', categoryDTO)
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (state === "edit") {
            api.put(`/Category/${categoryDTO.id}`, {
                name: categoryDTO.name,
                cohortClusters: categoryDTO.cohortClusters,
            })
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (state === "delete") {
            api.delete(`/Category/${categoryDTO.id}`)
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    // Handle the change of the input field
    const handleChange = (attribute, value) => {
        setCategoryDTO(prevState => ({
            ...prevState,
            [attribute]: value,
        }));
    };
    
    // Handle the edit action
    const handleEdit = async (e, category) => {
        setLoading(true);
        await api.get(`/Category/${category.id}`)
            .then(res => {
                const data = res.data;
                setCategoryCohorts(data.cohortClusters.map(cc => cc.cohortId));
                // Build categoryClusters as an object: { [cohortId]: [clusterIds] }
                const clustersByCohort = {};
                data.cohortClusters.forEach(cc => {
                    clustersByCohort[cc.cohortId] = (cc.clusters.map(c => c.id));
                });
                setCategoryClusters(clustersByCohort);
                const cohortClusters = data.cohortClusters.map(cc => (
                    { cohortId: cc.cohortId, clusterIds: clustersByCohort[cc.cohortId] }
                ))
                setCategoryDTO({
                    id: data.id,
                    name: data.name,
                    cohortClusters: cohortClusters,
                });
            }).finally(() => {
                setLoading(false);
                handlePopup(e, true);
                setState("edit");
            });
    };


    // Handle the delete action
    const handleDelete = (e, id) => {
        handlePopup(e, true);
        setCategoryDTO({
            id: id,
            name: "Delete"
        });
        setState("delete");
    };

    // Handle the filter action
    const handleFilter = (e) => {
        filterData(categories, "name", e.target.value.toLowerCase()).then(res => {
            setFilteredCategories(res);
        });
    };

    return (
        <div className="w-full">

            {/*SearchBar and New Button*/}

            <div className={"w-full flex flex-col gap-[10px]"}>

                <SearchView
                    onChange={handleFilter}
                    handleNew={(e) => {
                        setCategoryDTO({
                            id: "",
                            name: "",
                            cohortClusters: [],
                        });
                        setCohorts([]);
                        setClusters([]);
                        setCategoryClusters([]);
                        setCategoryCohorts([]);
                        setState("new");
                        handlePopup(e, true);
                    }}
                />

                <Table data={filteredCategories} handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>

            <Popup
                title={state === "new" ? "Nieuwe category" : state === "edit" ? "Aanpassen category" : state === "delete" ? "Verwijder category" : ""}
                isOpen={popup} onAccept={handleSave} acceptText={state === "delete" ? "Verwijderen" : "Opslaan"}
                onCancel={handlePopup} cancelText={"Annuleren"}
                canAccept={categoryDTO?.name}
                state={state}
                description={state === "delete" ? "Weet je zeker dat je deze category wilt verwijderen?" : ""}
            >
                {state !== "delete" && (
                    <>
                        <Input
                            type={"text"}
                            value={categoryDTO?.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder={"Naam"}
                            label={"Naam"}
                            required
                        />

                        <MultiSelection
                            label={"Cohorten:"}
                            info={() => (
                                <p>Selecteer één of meerdere cohorten; dit verbindt de afstudeerprofiel met één of meer cohorten.</p>
                            )}
                            options={cohorts}
                            onChange={(state, value) => handleChangeCohort(state, value)}
                            selectedOptions={categoryCohorts}
                            optionLabelName={"name"}
                            optionValueName={"id"}
                        />

                        {categoryCohorts.map((cohort) => {
                            const cohortName = cohorts.find(c => c.id === cohort)?.name || cohort;
                            return (
                                <MultiSelection
                                    key={cohort}
                                    label={`Clusters for ${cohortName}:`}
                                    info={() => (
                                        <p>Selecteer één of meerdere clusters voor {cohortName}; dit verbindt de categorie met één of meer clusters.</p>
                                    )}
                                    options={clusters[cohort] || []}
                                    onChange={(state, value) => handleChangeClusters(state, value, cohort)}
                                    selectedOptions={categoryClusters[cohort] || []}
                                    optionLabelName={"name"}
                                    optionValueName={"id"}
                                />
                            );
                        })}
                    </>
                )}
            </Popup>

        </div>
    )
}

export default FreeSpacePage;