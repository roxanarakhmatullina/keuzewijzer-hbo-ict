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

    useEffect(() => {
        fetchCategories();
        fetchCohorts();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        await api.get('/Category')
            .then(res => {
                setCategories(res.data);
                setFilteredCategories(res.data);
            })
            .finally(() => setLoading(false));
    }

    const fetchCohorts = async () => {
        await api.get('/Cohort/dashboard')
            .then(res => {
                setCohorts(res.data);
            });
    }

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
            cohortClusters: newCohortsList.map(cohort => ({ cohortId: cohort, clusterIds: [] }))
        }));
    };

    const handleChangeClusters = (checked, cluster, cohort) => {
        setCategoryClusters(prevState => {
            const updatedClusters = { ...prevState };

            if (checked) {
                updatedClusters[cohort] = [...(updatedClusters[cohort] || []), cluster];
            } else {
                updatedClusters[cohort] = updatedClusters[cohort].filter(c => c !== cluster);
                if (updatedClusters[cohort].length === 0) {
                    delete updatedClusters[cohort];
                }
            }

            return updatedClusters;
        });

        setCategoryDTO(prevState => ({
            ...prevState,
            //clusterIds: Object.values(categoryClusters).flat()
        }));
    };

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

    const handleSave = (e) => {
        setLoading(true);
        if (state === "new") {
            console.log("categoryDTO: ", categoryDTO);
            api.post('/Category', categoryDTO)
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (state === "edit") {
            api.post(`/Category/${categoryDTO.id}`, categoryDTO)
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

    const handleChange = (attribute, value) => {
        setCategoryDTO(prevState => ({
            ...prevState,
            [attribute]: value,
        }));
    };

    const handleEdit = async (e, category) => {
        setLoading(true);
        await api.get(`/Category/${category.id}`)
            .then(res => {
                console.log("category: ", res.data);
                const data = res.data;
                setCategoryCohorts(data.cohortClusters.map(cohort => ({ id: cohort.cohortId, name: cohort.cohortName })));
                //setCategoryClusters(data.clusterIds);
                setCategoryDTO({
                    id: data.id,
                    name: data.name,
                    cohortClusters: data.cohortClusters,
                });
            }).finally(() => {
                setLoading(false);
                handlePopup(e, true);
                setState("edit");
            });
    };

    const handleDelete = (e, id) => {
        handlePopup(e, true);
        setCategoryDTO({
            id: id,
            name: "Delete"
        });
        setState("delete");
    };

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