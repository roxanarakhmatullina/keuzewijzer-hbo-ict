import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useSemester } from "@/providers/SemesterProvider";
import Popup from "@/components/navigation/popup";
import { NODE_WIDTH, NODE_HEIGHT } from "@/providers/SemesterProvider";

const Node = ({ node, backgroundColor }) => {
    const { id, name } = node;
    const position = { x: node.x, y: node.y };
    const { handleHighlightConnectionsOfNode, setSelectedGraduateProfile } = useSemester();
    const [toggleInfo, setToggleInfo] = useState(false);

    const handleClick = () => {
        setSelectedGraduateProfile(null);
        handleHighlightConnectionsOfNode(node);
    };

    const handleLink = () => {
        window.open(node.link, '_blank');
    }

    const hasLink = !!node.link;

    return (
        <>
            <div

                style={{ backgroundColor, width: NODE_WIDTH, height: NODE_HEIGHT, left: position.x, top: position.y }}
                className="absolute cursor-pointer rounded-[12px] flex items-center justify-center border border-gray-400"
                id={id}
                onClick={() => handleClick()}
            >
                <span
                    className="text-[12px] text-center text-black">{name}</span>
                <span
                    onMouseOver={() => setToggleInfo(true)}
                    onMouseOut={() => setToggleInfo(false)}
                    onClick={() => hasLink && handleLink()}
                    className={`absolute right-[5px] text-[14px] font-black text-black flex justify-center align-middle items-center top-[5px] rounded-full w-[25px] h-[25px] ${hasLink ? "bg-blue-100" : "bg-[#e5e5e5]"}`}>
                    <>
                        i
                        <div
                            style={{bottom: "calc(100% + 10px)"}}
                            className={`w-[150px] left-1/2 -translate-x-1/2 ease-in-out transition-all p-[10px] bg-[#151515] justify-center align-middle items-center rounded-[8px] text-white text-[12px] absolute right-[0px] ${toggleInfo ? "flex opacity-100" : "hidden opacity-0"}`}>
                            <p className={"text-center"}>{hasLink ? "Klik voor meer informatie" : "Op dit moment niet beschikbaar"}</p>
                            <div className="absolute rotate-180 bottom-[-20px] w-[0] h-[0] border-[10px] border-solid border-t-[10px] border-l-[10px] border-r-[10px] border-[transparent] border-b-[#111]"></div>
                        </div>
                    </>
                </span>
            </div>
        </>
    );
};

export default Node;
