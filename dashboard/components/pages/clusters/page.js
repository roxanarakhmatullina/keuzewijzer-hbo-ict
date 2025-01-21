'use client'
import {useEffect, useState} from "react";
import api from "@/hooks/api";
import Table from "@/components/table";
import Popup from "@/components/popup";
import Add from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import {useAuth} from "@/Providers/AuthProvider";
import Input from "@/components/input";
import Select from "@/components/select";
import Loading from "@/components/loading";
import {filterData} from "@/hooks/filter";
import Label from "@/components/label";
import MultiSelection from "@/components/multiselection";

const ClustersPage = () => {
    const [clusters, setClusters] = useState([]);
    const [filteredClusters, setFilteredClusters] = useState(null);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(null);
    const [cohorts, setCohorts] = useState([]);
    const [prerequisites, setPrerequisites] = useState([]);
    const [graduateProfiles, setGraduateProfiles] = useState([]);
    const [clusterCohorts, setClusterCohorts] = useState([]);
    const [clusterGraduateProfiles, setClusterGraduateProfiles] = useState([]);
    const [clusterPrerequisites, setClusterPrerequisites] = useState([]);
    const [clusterLevels, setClusterLevels] = useState([]);
    const [clusterDTO, setClusterDTO] = useState({
        id: "",
        name: "",
        link: "",
        isLocked: false,
        firstSemester: false,
        lastSemester: false,
        level: 0,
        isFreeChoice: false,
        cohortIds: [],
        graduateProfileIds: [],
        prerequisiteIds: [],
    });
    const {setLoading} = useAuth();

    useEffect(() => {
        fetchClusters();
        fetchCohorts();
        fetchClusterLevels();
    }, []);

    const fetchClusters = async () => {
        setLoading(true);
        await api.get('/Cluster')
            .then(res => {
                setClusters(res.data);
                setFilteredClusters(res.data);
            })
            .finally(() => setLoading(false));
    }

    const fetchCohorts = async () => {
        await api.get('/Cohort/dashboard')
            .then(res => {
                setCohorts(res.data);
            });
    }

    const fetchClusterLevels = async () => {
        await api.get('/Level')
            .then(res => {
                setClusterLevels(res.data);
            });
    }

    useEffect(() => {
        if(clusterCohorts) {
            fetchGraduateProfiles();
            fetchClusterPrerequisites();
        }
    }, [clusterCohorts]);

    const fetchGraduateProfiles = async () => {
        if (clusterCohorts.length === 0) {
            setGraduateProfiles([]);
            return;
        }

        const graduateProfilesSet = new Set();
        const profiles = [];

        for (const cohort of clusterCohorts) {
            await api.get(`/Cohort/${cohort}/graduateProfiles`).then(res => {
                res.data.forEach(profile => {
                    if (!graduateProfilesSet.has(profile.id)) {
                        graduateProfilesSet.add(profile.id);
                        profiles.push(profile);
                    }
                });
            });
        }

        setGraduateProfiles(profiles);
    };

    const fetchClusterPrerequisites = async () => {
        if (clusterCohorts.length === 0) {
            setPrerequisites([]);
            return;
        }

        const prerequisitesSet = new Set();
        const prerequisites = [];

        for (const cohort of clusterCohorts) {
            await api.get(`/Cohort/${cohort}/clusters`).then(res => {
                res.data.forEach(prerequisite => {
                    if (!prerequisitesSet.has(prerequisite.id)) {
                        prerequisitesSet.add(prerequisite.id);
                        prerequisites.push(prerequisite);
                    }
                });
            });
        }

        setPrerequisites(prerequisites);
    }

    const handleChangeCohort = (checked, cohort) => {
        let newCohortsList;

        if (checked) {
            newCohortsList = [...clusterCohorts, cohort];
        } else {
            newCohortsList = clusterCohorts.filter(c => c !== cohort);
        }

        setClusterCohorts(newCohortsList);
        setClusterDTO(prevState => ({
            ...prevState,
            cohortIds: newCohortsList,
        }));
    };

    const handleChangeGraduateProfile = (checked, profile) => {
        let newProfilesList;

        if (checked) {
            newProfilesList = [...clusterGraduateProfiles, profile];
        } else {
            newProfilesList = clusterGraduateProfiles.filter(gp => gp !== profile);
        }

        setClusterGraduateProfiles(newProfilesList);
        setClusterDTO(prevState => ({
            ...prevState,
            graduateProfileIds: newProfilesList,
        }));
    }

    const handleChangePrerequisites = (checked, prerequisite) => {
        let newPrerequisitesList;

        if (checked) {
            newPrerequisitesList = [...clusterPrerequisites, prerequisite];
        } else {
            newPrerequisitesList = clusterPrerequisites.filter(p => p !== prerequisite);
        }

        setClusterPrerequisites(newPrerequisitesList);
        setClusterDTO(prevState => ({
            ...prevState,
            prerequisiteIds: newPrerequisitesList,
        }));
    }

    const handlePopup = (e, state) => {
        if(state === false) {
            if(!e.target.closest('#popup')) setPopup(false);
            else if(e.target.id === "cancel") setPopup(false);
            setCohorts([]);
            setGraduateProfiles([]);
        } else {
            setPopup(state);
            fetchCohorts();
        }
    }

    const handleSave = (e) => {
        setLoading(true);
        if(state === "new") {
            api.post('/Cluster', {
                ...clusterDTO,
                level: parseInt(clusterDTO.level),
            })
                .then(res => {
                    fetchClusters();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if(state === "edit") {
            api.post(`/Cluster/${clusterDTO.id}`, {
                ...clusterDTO,
                level: parseInt(clusterDTO.level),
            })
                .then(res => {
                    fetchClusters();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if(state === "delete") {
            api.delete(`/Cluster/${clusterDTO.id}`)
                .then(res => {
                    fetchClusters();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }

    const handleChange = (attribute, value) => {
        setClusterDTO(prevState => ({
            ...prevState,
            [attribute]: value,
        }));
    }

    const handleEdit = async (e, cluster) => {
        setLoading(true);
        await api.get(`/Cluster/${cluster.id}`)
            .then(res => {
                const data = res.data;
                setClusterCohorts(data.cohortIds);
                setClusterGraduateProfiles(data.graduateProfileIds);
                setClusterPrerequisites(data.prerequisiteIds);
                setClusterDTO({
                    id: data.id,
                    name: data.name,
                    link: data.link,
                    isLocked: data.isLocked,
                    isFreeChoice: data.isFreeChoice,
                    firstSemester: data.firstSemester,
                    lastSemester: data.lastSemester,
                    level: data.level,
                    cohortIds: data.cohortIds,
                    graduateProfileIds: data.graduateProfileIds,
                    prerequisiteIds: data.prerequisiteIds,
                });
            }).finally(() => {
                setLoading(false);
                handlePopup(e, true);
                setState("edit");
            });
    }

    const handleDelete = (e, id) => {
        handlePopup(e, true);
        setClusterDTO({
            id: id,
            name: "Delete",
            firstSemester: true,
            level: 0,
        });
        setState("delete");
    }

    const handleFilter = (e) => {
        filterData(clusters, "name", e.target.value.toLowerCase()).then(res => {
            setFilteredClusters(res);
        });
    }

    return (
        <>
            <div className={"w-full flex flex-col gap-[10px]"}>
                <div className={"w-full flex flex-col-reverse md:flex-row justify-end align-middle md:items-center items-end gap-[10px] box-border"}>
                    <Input
                        type={"search"}
                        placeholder={"Zoeken..."}
                        onChange={handleFilter}
                    />
                    <button
                        onClick={(e) => {
                            handlePopup(e, true);
                            setClusterDTO({
                                id: "",
                                name: "",
                                link: "",
                                isLocked: false,
                                isFreeChoice: false,
                                firstSemester: false,
                                lastSemester: false,
                                level: 0,
                                cohortIds: [],
                                graduateProfileIds: [],
                                prerequisiteIds: [],
                            });
                            setCohorts([]);
                            setGraduateProfiles([]);
                            setPrerequisites([]);
                            setClusterPrerequisites([]);
                            setClusterCohorts([]);
                            setClusterGraduateProfiles([]);
                            setState("new");
                        }}
                        className={"hover:brightness-95 min-w-[100px] bg-[#f3f3f3] border-[1px] border-[#c5c5c5] rounded-[8px] p-[5px] box-border flex justify-center align-middle items-center"}>
                        <Add/> Nieuw
                    </button>
                </div>

                <Table data={filteredClusters} handleEdit={handleEdit} handleDelete={handleDelete}/>
            </div>

            <Popup
                title={state === "new" ? "Nieuwe cluster" : state === "edit" ? "Aanpassen cluster" : state === "delete" ? "Verwijder cluster" : ""}
                isOpen={popup} onAccept={handleSave} acceptText={state === "delete" ? "Verwijderen" : "Opslaan"}
                onCancel={handlePopup} cancelText={"Annuleren"}
                canAccept={clusterDTO?.name && clusterDTO?.level !== "" && (clusterDTO.firstSemester || clusterDTO.lastSemester)}
                state={state}
                description={state === "delete" ? "Weet je zeker dat je deze cluster wilt verwijderen?" : ""}
            >
                {state !== "delete" && (
                    <>
                        <Input
                            type={"text"}
                            value={clusterDTO?.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder={"Naam"}
                            label={"Naam"}
                            required
                        />

                        <Input
                            type={"url"}
                            value={clusterDTO?.link || ""}
                            onChange={(e) => handleChange("link", e.target.value)}
                            placeholder={"Link"}
                            label={"Link"}
                            required
                            info={() => (
                                <p>Een webpagina waarna verwezen kan worden voor meer informatie.</p>
                            )}
                        />

                        <Select
                            value={`Level ${clusterDTO?.level}`}
                            onChange={(value) => handleChange("level", parseInt(value))}
                            options={
                                clusterLevels?.map(level => ({
                                    id: level.substring(level.length - 1),
                                    name: `Level ${level.substring(level.length - 1)}`,
                                }))
                            }
                            label={"Level"}
                            optionLabelName={"name"}
                            optionValueName={"id"}
                            required
                            info={() => (
                                <>
                                    <p>Level 0: Clusters die worden ingevuld op lege plekken (Zoals &#34;vrije ruimte&#34;)</p>
                                    <p>Level 1: Clusters die de studie route starten (Zoals &#34;Propedeuse&#34;)</p>
                                    <p>Level 2: Niveau 2 clusters</p>
                                    <p>Level 3: Niveau 3 clusters</p>
                                    <p>Level 4: Clusters die als laatste worden ingevuld (Zoals &#34;Afstuderen&#34;)</p>
                                </>
                            )}
                        />

                        <div className={"w-full flex flex-col gap-[5px] justify-center align-middle items-center"}>
                            <Label text={"Wordt gegeven in:"} required info={
                                () => (
                                    <>
                                        <p>Eerste semester (Herfst): September - Januari</p>
                                        <p>Tweede semester (Lente): Februari - Juni</p>
                                    </>
                                )
                            }/>
                            <div className={"w-full flex flex-col gap-[5px] justify-center align-middle items-center"}>
                                <div className={"w-full flex flex-row gap-[10px] justify-start align-middle items-center"}>
                                    <input
                                        type={"checkbox"}
                                        checked={clusterDTO?.firstSemester}
                                        onChange={(e) => handleChange("firstSemester", e.target.checked)}
                                        className={"w-auto p-[10px] box-border border-[1px] border-[#c5c5c5] rounded-[8px]"}
                                    />
                                    <label className={"w-full"}>Eerste semester (Herfst)</label>
                                </div>

                                <div className={"w-full flex flex-row gap-[10px] justify-start align-middle items-center"}>
                                    <input
                                        type={"checkbox"}
                                        checked={clusterDTO?.lastSemester}
                                        onChange={(e) => handleChange("lastSemester", e.target.checked)}
                                        className={"w-auto p-[10px] box-border border-[1px] border-[#c5c5c5] rounded-[8px]"}
                                    />
                                    <label className={"w-full"}>Tweede semester (Lente)</label>
                                </div>
                            </div>
                        </div>

                        {(clusterDTO && clusterDTO?.level === 0) && (
                            <div className={"w-full flex flex-col gap-[5px] justify-center align-middle items-start"}>
                                <Label text={"Vrije ruimte:"} info={
                                    () => (
                                        <p>Een vrije ruimte wordt wordt ingevuld op een lege plek doormiddel van level 0, vanuit hier kunnen weer meerdere clusters gekozen worden.</p>
                                    )
                                }/>

                                <div
                                    onClick={() => handleChange("isFreeChoice", !clusterDTO?.isFreeChoice)}
                                    style={{cursor: "pointer", width: "25px", height: "25px"}}
                                    className={"w-[25px] h-[25px] box-border rounded-[8px] bg-[#f3f3f3] border-[1px] border-[#c5c5c5] flex justify-center align-middle items-center"}>
                                    {clusterDTO?.isFreeChoice ?
                                        "✔" : ""}
                                </div>
                            </div>
                        )}


                        <div className={"w-full flex flex-col gap-[5px] justify-center align-middle items-start"}>
                            <Label text={"Staat vast:"} info={
                                () => (
                                    <p>Een verplichte cluster wat niet veranderd kan worden, behalve wanneer iemand dit cluster niet heeft gehaald.</p>
                                )
                            }/>

                            <div
                                onClick={() => handleChange("isLocked", !clusterDTO?.isLocked)}
                                style={{cursor: "pointer", width: "25px", height: "25px"}}
                                className={"w-[25px] h-[25px] box-border rounded-[8px] bg-[#f3f3f3] border-[1px] border-[#c5c5c5] flex justify-center align-middle items-center"}>
                                {clusterDTO?.isLocked ?
                                    "✔" : ""}
                            </div>
                        </div>

                        <MultiSelection
                            label={"Cohorten:"}
                            info={() => (
                                <p>Selecteer één of meerdere cohorten; dit verbindt de afstudeerprofiel met één of meer cohorten.</p>
                            )}
                            options={cohorts}
                            onChange={(state, value) => handleChangeCohort(state, value)}
                            selectedOptions={clusterCohorts}
                            optionLabelName={"name"}
                            optionValueName={"id"}
                        />


                        <MultiSelection
                            label={"Afstudeerprofielen:"}
                            info={() => (
                                <p>Selecteer één of meerdere Afstudeerprofielen; dit verbindt de cluster met één of meer
                                    Afstudeerprofielen.</p>
                            )}
                            options={graduateProfiles}
                            onChange={(state, value) => handleChangeGraduateProfile(state, value)}
                            selectedOptions={clusterGraduateProfiles}
                            optionLabelName={"name"}
                            optionValueName={"id"}
                        />

                        {!clusterDTO.isFreeChoice && (
                            <MultiSelection
                                label={"Voorafgaande clusters:"}
                                info={() => (
                                    <p>Selecteer één of meerdere clusters; dit cluster kan alleen gedaan worden als van te voren al één van de geselecteerde voorafgaande clusters is gedaan.</p>
                                )}
                                options={prerequisites}
                                onChange={(state, value) => handleChangePrerequisites(state, value)}
                                selectedOptions={clusterPrerequisites}
                                optionLabelName={"name"}
                                optionValueName={"id"}
                            />
                        )}
                    </>
                )}
            </Popup>

        </>
    )
}

export default ClustersPage;