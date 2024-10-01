import React, { useState, useEffect, useRef } from 'react';
import Node from "@/components/Node";
import Connection from "@/components/Connection";
import { useSemester } from "@/providers/SemesterProvider";
import RenderConnections from "@/components/graph/renderConnections";
import { NODE_WIDTH, NODE_HEIGHT } from "@/providers/SemesterProvider";

const Graph = () => {
    const { nodes, connectionIsInGraduateProfile, selectedGraduateProfile } = useSemester();
    const graphRef = useRef(null);
    const [hoveredConnection, setHoveredConnection] = useState(null);
    const [svgWidth, setSvgWidth] = useState(0);
    const [svgHeight, setSvgHeight] = useState(0);
    const [loading, setLoading] = useState(true);

    // Resizes the connections when the window is resized
    useEffect(() => {
        if (nodes) {
            const updateSvgSize = () => {
                const maxX = Math.max(...Object.values(nodes).map(node => node.x + NODE_WIDTH));
                const maxY = Math.max(...Object.values(nodes).map(node => node.y + NODE_HEIGHT));
                setSvgWidth(maxX + 100);
                setSvgHeight(maxY + 100);
            };

            updateSvgSize();
            window.addEventListener('resize', updateSvgSize);
            return () => window.removeEventListener('resize', updateSvgSize);
        }
    }, [nodes]);

    useEffect(() => {
        if ((nodes && selectedGraduateProfile) || (nodes && loading)) {
            // Find the first created node
            const firstNode = Object.values(nodes)[0];
            if (firstNode) {
                const graph = graphRef.current;
                const { width } = graph.getBoundingClientRect();
                const centerX = firstNode.x - width / 2 + NODE_WIDTH / 2; // Adjust to center horizontally
                graph.scrollTo(centerX, 0); // Scroll horizontally to the center of the first node
            }
            setLoading(false);
        }
    }, [nodes]);

    return (
        <div
            id="nodes-container"
            ref={graphRef}
            className={"md:pt-0 pt-[75px] w-full h-full overflow-x-auto"} // Ensure horizontal scrolling is possible
        >
            {nodes ? (
                <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
                    <svg className="absolute" width={svgWidth} height={svgHeight} style={{ left: 0, top: 0 }}>
                        <RenderConnections nodes={nodes} setHoveredConnection={setHoveredConnection}
                                           connectionIsInGraduateProfile={connectionIsInGraduateProfile} />
                        {hoveredConnection && (
                            <Connection
                                key={hoveredConnection}
                                from={nodes[hoveredConnection.split('-')[0]]}
                                to={nodes[hoveredConnection.split('-')[1]]}
                                setHoveredConnection={setHoveredConnection}
                            />
                        )}
                    </svg>

                    {Object.values(nodes).map((node) => (
                        <Node
                            key={node.id}
                            node={node}
                            backgroundColor={node.backgroundColor || "#fff"}
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full md:h-[100vh] flex justify-center items-center">
                    <p>Semesters ophalen ...</p>
                </div>
            )}
        </div>
    );
};

export default Graph;
