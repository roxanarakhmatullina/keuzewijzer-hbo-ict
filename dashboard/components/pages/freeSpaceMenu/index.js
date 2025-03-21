'use client'
import { useEffect, useState } from "react";
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
        cohortIds: [],
        clusterIds: [],
    });
    const { setLoading } = useAuth();

    useEffect(() => {
        fetchCategories();
        fetchCohorts();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        await api.get('/Categories')
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

        const clustersSet = new Set();
        const clusters = [];

        for (const cohort of categoryCohorts) {
            await api.get(`/Cohort/${cohort}/clusters`).then(res => {
                res.data.forEach(cluster => {
                    if (!clustersSet.has(cluster.id)) {
                        clustersSet.add(cluster.id);
                        clusters.push(cluster);
                    }
                });
            });
        }

        setClusters(clusters);
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
            cohortIds: newCohortsList
        }));
    };

    const handleChangeClusters = (checked, cluster) => {
        let newClustersList;
        if (checked) {
            newClustersList = [...categoryClusters, cluster];
        } else {
            newClustersList = categoryClusters.filter(p => p !== cluster);
        }

        setCategoryClusters(newClustersList);
        setCategoryDTO(prevState => ({
            ...prevState,
            clusterIds: newClustersList
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
            api.post('/Categories', {
                ...categoryDTO,
                level: parseInt(categoryDTO.level),
            })
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (state === "edit") {
            api.post(`/Categories/${categoryDTO.id}`, {
                ...categoryDTO,
                level: parseInt(categoryDTO.level),
            })
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (state === "delete") {
            api.delete(`/Categories/${categoryDTO.id}`)
                .then(res => {
                    fetchCategories();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                })
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
        await api.get(`/Categories/${category.id}`)
            .then(res => {
                const data = res.data;
                setCategoryCohorts(data.cohortIds);
                setCategoryClusters(data.clusterIds);
                setCategoryDTO({
                    id: data.id,
                    name: data.name,
                    cohortIds: data.cohortIds,
                    clusterIds: data.prerequisiteIds
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
                            cohortIds: [],
                            clusterIds: []
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
                title={state === "new" ? "Nieuwe cluster" : state === "edit" ? "Aanpassen cluster" : state === "delete" ? "Verwijder cluster" : ""}
                isOpen={popup} onAccept={handleSave} acceptText={state === "delete" ? "Verwijderen" : "Opslaan"}
                onCancel={handlePopup} cancelText={"Annuleren"}
                canAccept={categoryDTO?.name !== "" && categoryDTO?.cohortIds?.length > 0 && categoryDTO.clusterIds?.length > 0}
                state={state}
                description={state === "delete" ? "Weet je zeker dat je deze cluster wilt verwijderen?" : ""}
            >
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

                <MultiSelection
                    label={"Clusters:"}
                    info={() => (
                        <p>Selecteer één of meerdere clusters; dit verbindt de categorie met één of meer clusters.</p>
                    )}
                    options={clusters}
                    onChange={(state, value) => handleChangeClusters(state, value)}
                    selectedOptions={categoryClusters}
                    optionLabelName={"name"}
                    optionValueName={"id"}
                />

                
            </Popup>

        </div>
    )
}

export default FreeSpacePage;