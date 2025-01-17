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
        if(state === "password") {
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
                    <button
                        onClick={() => {
                            setPopup(true);
                            setState("password");
                            setPasswordDTO({
                                oldPassword: "",
                                newPassword: "",
                                repeat_password: "",
                            });
                        }}
                        className={"w-auto rounded-md p-[5px] h-[40px] box-border flex flex-row gap-[5px] justify-center align-middle items-center bg-[#f3f3f3] border-[1px] border-[#c5c5c5]"}>
                        <Edit className={"text-black"}/>
                        <p className={"text-black"}>Wijzigen</p>
                    </button>
                </div>

                <div className={"mt-[25px] w-full flex flex-row gap-[25px] justify-start items-center"}>
                    <button
                        onClick={() => {
                            setPopup(true);
                            setState("delete");
                        }}
                        className={"w-auto rounded-md p-[10px] box-border flex flex-row gap-[5px] justify-center align-middle items-center bg-red-200"}>
                        <Logout className={"text-red-700 font-bold"}/>
                        <p className={"text-red-700 font-bold"}>Uitloggen</p>
                    </button>

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
                title={state === "delete" ? "Uitloggen" : state === "password" ? "Wachtwoord wijzigen" : ""}
                isOpen={popup}
                onCancel={() => setPopup(false)}
                onAccept={() => state === "delete" ? logout() : handleSave()}
                acceptText={state === "delete" ? "Uitloggen" : state === "password" ? "Wijzigen" : ""}
                description={state === "delete" ? "Je staat op het punt om uit te loggen, weet je het zeker? Je moet daarna opnieuw inloggen, voordat je weer nieuwe acties kunt doen." : ""}
                cancelText={"Annuleren"}
                canAccept={state === "delete" ? true : state === "password" ? (passwordDTO?.oldPassword !== "" && passwordDTO?.newPassword !== "" && passwordDTO.repeat_password !== "" && passwordDTO.newPassword === passwordDTO.repeat_password) : false}
                state={state}
            >
                {state === "password" && (
                    <>
                        <Input
                            type={"password"}
                            value={""}
                            onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                            placeholder={"Huidige wachtwoord"}
                            label={"Huidige wachtwoord"}
                        />

                        <Input
                            type={"password"}
                            value={""}
                            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                            placeholder={"Nieuw wachtwoord"}
                            label={"Nieuw wachtwoord"}
                        />

                        <Input
                            type={"password"}
                            value={""}
                            onChange={(e) => handlePasswordChange("repeat_password", e.target.value)}
                            placeholder={"Herhaal nieuw wachtwoord"}
                            label={"Herhaal nieuw wachtwoord"}
                        />
                    </>
                )}
            </Popup>
        </>
    );
}

export default ProfilePage;