'use client'
import Add from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import api from "@/hooks/api";
import Table from "@/components/table";
import Popup from "@/components/popup";
import Input from "@/components/input";
import Select from "@/components/select";
import {useAuth} from "@/Providers/AuthProvider";
import Loading from "@/components/loading";
import {filterData} from "@/hooks/filter";

const CohortsPage = () => {
    const [cohorts, setCohorts] = useState([]);
    const [filteredCohorts, setFilteredCohorts] = useState([]);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(null);
    const [cohortDTO, setCohortDTO] = useState({
        id: "",
        name: "",
        isAvailable: "false",
    });
    const {setLoading} = useAuth();

    useEffect(() => {
        fetchCohorts();
    }, []);

    const fetchCohorts = async () => {
        setLoading(true);
        await api.get('/Cohort/dashboard')
            .then(res => {
                setCohorts(res.data);
                setFilteredCohorts(res.data);
            })
            .finally(() => setLoading(false));
    }

    const handlePopup = (e, state) => {
        if(state === false) {
            if(!e.target.closest('#popup')) {
                setPopup(false);
            } else if(e.target.id === "cancel") {
                setPopup(false);
            }
        } else {
            setPopup(state);
        }
    }

    const handleSave = (e) => {
        setLoading(true);
        if(state === "new") {
            api.post('/Cohort', {
                ...cohortDTO,
                isAvailable: cohortDTO?.isAvailable === "true",
            })
            .then(res => {
                fetchCohorts();
                setPopup(false);
            })
            .finally(() => {
                setLoading(false);
            })
        } else if(state === "edit") {
            api.post(`/Cohort/${cohortDTO?.id}`, {
                ...cohortDTO,
                isAvailable: cohortDTO?.isAvailable === "true",
            })
            .then(res => {
                fetchCohorts();
                setPopup(false);
            })
            .finally(() => {
                setLoading(false);
            })
        } else if(state === "delete") {
            api.delete(`/Cohort/${cohortDTO?.id}`)
            .then(res => {
                fetchCohorts();
                setPopup(false);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    const handleChangeCohort = (value) => {
        setCohortDTO((prev) => ({
            ...prev,
            name: value,
        }));
    };

    const handleEdit = (e, cohort) => {
        handlePopup(e,true);
        setState("edit");
        setCohortDTO({
            id: cohort.id,
            name: cohort.name,
            isAvailable: cohort.isAvailable ? "true" : "false",
        });
    }

    const handleDelete = (e, id) => {
        handlePopup(e,true);
        setCohortDTO({
            id: id,
            name: "remove",
            isAvailable: "true",
        });
        setState("delete");
    };

    const handleFilter = (e) => {
        filterData(cohorts, "name", e.target.value.toLowerCase()).then(res => {
            setFilteredCohorts(res);
        });
    }

    return (
        <>
            <div className={"w-full flex flex-col gap-[10px]"}>
                <div className={"w-full flex flex-row justify-center align-middle items-center gap-[10px] box-border"}>
                    <Input
                        type={"search"}
                        onChange={handleFilter}
                        placeholder={"Zoeken..."}
                    />
                    <button
                        onClick={(e) => {
                            handlePopup(e,true);
                            setCohortDTO({
                                id: "",
                                name: "",
                                isAvailable: "false",
                            })
                            setState("new");
                        }}
                        className={"hover:brightness-95 min-w-[100px] bg-[#f3f3f3] border-[1px] border-[#c5c5c5] rounded-[8px] p-[5px] box-border flex justify-center align-middle items-center"}>
                        <Add/> Nieuw
                    </button>
                </div>

                <Table data={filteredCohorts} handleEdit={handleEdit} handleDelete={handleDelete}/>
            </div>

            <Popup
                title={state === "new" ? "Nieuwe cohort" : state === "edit" ? "Aanpassen cohort" : state === "delete" ? `Verwijder cohort` : ""}
                isOpen={popup} onAccept={handleSave} onCancel={handlePopup}
                acceptText={state === "delete" ? "Verwijderen" : "Opslaan"} cancelText={"Annuleren"}
                canAccept={cohortDTO?.name && cohortDTO?.isAvailable}
                description={state === "delete" ? "Weet je zeker dat je dit cohort wilt verwijderen?" : ""}
                state={state}
            >
                <Input
                    type={"text"}
                    value={cohortDTO?.name}
                    onChange={(e) => handleChangeCohort(e.target.value, cohortDTO?.id)}
                    placeholder={"Naam"}
                    label={"Naam"}
                    required
                />

                {state === "edit" && (
                    <Select
                        value={cohortDTO?.isAvailable}
                        onChange={(value) => setCohortDTO((prev) => ({...prev, isAvailable: value}))}
                        options={[
                            {value: "true", label: "Ja"},
                            {value: "false", label: "Nee"},
                        ]}
                        optionLabelName={"label"}
                        optionValueName={"value"}
                        label={"Zichtbaar"}
                        required
                        info={() => (
                            <p>Het is verstandig wanneer je begint met een studie route te maken, je de zichtbaarheid nog uit zet, om fouten te voorkomen.</p>
                        )}
                    />
                )}
            </Popup>
        </>
    )
}

export default CohortsPage;