import React, { useEffect } from 'react';
import Connection from "@/components/connection"; // Adjust the import based on your file structure
import { useSemester } from "@/providers/SemesterProvider";

const findPathsToSemester = (node, semesterId, path, paths) => {
    // Check if current node is the semester
    if (node.id === semesterId) {
        paths.push([...path, node]);
        return; // Stop further searching as we found a path
    }

    // Traverse the connections
    if (node.connections) {
        for (const conn of node.connections) {
            path.push(conn);
            findPathsToSemester(conn, semesterId, path, paths);
            path.pop(); // Backtrack
        }
    }
};

const findPathsFromSemester = (node, semesterId, path, paths) => {
    // Check if current node is the semester
    if (node.id === semesterId) {
        path.push(node); // Add the semester to the path
        return; // Stop further searching as we found the starting point
    }

    // Traverse the connections
    if (node.connections) {
        for (const conn of node.connections) {
            path.push(conn);
            findPathsFromSemester(conn, semesterId, path, paths);
            path.pop(); // Backtrack
        }
    }
};

const RenderConnections = ({ nodes, setHoveredConnection, connectionIsInGraduateProfile }) => {
    const { selectedGraduateProfile, selectedSemester, graduateProfiles } = useSemester();

    const pathsToSemester = [];
    const pathsFromSemester = [];

    // Find paths to the selected semester
    useEffect(() => {
        if (selectedSemester) {
            console.log('Finding paths for semester:', selectedSemester.id);

            // Reset paths
            pathsToSemester.length = 0;
            pathsFromSemester.length = 0;

            // Find paths to the selected semester
            Object.values(nodes).forEach(node => {
                findPathsToSemester(node, selectedSemester.id, [], pathsToSemester);
            });

            // Find paths starting from the selected semester
            Object.values(nodes).forEach(node => {
                findPathsFromSemester(node, selectedSemester.id, [], pathsFromSemester);
            });

            console.log('Paths to semester:', pathsToSemester);
            console.log('Paths from semester:', pathsFromSemester);
        }
    }, [selectedSemester, nodes, selectedGraduateProfile]);

    // Render paths to/from the selected semester
    const renderPaths = (paths, color) => {
        return paths.flatMap((path, index) => {
            return path.map((connection, connIndex) => {
                const fromNode = connection; // Current node in the path
                const toNode = path[connIndex + 1]; // Next node in the path
                if (!toNode) return null;

                return (
                    <Connection
                        key={`${index}-${connIndex}`}
                        from={fromNode}
                        to={toNode}
                        color={color}
                        setHoveredConnection={setHoveredConnection}
                        zIndex={1}
                    />
                );
            });
        });
    };

    // Render existing connections
    const renderConnections = (filteredConnections, color, highlight, zIndex) => {
        return filteredConnections.map((connection, index) => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            if (!fromNode || !toNode) return null;

            return (
                <Connection
                    key={index}
                    from={fromNode}
                    to={toNode}
                    color={color}
                    setHoveredConnection={setHoveredConnection}
                    highlight={highlight}
                    zIndex={zIndex}
                />
            );
        });
    };

    return (
        <>
            {/* Render paths to the selected semester */}
            {pathsToSemester.length > 0 && renderPaths(pathsToSemester, "green")}

            {/* Render paths from the selected semester */}
            {pathsFromSemester.length > 0 && renderPaths(pathsFromSemester, "orange")}

            {/* Existing rendering logic for other connections */}
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

            {/* Highlight connections for the selected graduate profile */}
            {selectedGraduateProfile && (
                <>
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
            )}

            {selectedSemester && (
                <>
                    {renderConnections(
                        Object.values(nodes).flatMap(node =>
                            // render the connections from the selected semester
                            node.connections.filter(connection => connection.from === selectedSemester.id)
                        ),
                        "blue",
                        true,
                        2
                    )}
                </>
            )}
        </>
    );
};

export default RenderConnections;
