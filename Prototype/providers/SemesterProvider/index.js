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
    const [selectedSemester, setSelectedSemester] = useState(null);

    useEffect(() => {
        fetchData("/semesters.json").then(data => {
            setNodes(data);
        });

        fetchData("/graduate-profiles.json").then(data => {
            setGraduateProfiles(data);
        });
    }, []);

    const fetchData = async (api) => {
        if(api) {
            try {
                const response = await fetch(api);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                return jsonData;
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        } else {
            console.error('No API provided');
        }
    }

    useEffect(() => {
        if(selectedSemester) handleHighlightPathConnections(selectedSemester);
        if(selectedGraduateProfile) handleHighlightPathConnections(selectedGraduateProfile);
        if(!selectedGraduateProfile && !selectedSemester) handleHighlightPathConnections(null);
    }, [selectedSemester, selectedGraduateProfile]);

    const handleHighlightPathConnections = (selectedItem) => {
        setNodes(prevNodes => {
            const updatedNodes = { ...prevNodes };

            // Reset highlighting for all nodes and connections
            Object.values(updatedNodes).forEach(node => {
                node.isHighlighted = false; // Ensure nodes are not highlighted
                node.highlightConnections = []; // Reset highlighted connections
            });

            if (selectedItem) {
                const highlightConnectionsRecursively = (currentId) => {
                    const currentNode = updatedNodes[currentId];

                    if (currentNode) {
                        currentNode.isHighlighted = true; // Highlight current node

                        // Highlight connections leading to this node
                        currentNode.connections.forEach(connection => {
                            const targetNodeId = connection.to;

                            if (updatedNodes[targetNodeId]) {
                                updatedNodes[targetNodeId].isHighlighted = true; // Highlight target node
                                updatedNodes[targetNodeId].highlightConnections.push(connection); // Store highlighted connection

                                connection.isHighlighted = true; // Highlight the connection itself

                                // Recursively highlight connections for the target node
                                highlightConnectionsRecursively(targetNodeId);
                            }
                        });

                        // Highlight parent connections if any
                        if (currentNode.parentId && updatedNodes[currentNode.parentId]) {
                            updatedNodes[currentNode.parentId].isHighlighted = true; // Highlight parent node
                            const parentConnection = updatedNodes[currentNode.parentId].connections.find(conn => conn.to === currentId);
                            if (parentConnection) {
                                updatedNodes[currentNode.parentId].highlightConnections.push(parentConnection); // Store highlighted connection
                                parentConnection.isHighlighted = true; // Highlight the parent connection itself
                            }
                        }
                    }
                };

                // Start highlighting connections from the selected node or profile
                highlightConnectionsRecursively(selectedItem.id || selectedItem); // Use ID for graduate profiles or node ID for semesters
            }

            return updatedNodes;
        });
    };

    const handleHighlightConnectionsOfNode = (node) => {
        // Similar to the above function but focuses only on the node's connections
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
    };

    const connectionIsInGraduateProfile = (from, to, profileConnections) => {
        if (!profileConnections || !profileConnections.connections) {
            return false; // Early return if profileConnections is null or does not have connections
        }

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
        <SemesterContext.Provider value={{nodes, selectedSemester, setSelectedSemester, setNodes, graduateProfiles, setGraduateProfiles, selectedGraduateProfile, setSelectedGraduateProfile, handleHighlightPathConnections, handleHighlightConnectionsOfNode, connectionIsInGraduateProfile}}>
            {children}
        </SemesterContext.Provider>
    )
}

export default SemesterProvider;
