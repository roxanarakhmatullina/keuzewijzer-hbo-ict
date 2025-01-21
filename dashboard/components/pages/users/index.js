'use client'
import {useEffect, useState} from "react";
import api from "@/hooks/api";
import Table from "@/components/table";
import Add from '@mui/icons-material/Add';
import Popup from "@/components/popup";
import Loading from "@/components/loading";
import {useAuth} from "@/Providers/AuthProvider";
import Input from "@/components/input";
import Select from "@/components/select";
import {useAlert} from "@/Providers/AlertProvider";
import {filterData} from "@/hooks/filter";
import Button from "@/components/button";
import SearchView from "@/components/views/search";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [userDTO, setUserDTO] = useState({
        email: "",
        role: "",
        password: "", // Added for user creation
        repeatPassword: "", // Added for password confirmation
    });
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(null);
    const {setLoading} = useAuth();
    const {addAlert} = useAlert();

    useEffect(() => {
        fetchUsers();
        fetchRoles(); // Fetch roles when component mounts
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        await api.get('/Auth/Users')
            .then(res => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .finally(() => setLoading(false));
    }

    const fetchRoles = async () => {
        await api.get('/Auth/Roles').then(res => {
            setRoles(res.data);
            setUserDTO((prev) => ({
                ...prev,
                role: res.data[0]?.id, // Set the default role to the first available role
            }));
        });
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

    const handleChange = (attribute, value) => {
        setUserDTO((prev) => ({
            ...prev,
            [attribute]: value,
        }));
    }

    const handleSave = (e) => {
        setLoading(true);
        if(state === "new") {
            if(userDTO.password !== userDTO.repeatPassword) {
                addAlert({
                    type: "error",
                    message: "Wachtwoorden komen niet overeen."
                });
                setLoading(false);
                return;
            }

            // Send userDTO data to create the new user
            api.post(`/Auth/create-user`, userDTO).then(res => {
                fetchUsers();
                setPopup(false);
                setLoading(false);
                addAlert({
                    type: "ok",
                    message: "Nieuwe gebruiker is aangemaakt, zie de mailbox van de aangemaakte gebruiker voor de inloggegevens."
                });
            })
                .finally(() => {
                    setLoading(false);
                });
        } else if(state === "delete") {
            api.delete(`/Auth/delete-user/${userDTO.id}`).then(res => {
                fetchUsers();
                setPopup(false);
                setLoading(false);
                addAlert({
                    type: "ok",
                    message: "Gebruiker is verwijderd."
                });
            })
                .catch(err => {
                    addAlert({
                        type: "error",
                        message: err.status === 403 ? "Je kunt jezelf niet verwijderen." : "Er is iets misgegaan bij het verwijderen van de gebruiker. Probeer het later opnieuw."
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    const handleDelete = (e, user) => {
        handlePopup(e, true);
        setState("delete");
        setUserDTO({
            id: user,
            email: "delete",
            role: "delete",
        });
    }

    const handleFilter = (e) => {
        filterData(users, "email", e.target.value.toLowerCase()).then(res => {
            setFilteredUsers(res);
        });
    }

    return (
        <>
            <div className={"w-full flex flex-col gap-[10px]"}>
                <SearchView
                    onChange={handleFilter}
                    handleNew={(e) => {
                        setUserDTO({
                            email: "",
                            role: "",
                            password: "", // Clear password fields
                            repeatPassword: "", // Clear password fields
                        });
                        setState("new");
                        handlePopup(e, true);
                    }}
                    />

                <Table data={filteredUsers} handleDelete={handleDelete}/>
            </div>

            <Popup
                title={state === "new" ? "Nieuwe gebruiker" : state === "edit" ? "Aanpassen gebruiker" : state === "delete" ? "Verwijder gebruiker" : ""}
                isOpen={popup} onCancel={handlePopup} onAccept={handleSave}
                canAccept={state === "delete" ? (userDTO?.email && userDTO?.role) : (userDTO?.email && userDTO?.role && userDTO?.password && userDTO?.repeatPassword && userDTO?.password === userDTO?.repeatPassword)}
                acceptText={state === "delete" ? "Verwijderen" : "Opslaan"} cancelText={"Annuleren"}
                description={state === "delete" ? "Weet je zeker dat je deze gebruiker wilt verwijderen?" : ""}
                state={state}
            >
                <Input
                    type={"email"}
                    value={userDTO?.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={"E-mailadres"}
                    label={"E-mailadres"}
                    required
                />

                <Select
                    value={userDTO?.role}
                    onChange={(value) => handleChange("role", value)}
                    options={roles}
                    label={"Rol"}
                    optionLabelName={"name"}
                    optionValueName={"id"}
                    required
                />

                <Input
                    type={"password"}
                    value={userDTO?.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder={"Wachtwoord"}
                    label={"Wachtwoord"}
                    state={state}
                    autoComplete={"new-password"}
                    required
                />

                <Input
                    type={"password"}
                    value={userDTO?.repeatPassword}
                    onChange={(e) => handleChange("repeatPassword", e.target.value)}
                    placeholder={"Herhaal wachtwoord"}
                    label={"Herhaal wachtwoord"}
                    state={state}
                    autoComplete={"new-password"}
                    required
                />
            </Popup>
        </>
    )
}

export default UsersPage;