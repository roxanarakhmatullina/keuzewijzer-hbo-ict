'use client'
import React from 'react';

/**
 *
 * @param children
 * @param onClick
 * @param className
 * @param disabled
 * @param type
 * @param style
 * @returns {Element}
 * @constructor
 */
const Button = ({children, onClick, className, disabled, type, style}) => {
    return (
        <button
            onClick={onClick}
            className={`hover:brightness-95 cursor-pointer` && !disabled && type === "primary" ?
                `flex flex-row gap-[5px] bg-blue-600 text-white font-normal px-4 py-2 rounded-md ${className}`
            : type === "danger" ?
                `flex flex-row gap-[5px] bg-red-600 text-white font-normal px-4 py-2 rounded-md ${className}`
            : type === "warning" ?
                `flex flex-row gap-[5px] bg-yellow-600 text-white font-normal px-4 py-2 rounded-md ${className}`
            : type === "success" ?
                `flex flex-row gap-[5px] bg-green-600 text-white font-normal px-4 py-2 rounded-md ${className}`
            : disabled ?
                `flex flex-row gap-[5px] bg-gray-200 text-[#999] cursor-not-allowed font-normal px-4 py-2 rounded-md ${className}`
            : `flex flex-row gap-[5px] bg-[#e5e5e5] text-[#424242] font-normal px-4 py-2 rounded-md ${className}`}
            disabled={disabled}
            type={type}
            style={style}
        >
            {children}
        </button>
    );
}

export default Button;