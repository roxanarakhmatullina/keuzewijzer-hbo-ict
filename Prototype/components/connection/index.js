'use client';
import React from 'react';
import { NODE_HEIGHT, NODE_WIDTH } from "@/providers/SemesterProvider";

const getEdgeCoordinates = (node, x, y) => {
    const { left, top, right, bottom } = {
        left: node.x,
        top: node.y,
        right: node.x + NODE_WIDTH,
        bottom: node.y + NODE_HEIGHT,
    };

    const edges = [
        { x: (left + right) / 2, y: top },
        { x: (left + right) / 2, y: bottom }
    ];

    let closestPoint = edges[0];
    let minDistance = Infinity;

    edges.forEach(point => {
        const dx = x - point.x;
        const dy = y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    });

    return closestPoint;
};

const Connection = ({ from, to, color, highlight }) => {
    const startEdge = getEdgeCoordinates(from, to?.x + NODE_WIDTH / 2, to?.y + NODE_HEIGHT / 2);
    const endEdge = getEdgeCoordinates(to, from.x + NODE_WIDTH / 2, from.y + NODE_HEIGHT / 2);

    const pathWidth = highlight ? 5 : 2;

    const path = `
        M ${startEdge.x} ${startEdge.y}
        V ${(startEdge.y + endEdge.y) / 2} 
        H ${endEdge.x}
        V ${endEdge.y}
    `;

    return (
        <>
            <path
                d={path}
                stroke="transparent"
                strokeWidth={pathWidth + 25}
                strokeLinecap="round"
                pointerEvents="visibleStroke"
                fill="none"
                className={"cursor-pointer"}
                style={{ position: 'relative' }}
            />

            <path
                d={path}
                stroke={color}
                strokeWidth={pathWidth}
                fill="none"
                strokeLinecap="round"
                className={"cursor-pointer"}
                style={{ position: 'relative' }}
            />
        </>
    );
};

export default Connection;
