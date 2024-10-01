'use client'
import React from 'react';
import Connection from "@/components/connection";
import {useSemester} from "@/providers/SemesterProvider";

const RenderConnections = ({ nodes, setHoveredConnection, connectionIsInGraduateProfile }) => {
    const {selectedGraduateProfile} = useSemester();

    const renderConnections = (connections, color, highlighted, zIndex) => {
        return connections.flatMap((connection, index) => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            if (!fromNode || !toNode) return null;

            return (
                <Connection
                    key={`${highlighted ? 'gp-' : 'non-gp-'}${index}`}
                    from={fromNode}
                    to={toNode}
                    color={color}
                    highlighted={highlighted}
                    setHoveredConnection={setHoveredConnection}
                    zIndex={zIndex}
                />
            );
        });
    };


    return (
        selectedGraduateProfile ? (
                <>
                    {renderConnections(
                        Object.values(nodes).flatMap(node =>
                            node.connections.filter(connection => {
                                const fromNode = nodes[connection.from];
                                const toNode = nodes[connection.to];
                                return fromNode && toNode && !connectionIsInGraduateProfile(fromNode.id, toNode.id, selectedGraduateProfile);
                            })
                        ),
                        "#d5d5d5",
                        false,
                        0
                    )}

                    {renderConnections(
                        Object.values(nodes).flatMap(node =>
                            node.connections.filter(connection => {
                                const fromNode = nodes[connection.from];
                                const toNode = nodes[connection.to];
                                return fromNode && toNode && connectionIsInGraduateProfile(fromNode.id, toNode.id, selectedGraduateProfile);
                            })
                        ),
                        selectedGraduateProfile.color,
                        true,
                        1
                    )}
                </>
            ) : (
                renderConnections(
                    Object.values(nodes).flatMap(node =>
                        node.connections
                    ),
                    "#d5d5d5",
                    false,
                    0
                )
            )
    )
}

export default RenderConnections;