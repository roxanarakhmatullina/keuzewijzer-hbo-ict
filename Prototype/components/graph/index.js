import React, { useState, useEffect, useRef } from 'react';
import Node from "@/components/Node";
import Connection from "@/components/Connection";
import { useSemester } from "@/providers/SemesterProvider";
import RenderConnections from "@/components/graph/RenderConnections";
import { NODE_WIDTH, NODE_HEIGHT } from "@/providers/SemesterProvider";

const Graph = () => {
    const { nodes, connectionIsInGraduateProfile, selectedGraduateProfile } = useSemester();
    const graphRef = useRef(null);
    const [hoveredConnection, setHoveredConnection] = useState(null);
    const [svgWidth, setSvgWidth] = useState(0);
    const [svgHeight, setSvgHeight] = useState(0);
    const [loading, setLoading] = useState(true);

    // Resize SVG based on nodes
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

    // Center the first node once nodes are loaded and svg size is set
    useEffect(() => {
        if (!loading && nodes && Object.keys(nodes).length > 0 && graphRef.current && svgWidth > 0 && svgHeight > 0) {
            const firstNode = Object.values(nodes)[0];
            if (firstNode) {
                const graph = graphRef.current;

                // Use requestAnimationFrame to ensure DOM is fully ready
                requestAnimationFrame(() => {
                    const { width } = graph.getBoundingClientRect();
                    const centerX = firstNode.x - (width / 2) + (NODE_WIDTH / 2); // Center calculation

                    console.log("Graph width:", width);
                    console.log("First node x:", firstNode.x);
                    console.log("Calculated centerX:", centerX);

                    graph.scrollTo({
                        left: centerX,
                    });
                });
            }
        }
    }, [loading, nodes, selectedGraduateProfile, svgWidth, svgHeight]); // Added svgWidth and svgHeight as dependencies

    // Set loading to false when nodes are available
    useEffect(() => {
        if (nodes && Object.keys(nodes).length > 0) {
            setLoading(false);
        }
    }, [nodes]);

    return (
        <div
            id="nodes-container"
            ref={graphRef}
            className="md:pt-0 pt-[75px] w-full h-full overflow-x-auto" // Ensure horizontal scrolling
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
