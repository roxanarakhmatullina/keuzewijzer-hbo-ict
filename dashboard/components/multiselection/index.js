'use client';
import React, { useState, useEffect } from "react";
import Label from "@/components/label";
import Close from '@mui/icons-material/Close';
import Select from "@/components/select";

const MultiSelection = ({ label, info, required, options, selectedOptions, onChange }) => {
    const [selected, setSelected] = useState([]);

    const handleSelected = (newValue) => {
        if (selected.includes(newValue)) {
            const updatedSelected = selected.filter(item => item !== newValue);
            setSelected(updatedSelected);
            if (onChange) onChange(false, newValue);
        } else {
            const updatedSelected = [...selected, newValue];
            setSelected(updatedSelected);
            if (onChange) onChange(true, newValue);
        }
    };

    useEffect(() => {
        if (Array.isArray(selectedOptions)) {
            const newSelected = options
                ?.filter(option => selectedOptions.includes(option.id))
                .map(option => option.id);
            setSelected(newSelected);
        }
    }, [selectedOptions, options]);

    const availableOptions = options?.filter(option => !selected.includes(option.id));

    return (
        <div className={"w-full flex flex-col gap-[5px]"}>
            <Label text={label} info={info} required={required} />
            {options?.length > 0 && (
                <div className={"multiselect flex flex-row gap-[5px] flex-wrap bg-[#f3f3f3] p-[10px] box-border rounded-md"}>
                    <Select
                        options={availableOptions}
                        optionLabelName={"name"}
                        optionValueName={"id"}
                        onChange={value => handleSelected(value)}
                        required={required}
                        multiSelect={true}
                    />

                    {selected?.map((item) => (
                        <div key={item}
                             className={"border-[1px] bg-[#fff] rounded-md border-[#c5c5c5] pt-[5px] pb-[5px] p-[10px] box-border flex flex-row gap-[5px] items-center"}>
                            <div className={"w-auto flex flex-row gap-[5px] justify-start align-middle items-center"}>
                                {options?.find(option => option.id === item)?.color && (
                                    <div className={"w-[20px] h-[20px] rounded-full"}
                                         style={{backgroundColor: options?.find(option => option.id === item)?.color}}/>
                                )}
                                <p>{options?.find(option => option.id === item)?.name}</p>
                            </div>
                        <Close
                        onClick={() => handleSelected(item)}
                                className={"text-gray-400 hover:brightness-90 bg-[#fff] rounded-full cursor-pointer p-[3px]"}
                            />
                        </div>
                    ))}

                    {selected?.length === 0 && (
                        <p className={"text-gray-800"}>Geen opties geselecteerd.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelection;