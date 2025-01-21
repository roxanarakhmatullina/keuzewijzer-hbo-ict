'use client';
import { useEffect, useState, useRef } from "react";
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import Check from '@mui/icons-material/Check';
import Label from "@/components/label";

const Select = ({ options, value, onChange, label, optionValueName, optionLabelName, required, info, multiSelect }) => {
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

    const calculateDropdownPosition = () => {
        if (!selectRef.current) return;

        // Get the select element's dimensions and position
        const selectRect = selectRef.current.getBoundingClientRect();
        const parentRect = multiSelect ?
            selectRef.current.parentElement.getBoundingClientRect() :
            selectRect;

        const dropdownHeight = Math.min(250, options.length * 40); // Estimate height based on items
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - parentRect.bottom;
        const spaceAbove = parentRect.top;

        // Determine if dropdown should open upward or downward
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        const style = {
            position: 'absolute',
            width: `${parentRect.width}px`,
            left: 0,
        };

        if (openUpward) {
            const maxHeight = Math.min(250, spaceAbove);
            style.bottom = `calc(100%-${parentRect.height}px)`;
            style.maxHeight = `${maxHeight}px`;
        } else {
            const maxHeight = Math.min(250, spaceBelow);
            style.top = `calc(100%-${parentRect.height}px)`;
            style.maxHeight = `${maxHeight}px`;
        }

        return style;
    };

    const toggleDropdown = () => {
        if (!folded) {
            const newStyle = calculateDropdownPosition();
            setDropdownStyle(newStyle);
        }
        setFolded(!folded);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.select')) {
                setFolded(false);
            }
        };

        const handleScroll = () => {
            if (folded) {
                const newStyle = calculateDropdownPosition();
                setDropdownStyle(newStyle);
            }
        };

        if (folded) {
            document.addEventListener("click", handleClickOutside);
            window.addEventListener("scroll", handleScroll);
            window.addEventListener("resize", handleScroll);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [folded]);

    return (
        <div className="flex flex-col w-full">
            <Label text={label} required={required} info={info} />
            <div
                ref={selectRef}
                onClick={toggleDropdown}
                className={`select relative ${options?.length > 0 ? "bg-white" : "bg-[#f3f3f3]"} min-h-[40px] flex justify-start items-center w-full px-1 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
            >
                <UnfoldMore className="bg-transparent hover:bg-gray-200 max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full box-border absolute right-0" />

                {folded && options && (
                    <div
                        style={dropdownStyle}
                        className="z-[100] rounded-md overflow-y-auto bg-white border border-gray-300 shadow-lg shadow-black/30"
                    >
                        {options?.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    handleChange(option[optionValueName]);
                                    setFolded(false);
                                }}
                                className="w-full border-b border-[#e5e5e5] last:border-b-0 p-[10px] hover:bg-gray-200 flex justify-start items-center"
                            >
                                <p className="text-black">{option[optionLabelName]}</p>
                            </button>
                        ))}
                    </div>
                )}

                {options && options.length > 0 && selected && (
                    <p className="text-black pl-[10px] pr-[10px]">
                        {options.find(option => option[optionValueName] === selected)
                            ? options.find(option => option[optionValueName] === selected)[optionLabelName]
                            : value}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Select;