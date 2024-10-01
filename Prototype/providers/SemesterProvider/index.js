'use client'
import React, {useEffect, useState} from 'react';

const SemesterContext = React.createContext();

export const NODE_HEIGHT = 90;
export const NODE_WIDTH = 175;

export const useSemester = () => {
    return React.useContext(SemesterContext);
}

const SemesterProvider = ({children}) => {
    const [nodes, setNodes] = useState(null);
    const [graduateProfiles, setGraduateProfiles] = useState(null);
    const [selectedGraduateProfile, setSelectedGraduateProfile] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('./graduate-profiles.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setGraduateProfiles(jsonData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('./semesters.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setNodes(jsonData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);


    const handleEditGraduateProfile = (id, label, color, connections) => {
        setGraduateProfiles(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                label: label && label,
                color: color && color,
                connections: connections && connections
            }
        }));
    };


    const handleAddNode = () => {
        const newId = Date.now();
        setNodes(prev => ({
            ...prev,
            [newId]: {
                id: newId,

                x: window.innerWidth / 2 - NODE_WIDTH / 2,
                y: window.innerHeight / 2 - NODE_HEIGHT / 2,

                connections: [],
                name: `Node ${Object.keys(prev).length + 1}`
            }
        }));
    };

    const handleHighlightPathConnections = (graduateProfile) => {
        setNodes(prevNodes => {
            const updatedNodes = { ...prevNodes };

            // Reset highlighting for all nodes
            Object.values(updatedNodes).forEach(node => {
                node.isHighlighted = false; // Ensure nodes are not highlighted
                node.highlightConnections = [];
            });

            if (graduateProfile && updatedNodes[graduateProfile.id]) {
                // Highlight paths connected to the selected graduate profile
                const highlightConnectionsRecursively = (currentProfileId) => {
                    const currentProfile = updatedNodes[currentProfileId];
                    if (currentProfile) {
                        // Highlight connections leading to this profile
                        currentProfile.connections.forEach(connection => {
                            const targetNodeId = connection.to;

                            if (updatedNodes[targetNodeId]) {
                                // Highlight the connection leading to the target node
                                updatedNodes[targetNodeId].isHighlighted = true; // Highlight child node

                                // Store the highlighted connection for reference
                                updatedNodes[targetNodeId].highlightConnections.push(connection);

                                // Recursively highlight connections for the child node
                                highlightConnectionsRecursively(targetNodeId);
                            }
                        });

                        // Highlight the parent connections for this graduate profile
                        if (currentProfile.parentId && updatedNodes[currentProfile.parentId]) {
                            updatedNodes[currentProfile.parentId].isHighlighted = true; // Highlight parent node

                            // Store the highlighted connection from parent to this profile
                            const parentConnection = updatedNodes[currentProfile.parentId].connections.find(conn => conn.to === currentProfileId);
                            if (parentConnection) {
                                updatedNodes[currentProfile.parentId].highlightConnections.push(parentConnection);
                            }
                        }
                    }
                };

                // Start highlighting connections from the selected graduate profile
                highlightConnectionsRecursively(graduateProfile.id);
            }

            return updatedNodes;
        });
    };


    const handleHighlightConnectionsOfNode = (node) => {
        // highlight all the paths where the node is in the graduate profiles
        setNodes(prevNodes => {
            const updatedNodes = { ...prevNodes };

            Object.values(updatedNodes).forEach(node => {
                node.isHighlighted = false;
                node.highlightConnections = [];
            });

            if (node) {
                const highlightConnectionsRecursively = (currentNodeId) => {
                    const currentNode = updatedNodes[currentNodeId];
                    if (currentNode) {
                        currentNode.isHighlighted = true;

                        console.log(currentNode);

                        currentNode.connections.forEach(connection => {
                            const targetNodeId = connection.to;
                            if (updatedNodes[targetNodeId]) {
                                updatedNodes[targetNodeId].isHighlighted = true;
                                updatedNodes[targetNodeId].highlightConnections.push(connection);
                                highlightConnectionsRecursively(targetNodeId);
                            }
                        });

                        if (currentNode.parentId && updatedNodes[currentNode.parentId]) {
                            updatedNodes[currentNode.parentId].isHighlighted = true;
                            const parentConnection = updatedNodes[currentNode.parentId].connections.find(conn => conn.to === currentNodeId);
                            if (parentConnection) {
                                updatedNodes[currentNode.parentId].highlightConnections.push(parentConnection);
                            }
                        }
                    }
                };

                highlightConnectionsRecursively(node.id);
            }

            return updatedNodes;
        });
    }


    const connectionIsInGraduateProfile = (from, to, profileConnections) => {
        const loop = (connections, parentId = null) => {
            for (let connection of connections) {
                const currentFrom = parentId;
                const currentTo = parseInt(connection.id);

                if (currentFrom === from && currentTo === to) {
                    return true;
                }

                if (connection.connections && connection.connections.length > 0) {
                    if (loop(connection.connections, currentTo)) {
                        return true;
                    }
                }
            }
            return false;
        };

        return loop(profileConnections.connections);
    };


    return (
        <SemesterContext.Provider value={{nodes, setNodes, graduateProfiles, setGraduateProfiles, selectedGraduateProfile, setSelectedGraduateProfile, handleAddNode, handleEditGraduateProfile, handleHighlightPathConnections, handleHighlightConnectionsOfNode, connectionIsInGraduateProfile}}>
            {children}
        </SemesterContext.Provider>
    )
}

export default SemesterProvider;

