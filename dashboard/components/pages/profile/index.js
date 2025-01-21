'use client'
import React, {useEffect, useState} from 'react';
import {useAuth} from "@/Providers/AuthProvider";
import Logout from '@mui/icons-material/Logout';
import Edit from '@mui/icons-material/Edit';
import Security from '@mui/icons-material/Security';
import Popup from "@/components/popup";
import Input from "@/components/input";
import {useAlert} from "@/Providers/AlertProvider";
import api from "@/hooks/api";
import Button from "@/components/button";


const ProfilePage = () => {
    const {user, logout, setLoading} = useAuth();
    const {addAlert} = useAlert();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(null);
    const [passwordDTO, setPasswordDTO] = useState({
        oldPassword: "",
        newPassword: "",
        repeat_password: "",
    });

    const handlePasswordChange = (attribute, value) => {
        setPasswordDTO((prev) => ({
            ...prev,
            [attribute]: value,
        }));
    }

    const handleSave = () => {
        if(state === "edit") {
            setLoading(true);
            if(passwordDTO?.newPassword !== passwordDTO?.repeat_password) {
                addAlert({
                    type: "error",
                    message: "De wachtwoorden komen niet overeen."
                });
                setLoading(false);
            } else {
                api.post(`/Auth/change-password`, {
                    oldPassword: passwordDTO.oldPassword,
                    newPassword: passwordDTO.newPassword,
                })
                    .then(() => {
                        addAlert({
                            type: "ok",
                            message: "Je wachtwoord is succesvol gewijzigd."
                        });
                        setPopup(false);
                    })
                    .catch(() => {
                        addAlert({
                            type: "error",
                            message: "Er is iets misgegaan bij het wijzigen van je wachtwoord."
                        });
                    })
                    .finally(() => setLoading(false));
            }
        }
    }

    return (
        <>
            <div className={"w-full flex flex-col gap-[10px]"}>

                {/*{!user?.twoFactorEnabled && (*/}
                {/*    <div className={"w-auto h-auto p-[10px] rounded-md bg-orange-100 border-[1px] border-orange-400"}>*/}
                {/*        <p className={"text-orange-700"}>Two-factor-authentication is niet ingeschakeld</p>*/}
                {/*    </div>*/}
                {/*)}*/}

                <Input
                    type={"text"}
                    value={user?.email}
                    onChange={(e) => {}}
                    placeholder={"E-mailadres"}
                    label={"E-mailadres"}
                    disabled={true}
                />

                <Input
                    type={"text"}
                    value={user?.role}
                    onChange={(e) => {}}
                    placeholder={"Rol"}
                    label={"Rol"}
                    disabled={true}
                />

                <div className={"w-full flex flex-row gap-[10px] justify-center align-middle items-end"}>
                    <Input
                        type={"password"}
                        value={"********"}
                        onChange={(e) => {}}
                        placeholder={"Wachtwoord"}
                        label={"Wachtwoord"}
                        disabled={true}
                    />
                    <Button
                        type={"primary"}
                        onClick={() => {
                            setPopup(true);
                            setState("edit");
                            setPasswordDTO({
                                oldPassword: "",
                                newPassword: "",
                                repeat_password: "",
                            });
                        }}
                        >
                        <Edit/>
                        <p>Wijzigen</p>
                    </Button>
                </div>

                <div className={"mt-[25px] w-full flex flex-row gap-[25px] justify-start items-center"}>
                    <Button
                        type={"secondary"}
                        onClick={() => {
                            setPopup(true);
                            setState("delete");
                        }}
                        className={"w-auto rounded-md p-[10px] box-border flex flex-row gap-[5px] justify-center align-middle items-center bg-red-200"}>
                        <Logout/>
                        <p>Uitloggen</p>
                    </Button>

                    {/*{user?.twoFactorEnabled ? (*/}
                    {/*    <></>*/}
                    {/*) : (*/}
                    {/*    <button*/}
                    {/*        onClick={() => {*/}
                    {/*            setPopup(true);*/}
                    {/*            setState("two-factor");*/}
                    {/*        }}*/}
                    {/*        className={"w-auto rounded-md p-[10px] box-border flex flex-row gap-[5px] justify-center align-middle items-center bg-blue-200"}>*/}
                    {/*        <Security className={"text-blue-700 font-bold"}/>*/}
                    {/*        <p className={"text-blue-700 font-bold"}>Two-factor-authentication inschakelen</p>*/}
                    {/*    </button>*/}
                    {/*)}*/}
                </div>
            </div>

            <Popup
                title={state === "delete" ? "Uitloggen" : state === "edit" ? "Wachtwoord wijzigen" : ""}
                isOpen={popup}
                onCancel={() => setPopup(false)}
                onAccept={() => state === "delete" ? logout() : handleSave()}
                acceptText={state === "delete" ? "Uitloggen" : state === "edit" ? "Wijzigen" : ""}
                description={state === "delete" ? "Je staat op het punt om uit te loggen, weet je het zeker? Je moet daarna opnieuw inloggen, voordat je weer nieuwe acties kunt doen." : ""}
                cancelText={"Annuleren"}
                canAccept={state === "delete" ? true : state === "edit" ? (passwordDTO?.oldPassword !== "" && passwordDTO?.newPassword !== "" && passwordDTO.repeat_password !== "" && passwordDTO.newPassword === passwordDTO.repeat_password) : false}
                state={state}
            >
                {state === "edit" && (
                    <>
                        <Input
                            type={"password"}
                            value={""}
                            onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                            placeholder={"Huidige wachtwoord"}
                            label={"Huidige wachtwoord"}
                            state={state}
                        />

                        <Input
                            type={"password"}
                            value={""}
                            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                            placeholder={"Nieuw wachtwoord"}
                            label={"Nieuw wachtwoord"}
                            autoComplete={"new-password"}
                            state={state}
                        />

                        <Input
                            type={"password"}
                            value={""}
                            onChange={(e) => handlePasswordChange("repeat_password", e.target.value)}
                            placeholder={"Herhaal nieuw wachtwoord"}
                            label={"Herhaal nieuw wachtwoord"}
                            autoComplete={"new-password"}
                            state={state}
                        />
                    </>
                )}
            </Popup>
        </>
    );
}

export default ProfilePage;