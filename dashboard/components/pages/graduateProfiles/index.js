'use client'
import Add from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import {useEffect, useState} from "react";
import api from "@/hooks/api";
import {useAuth} from "@/Providers/AuthProvider";
import Table from "@/components/table";
import Popup from "@/components/popup";
import Input from "@/components/input";
import Loading from "@/components/loading";
import {filterData} from "@/hooks/filter";
import Label from "@/components/label";
import MultiSelection from "@/components/multiselection";
import SearchView from "@/components/views/search";

const GraduateProfilePage = () => {
    const [graduateProfiles, setGraduateProfiles] = useState([]);
    const [filteredGraduateProfiles, setFilteredGraduateProfiles] = useState([]);
    const [cohorts, setCohorts] = useState([]);
    const [graduateProfileCohorts, setGraduateProfileCohorts] = useState([]);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(null);
    const [graduateProfileDTO, setGraduateProfileDTO] = useState({
        id: "",
        name: "",
        color: "",
        link: "",
        cohortIds: [],
    });
    const {setLoading} = useAuth();

    useEffect(() => {
        fetchGraduateProfiles();
    }, []);

    const fetchGraduateProfiles = async () => {
        setLoading(true);
        await api.get('/GraduateProfile')
            .then(res => {
                setGraduateProfiles(res.data);
                setFilteredGraduateProfiles(res.data);
            })
            .finally(() => setLoading(false));
    }

    const fetchCohorts = async () => {
        await api.get('/Cohort/dashboard')
            .then(res => setCohorts(res.data));
    }

    const fetchCohortsFromGraduateProfile = async (id) => {
        await api.get(`/GraduateProfile/${id}/cohorts`)
            .then(res => {
                const cohorts = res.data.map(cohort => cohort.id);
                setGraduateProfileCohorts(cohorts);
            });
    }

    const handlePopup = (e, state) => {
        if(state === false) {
            if(!e.target.closest('#popup')) setPopup(false);
            else if(e.target.id === "cancel") setPopup(false);
        } else {
            setPopup(state);
            fetchCohorts();
        }
    }

    const handleChange = (attribute, value) => {
        setGraduateProfileDTO(prevState => ({
            ...prevState,
            [attribute]: value,
        }));
    }

    const handleChangeCohort = (checked, cohort) => {
        if (checked) {
            const newCohortsList = [...graduateProfileCohorts, cohort];
            setGraduateProfileCohorts(newCohortsList);
            setGraduateProfileDTO(prevState => ({
                ...prevState,
                cohortIds: newCohortsList,
            }));

        } else {
            const newCohortsList = graduateProfileCohorts.filter(c => c !== cohort);
            setGraduateProfileCohorts(newCohortsList);
            setGraduateProfileDTO(prevState => ({
                ...prevState,
                cohortIds: newCohortsList,
            }));
        }
    };

    const handleSave = (e) => {
        setLoading(true);
        if(state === "new") {
            api.post('/GraduateProfile', graduateProfileDTO)
                .then(res => {
                    fetchGraduateProfiles();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if(state === "edit") {
            api.post(`/GraduateProfile/${graduateProfileDTO?.id}`, graduateProfileDTO)
                .then(res => {
                    fetchGraduateProfiles();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if(state === "delete") {
            api.delete(`/GraduateProfile/${graduateProfileDTO?.id}`)
                .then(res => {
                    fetchGraduateProfiles();
                    setPopup(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    const handleEdit = (e, profile) => {
        handlePopup(e, true);
        setState("edit");
        setGraduateProfileDTO({
            ...profile,
            link: profile.link || null,
            cohortIds: [],
        });
        fetchCohortsFromGraduateProfile(profile.id);
    }

    const handleDelete = (e, id) => {
        handlePopup(e, true);
        setState("delete");
        setGraduateProfileDTO({
            id: id,
            name: "verwijder",
            color: "#ffffff",
            link: "https://www.website.com",
            cohortIds: [],
        });
    }

    const handleFilter = (e) => {
        filterData(graduateProfiles, "name", e.target.value.toLowerCase()).then(res => {
            setFilteredGraduateProfiles(res);
        });
    }

    return (
        <>
            <div className={"w-full flex flex-col gap-[10px]"}>
                <SearchView
                    handleNew={(e) => {
                        setGraduateProfileCohorts([]);
                        setGraduateProfileDTO({
                            id: "",
                            name: "",
                            color: "",
                            link: null,
                            cohortIds: [],
                        });
                        setState("new");
                        handlePopup(e, true);
                    }}
                    onChange={handleFilter}
                />

                <Table data={filteredGraduateProfiles} handleEdit={handleEdit} handleDelete={handleDelete}/>
            </div>

            <Popup
                isOpen={popup}
                title={state === "new" ? "Nieuwe Afstudeerprofiel" : state === "edit" ? "Aanpassen Afstudeerprofiel" : state === "delete" ? "Verwijder afstudeerprofiel" : ""}
                onAccept={handleSave}
                onCancel={handlePopup}
                acceptText={state === "delete" ? "Verwijder" : "Opslaan"} cancelText={"Annuleren"}
                canAccept={graduateProfileDTO?.name && graduateProfileDTO?.color}
                description={state === "delete" ? "Weet je zeker dat je dit afstudeerprofiel wilt verwijderen?" : ""}
                state={state}
            >
                {state !== "delete" && (
                    <>
                        <Input
                            type={"text"}
                            value={graduateProfileDTO?.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder={"Naam"}
                            label={"Naam"}
                            required
                        />

                        <Input
                            type={"color"}
                            value={graduateProfileDTO?.color}
                            onChange={(e) => handleChange("color", e.target.value)}
                            placeholder={"Kleur"}
                            label={"Kleur"}
                            required
                            info={() => (
                                <p>Een afstudeerprofiel heeft een unieke kleur nodig.</p>
                            )}
                        />

                        <Input
                            type={"url"}
                            value={graduateProfileDTO?.link || ""}
                            onChange={(e) => handleChange("link", e.target.value)}
                            label={"Link"}
                            placeholder={"https://example.com"}
                            info={() => (
                                <p>Een webpagina waarna verwezen kan worden voor meer informatie.</p>
                            )}
                        />

                        <MultiSelection
                            label={"Cohorten:"}
                            info={() => (
                                <p>Selecteer één of meerdere cohorten; dit verbindt de afstudeerprofiel met één of meer cohorten.</p>
                            )}
                            options={cohorts}
                            onChange={(state, value) => handleChangeCohort(state, value)}
                            selectedOptions={graduateProfileCohorts}
                            optionLabelName={"name"}
                            optionValueName={"id"}
                        />
                    </>
                )}
            </Popup>
        </>
    )
}

export default GraduateProfilePage;