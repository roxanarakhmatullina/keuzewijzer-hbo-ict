'use client'
import React, {useState} from 'react';
import {useAuth} from "@/Providers/AuthProvider";
import Logo from "@/icons/logo";
import Input from "@/components/input";

const LoginPage = () => {
    const {login, loading, setLoading} = useAuth();
    const [authDTO, setAuthDTO] = useState({
        email: null,
        password: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!authDTO?.email || !authDTO?.password) {
            return;
        }
        setLoading(true);
        await login(authDTO?.email, authDTO?.password)
    };

    const handleChange = (attribute, value) => {
        setAuthDTO((prev) => ({
            ...prev,
            [attribute]: value,
        }));
    }

    return (
        <div className={"w-full min-h-dvh h-full bg-[#f3f3f3] p-[25px] box-border justify-center align-middle items-center flex flex-col gap-[25px]"}>
            <form className={"w-full shadow-2xl shadow-black/30 max-w-[500px] bg-[#fff] rounded-[12px] box-border p-[20px] pt-[50px] pb-[50px] flex flex-col gap-[25px]"} onSubmit={handleSubmit}>
                <div className={"w-full h-auto flex flex-col gap-[10px]"}>
                    <div className={"flex flex-row gap-[10px] justify-center align-middle items-center"}>
                        <Logo/>
                        <h1 className={"flex justify-center align-middle items-center text-2xl font-bold"}>Keuzewijzer</h1>
                    </div>
                    {loading ?
                        <h2 className={"w-full flex justify-center align-middle items-center text-lg"}>Bezig met inloggen...</h2>
                        :
                        <h2 className={"w-full flex justify-center align-middle items-center text-lg"}>Log in op het dashboard</h2>
                    }
                </div>

                <Input
                    type={"email"}
                    value={authDTO?.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={"E-mailadres"}
                    label={"E-mailadres"}
                    required
                />

                <Input
                    type={"password"}
                    value={authDTO?.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder={"Wachtwoord"}
                    label={"Wachtwoord"}
                    required
                />

                {authDTO && (
                    <button
                        style={{background: (!authDTO?.email || !authDTO?.password) && "#e5e5e5"}}
                        className={`${(!authDTO?.email || !authDTO?.password) ? "cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 "} w-full flex justify-center align-middle items-center text-white p-[10px] h-[40px] rounded-[8px]`}
                        type="submit">
                        {loading ? "Laden..." : "Inloggen"}
                    </button>
                )}
            </form>
        </div>
    )
};

export default LoginPage;