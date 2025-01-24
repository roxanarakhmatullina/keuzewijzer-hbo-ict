'use client';
import React, { useEffect, useState } from 'react';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import {useAuth} from "@/Providers/AuthProvider";

const Table = ({ data, handleDelete, handleEdit }) => {
    const [columnWidths, setColumnWidths] = useState({});
    const {user} = useAuth();

    useEffect(() => {
        if (data?.length > 0) {
            // Create a temporary element to measure text width
            const tempElement = document.createElement('div');
            tempElement.style.position = 'absolute';
            tempElement.style.visibility = 'hidden';
            tempElement.style.whiteSpace = 'nowrap';
            document.body.appendChild(tempElement);

            const widths = {};
            const keys = Object.keys(data[0]).filter(key => !key.toLowerCase().includes("id"));

            keys.forEach((key) => {
                let maxWidth = 0;

                // Measure header width
                tempElement.textContent = key.substring(0, 1).toUpperCase() + key.substring(1);
                maxWidth = Math.max(maxWidth, tempElement.offsetWidth);

                // Measure content width for each item
                data.forEach((item) => {
                    tempElement.textContent = item[key];
                    maxWidth = Math.max(maxWidth, tempElement.offsetWidth);
                });

                widths[key] = maxWidth + 20; // Add some padding
            });

            setColumnWidths(widths);
            document.body.removeChild(tempElement);
        }
    }, [data]);

    return (
        <div className="w-full overflow-x-scroll flex flex-col h-auto justify-center align-middle items-center">
            {/* Header */}
            <div className="w-full flex gap-[10px] flex-row p-[10px] pl-[20px] pr-[20px] box-border bg-[#f3f3f3] rounded-t-[8px] border-[1px] border-[#c5c5c5]">
                {data?.length > 0 &&
                    Object.keys(data[0]).map((key, index) => (
                        !key.toLowerCase().includes("id") && (
                            <div
                                key={index}
                                className="truncate text-ellipsis overflow-hidden font-bold flex text-start"
                                style={{ width: `${columnWidths[key]}px` }}
                            >
                                {key === "isAvailable" ? "Zichtbaar" : key === "name" ? "Naam" : key === "color" ? "Kleur" : key === "colors" ? "Afstudeerrichtingen" : key === "role" ? "Rol" : key === "email" ? "E-mailadres"
                                : key.substring(0, 1).toUpperCase() + key.substring(1)}
                            </div>
                        )
                    ))}
            </div>
            {/* Rows */}
            <div className="w-full border-[1px] border-t-0 border-[#c5c5c5] rounded-b-[8px] flex justify-center align-middle items-center flex-col">
                {data?.map((item, index) => (
                    <div
                        key={item?.id ? item.id : index}
                        className="w-full gap-[10px] flex-auto h-full justify-center align-middle items-center p-[10px] pl-[20px] pr-[20px] box-border flex flex-row border-b-[1px] last:border-b-0 border-[#e5e5e5]"
                    >
                        {Object.keys(item).map((key, idx) => (
                            <React.Fragment key={idx}>
                                {key === "isAvailable" && (
                                    <div
                                        className="truncate overflow-ellipsis overflow-hidden h-full flex justify-start align-middle items-center text-start"
                                        style={{ width: `${columnWidths[key]}px` }}
                                    >
                                        {item[key] ? "Ja" : "Nee"}
                                    </div>
                                )}
                                {!key.toLowerCase().includes("id") && key !== "color" && key !== "colors" && (
                                    <div
                                        className="truncate overflow-ellipsis overflow-hidden h-full flex justify-start align-middle items-center text-start"
                                        style={{ width: `${columnWidths[key]}px` }}
                                    >
                                        {item[key]}
                                    </div>
                                )}
                                {(key === "color" || key === "colors") && (
                                    <div
                                        className="truncate overflow-ellipsis overflow-hidden h-full flex justify-start align-middle items-center text-start"
                                        style={{ width: `${columnWidths[key]}px` }}
                                    >
                                        {Array.isArray(item[key]) ? (
                                            item[key]
                                                .map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="w-[20px] border-[1px] border-[#fff] h-[20px] rounded-[50%] mr-[-5px]"
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                            ))
                                        ) : (
                                            <div
                                                className="w-[20px] h-[20px] rounded-[50%]"
                                                style={{ backgroundColor: item[key] }}
                                            ></div>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        <div className="flex-auto flex justify-end gap-[10px]">
                            {handleEdit && (
                                <button
                                    onClick={(e) => handleEdit(e, item)}
                                    className="w-[30px] h-[30px] p-[5px] box-border flex justify-center align-middle items-center bg-blue-200 rounded-[8px]"
                                >
                                    <Edit className="text-blue-600"/>
                                </button>
                            )}
                            {(item?.email && item.email === user?.email) || !(data?.length === 1 && data?.some(d => d.role)) && handleDelete && (
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="w-[30px] h-[30px] p-[5px] box-border flex justify-center align-middle bg-red-200 items-center rounded-[8px]"
                                >
                                    <Delete className="text-red-600"/>
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {(data === undefined || data === null || data.length === 0) && (
                    <div className="w-full flex justify-center align-middle items-center p-[10px] pl-[20px] pr-[20px] box-border">
                        <p>Geen resultaten gevonden.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;