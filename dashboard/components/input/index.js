'use client'
import {useEffect, useState} from "react";
import Search from '@mui/icons-material/Search';
import Label from "@/components/label";

const Input = ({label, type, defaultValue, value, onChange, placeholder, required, disabled, info}) => {
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        if (validateInput(e)) {
            onChange(e);
            setError(false);
        } else {
            setError(true);
        }
    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const validateInput = (e) => {
        const input = e.target;

        if (required && input.value === "") return false;
        if(input.type === "email" && !validateEmail(input.value)) return false;

        // check if doesn't contain any special characters except for numbers and "-" "'", " ", "." and "&"
        if(input.type === "text" && !/^[a-zA-Z0-9-'.& ]+$/.test(input.value)) return false;

        if(input.type === "url" && !/^(ftp|http|https):\/\/[^ "]+$/.test(input.value)) return false;

        if((input.type === "colored" || input.type === "color") && !/^#[0-9A-F]{6}$/i.test(input.value)) return false;

        return true;
    }

    return (
        <div className={`flex flex-col w-full ${disabled && "brightness-95"}`}>
            <Label text={label} required={required} info={info} />
            {(type === "text" || type === "email" || type === "password" || type === "url") && (
                <input
                    type={type}
                    defaultValue={value}
                    onChange={(e) => handleChange(e)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${error && "border-[1px] border-red-600"} h-[40px] w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
                />
            )}

            {(type === "search") && (
                <div
                    className={`relative w-full border border-gray-300 rounded-md shadow-sm flex justify-start align-middle items-center flex-row gap-[5px] focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}>
                    <input
                        type={type}
                        defaultValue={value}
                        onChange={(e) => onChange(e)}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        className={`px-3 pl-[40px] h-[40px] py-2 mt-1 w-full h-full bg-transparent border-0 p-0 focus-visible:outline-none`}
                    />
                    <Search className={"left-[10px] absolute text-gray-500"}/>

                </div>
            )}


            {type === "textarea" && (
                <textarea
                    defaultValue={value}
                    onChange={(e) => handleChange(e)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${error && "border-[1px] border-red-600"} w-full min-h-[150px] px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
                />
            )}

            {type === "color" && (
                <div className={"w-full flex flex-row gap-[10px] justify-center align-middle items-center"}>
                    <div className={"w-[30px] h-[30px] rounded-full flex justify-center align-middle items-center"}>
                        <div className={"absolute w-[30px] h-[30px] rounded-full border-[2px] border-gray-300"} style={{background: value}}></div>
                        <input
                            type={"color"}
                            defaultValue={value}
                            onChange={(e) => handleChange(e)}
                            required={required}
                            disabled={disabled}
                            className={"h-[30px] w-[30px] opacity-0 rounded-full p-[10px] box-border border-[1px] border-[#c5c5c5]"}
                            placeholder={""}
                        />
                    </div>

                    <input
                        type={"colored"}
                        defaultValue={value}
                        onChange={(e) => handleChange(e)}
                        required={required}
                        disabled={disabled}
                        className={`${error && "border-[1px] border-red-600"} h-[40px] w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
                        placeholder={"Kleur"}
                    />
                </div>
            )}
        </div>
    );
}

export default Input;