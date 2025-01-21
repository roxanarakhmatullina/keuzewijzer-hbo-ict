'use client';
import { useState } from "react";
import Search from '@mui/icons-material/Search';
import Label from "@/components/label";

const Input = ({ label, type, defaultValue, value, onChange, placeholder, required, disabled, info, state }) => {
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleChange = (e) => {
        if (validateInput(e)) {
            onChange(e);
            setError(false);
        } else {
            setError(true);
        }
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validateInput = (e) => {
        const input = e.target;

        if (required && input.value === "") return false;
        if (input.type === "email" && !validateEmail(input.value)) {
            setErrorText("Voer een geldig e-mailadres in.");
            return false;
        }
        if (!input.classList.contains("colored-input") && input.type === "text" && !/^[a-zA-Z0-9À-ÖØ-öø-ÿ '&()\-.,]{1,}$/.test(input.value)) {
            setErrorText("Voer een geldige tekst in.");
            return false
        }
        if (input.classList.contains("colored-input") && input.type === "color" && !/^#[0-9A-F]{6}$/i.test(input.value)) {
            setErrorText("Voer een geldige hexadecimale kleur in.");
            return false;
        }

        if (state && input.type === "password" && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{12,}$/.test(input.value)) {
            setErrorText("Het wachtwoord moet minimaal 12 tekens bevatten, een hoofdletter, een kleine letter en een cijfer.");
            return false
        }

        setErrorText("");
        return true;
    };

    return (
        <div className={`relative flex flex-col w-full ${disabled && "brightness-95"}`}>
            <Label text={label} required={required} info={info} />
            {(type === "text" || type === "email" || type === "password" || type === "url") && (
                <>
                    <div className={"w-full p-0 min-h-[40px] flex justify-center align-middle items-center flex-col"}>
                        <input
                            type={type}
                            defaultValue={value}
                            onChange={(e) => handleChange(e)}
                            placeholder={placeholder}
                            required={required}
                            disabled={disabled}
                            className={`${error && "border-[1px] bg-red-100 border-red-600"} h-[40px] w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        />
                    </div>

                </>
            )}

            {type === "search" && (
                <div
                    className="relative w-full border border-gray-300 rounded-md shadow-sm flex justify-start items-center gap-[5px] focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500">
                    <input
                        type={type}
                        defaultValue={value}
                        onChange={(e) => onChange(e)}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        className="px-3 pl-[40px] h-[40px] py-2 mt-1 w-full bg-transparent border-0 focus-visible:outline-none"
                    />
                    <Search className="left-[10px] absolute text-gray-500"/>
                </div>
            )}

            {type === "textarea" && (
                <textarea
                    defaultValue={value}
                    onChange={(e) => handleChange(e)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${error && "border-[1px] bg-red-100 border-red-600"} w-full min-h-[150px] px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
                />
            )}

            {type === "color" && (
                <div className="w-full flex flex-row gap-[10px] justify-center items-center">
                    {/* Color picker */}
                    <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center relative">
                        <input
                            type="color"
                            defaultValue={value}
                            onChange={(e) => handleChange(e)}
                            required={required}
                            disabled={disabled}
                            className="h-[30px] w-[30px] opacity-0 absolute"
                        />
                        <div
                            className="w-[30px] h-[30px] rounded-full border-[2px] border-gray-300"
                            style={{ background: value }}
                        ></div>
                    </div>
                    {/* Text input for hex */}
                    <input
                        type="text"
                        defaultValue={value}
                        onChange={(e) => handleChange(e)}
                        required={required}
                        disabled={disabled}
                        className={`colored-input ${error && "border-[1px] border-red-600"} h-[40px] w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Kleur (e.g., #d91e10)"
                    />
                </div>
            )}

            {error && (state === "edit" || state === "delete" || state === "new") && <p className="text-red-600 text-sm mt-1">{errorText}</p>}
        </div>
    );
};

export default Input;