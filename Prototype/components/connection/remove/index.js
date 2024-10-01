'use client'
import React, { useState, useEffect } from 'react';

const RemoveConnection = ({ id, onRemove, setIsHovering, middleX, middleY, buttonRadius }) => {
    return (
        <g
            onMouseOver={() => setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
            onClick={(e) => {
                e.stopPropagation();
                if (from && to) {
                    onRemove(from.id, to.id);
                }
            }}
            cursor="pointer"
        >
            <circle
                cx={middleX}
                cy={middleY}
                r={buttonRadius}
                fill="#fff"
                stroke="#000"
                strokeWidth={2}
                cursor="pointer"
            />
            <line
                x1={middleX - 4}
                y1={middleY - 4}
                x2={middleX + 4}
                y2={middleY + 4}
                stroke="#000"
                strokeWidth={2}
            />
            <line
                x1={middleX - 4}
                y1={middleY + 4}
                x2={middleX + 4}
                y2={middleY - 4}
                stroke="#000"
                strokeWidth={2}
            />
        </g>
    )
}

export default RemoveConnection;