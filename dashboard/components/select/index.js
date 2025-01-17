'use client';
import { useEffect, useState, useRef } from "react";
import UnfoldMore from '@mui/icons-material/UnfoldMore';

const Select = ({ options, value, onChange, label, optionValueName, optionLabelName }) => {
    const [selected, setSelected] = useState(value);
    const [folded, setFolded] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const selectRef = useRef(null);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    const handleChange = (newValue) => {
        setSelected(newValue);
        onChange(newValue);
    };

    const toggleDropdown = () => {
        if (!folded && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            const dropdownHeight = 150; // Max dropdown height
            const viewportHeight = window.innerHeight;

            const shouldMoveUp = rect.bottom + dropdownHeight > viewportHeight;
            let newTop = shouldMoveUp ? -dropdownHeight : rect.height;

            // new top is negative, so we need to add the height of the select to it
            if(newTop < 0) newTop += rect.height;
            else if (newTop > 40) newTop -= (rect.height * 2) + 10;
            else newTop -= rect.height;


            setDropdownStyle({
                top: newTop,
            });
        }
        setFolded(!folded);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.select')) {
                setFolded(false);
            }
        };

        if (folded) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [folded]);

    return (
        <div className="flex flex-col w-full">
            <label className="font-bold text-black">{label}</label>
            <div
                ref={selectRef}
                onClick={toggleDropdown}
                className={`select relative min-h-[40px] flex justify-start align-middle items-center w-full px-1 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}>
                <UnfoldMore className={"z-[101] bg-transparent hover:bg-gray-200 max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full box-border absolute right-0"} />

                {folded && options && (
                    <div
                        style={dropdownStyle}
                        className={"absolute left-0 w-full z-[100] rounded-md max-h-[150px] overflow-y-scroll h-auto bg-white border-[1px] border-gray-300 shadow-lg shadow-black/30 box-border flex flex-col justify-center align-middle items-center"}>
                        {options?.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    handleChange(option[optionValueName]);
                                    setFolded(false);
                                }}
                                className={`w-full border-b-[1px] p-[10px] border-[#e5e5e5] last:border-b-0 box-border hover:bg-gray-200 flex justify-start align-middle items-center`}>
                                <p className={"text-black box-border"}>{option[optionLabelName]}</p>
                            </button>
                        ))}
                    </div>
                )}

                {options && options.length > 0 && selected && (
                    <p className={"text-black pl-[10px] pr-[10px] box-border"}>{options.find(option => option[optionValueName] === selected) ? options.find(option => option[optionValueName] === selected)[optionLabelName] : value}</p>
                )}
            </div>
        </div>
    );
};

export default Select;