'use client'
import React, {useEffect} from 'react'
import Clusters from "@/components/v2/studyYear/clusters";

const StudyYear = ({fromYear, toYear, firstClusters, secondClusters, selectedGraduateProfile, studyYears}) => {
    const [isLocked, setIsLocked] = React.useState(false);
    const [firstCluster, setFirstCluster] = React.useState(null);
    const [lastCluster, setLastCluster] = React.useState(null);

    useEffect(() => {
        setFirstCluster(null);
        setLastCluster(null);
    }, [selectedGraduateProfile]);

    useEffect(() => {
        if(firstClusters && secondClusters && firstClusters.length > 0 && secondClusters.length > 0) {
            const first = firstClusters.every(cluster => cluster.locked);
            const second = secondClusters.every(cluster => cluster.locked);
            setIsLocked(first && second);
        }
    }, [firstClusters, secondClusters]);

    const formatYear = (year) => {
        return "'" + year.toString().substring(2);
    }

    const handleColor = () => {
        if(selectedGraduateProfile) {
            // check if color neeeds to be white or black based on the background color
            const newColor = selectedGraduateProfile.color.replace("#", "");
            const r = parseInt(newColor.substring(0, 2), 16);
            const g = parseInt(newColor.substring(2, 4), 16);
            const b = parseInt(newColor.substring(4, 6), 16);
            const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
            return brightness > 125 ? "#000" : "#fff";
        } else {
            return "#fff";
        }
    }

    return (
        <div className={"relative last:mb-[50px] first:mt-0 mt-[-5px] min-w-full flex justify-between gap-[75px] align-middle items-center flex-col"}>
            <div
                style={{background: selectedGraduateProfile ? selectedGraduateProfile.color : "#124477"}}
                className={"absolute transition ease-in-out duration-300 w-[10px] h-full rounded-full"}/>
            <div
                style={{background: selectedGraduateProfile ? selectedGraduateProfile.color : "#124477"}}
                className={"relative transition ease-in-out duration-300 top-0 left-0 min-w-[75px] min-h-[75px] rounded-full flex justify-center align-middle items-center"}>
                <h1
                    style={{color: handleColor()}}
                    className={"text-l transition ease-in-out duration-300 font-bold"}>{formatYear(fromYear)}/{formatYear(toYear)}</h1>
            </div>

            {/* Clusters */}
            <div
                className={"relative w-full md:w-auto pt-[25px] pb-[25px] p-[10px] box-border h-auto rounded-[12px] bg-[#D9D9D9] flex flex-col justify-center align-middle items-center gap-[25px]"}>
                {isLocked && (
                    <div
                        className={"absolute top-[-25px] p-[12.5px] box-border w-[50px] h-[50px] bg-[#d9d9d9] rounded-full flex justify-center align-middle items-center"}>
                        <svg className={"w-full h-full"} viewBox="0 0 16 21" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2 21C1.45 21 0.979333 20.8043 0.588 20.413C0.196666 20.0217 0.000666667 19.5507 0 19V9C0 8.45 0.196 7.97933 0.588 7.588C0.98 7.19667 1.45067 7.00067 2 7H3V5C3 3.61667 3.48767 2.43767 4.463 1.463C5.43833 0.488334 6.61733 0.000667349 8 6.82593e-07C9.38267 -0.000665984 10.562 0.487001 11.538 1.463C12.514 2.439 13.0013 3.618 13 5V7H14C14.55 7 15.021 7.196 15.413 7.588C15.805 7.98 16.0007 8.45067 16 9V19C16 19.55 15.8043 20.021 15.413 20.413C15.0217 20.805 14.5507 21.0007 14 21H2ZM8 16C8.55 16 9.021 15.8043 9.413 15.413C9.805 15.0217 10.0007 14.5507 10 14C9.99933 13.4493 9.80367 12.9787 9.413 12.588C9.02233 12.1973 8.55133 12.0013 8 12C7.44867 11.9987 6.978 12.1947 6.588 12.588C6.198 12.9813 6.002 13.452 6 14C5.998 14.548 6.194 15.019 6.588 15.413C6.982 15.807 7.45267 16.0027 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"
                                fill="black"/>
                        </svg>
                    </div>
                )}

                {/* First Cluster */}
                <Clusters clusters={firstClusters} currentCluster={firstCluster} setCurrentCluster={setFirstCluster} handleColor={handleColor} selectedGraduateProfile={selectedGraduateProfile} />

                {/* Last Cluster */}
                <Clusters clusters={secondClusters} currentCluster={lastCluster} setCurrentCluster={setLastCluster} handleColor={handleColor} selectedGraduateProfile={selectedGraduateProfile} />
            </div>

            {studyYears[studyYears.length - 1].toYear === toYear ? (
                <div className={"relative w-full flex flex-col justify-center align-middle items-center gap-[15px]"}>
                    <div
                        style={{background: selectedGraduateProfile ? selectedGraduateProfile.color : "#124477"}}
                        className={"relative max-w-[75px] max-h-[75px] p-[10px] box-border min-w-[75px] min-h-[75px] rounded-full flex justify-center align-middle items-center"}>
                        <svg className={"w-full h-full "} viewBox="0 0 50 38" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                className={"transition ease-in-out duration-300"}
                                fill={handleColor()}
                                d="M25 0.392578L0 10.3047L25 23.5205L36.9072 17.2259L25.7369 13.6152C25.5068 13.7317 25.2551 13.7926 25 13.7932C24.5456 13.7932 24.11 13.6024 23.7887 13.2628C23.4676 12.9231 23.2871 12.4625 23.2871 11.9822C23.2871 11.5018 23.4676 11.0412 23.7887 10.7016C24.11 10.3619 24.5456 10.1711 25 10.1711L24.7167 11.1448L26.7013 11.7903L26.7022 11.7966L29.6307 12.7435L46.3049 18.1675V19.5423C46.0743 19.7082 45.8855 19.9311 45.7549 20.1916C45.6242 20.4522 45.5558 20.7427 45.5555 21.0375C45.5558 21.3392 45.6274 21.636 45.7637 21.901C45.9001 22.166 46.0969 22.3908 46.3363 22.5549C45.5566 25.6705 45.5555 32.7394 45.5555 35.5258C47.2685 36.7024 47.2685 36.7454 48.9814 35.5258C48.9814 32.7397 48.9806 25.6722 48.201 22.556C48.4405 22.3916 48.6372 22.1667 48.7735 21.9015C48.9099 21.6363 48.9813 21.3393 48.9814 21.0374C48.9814 20.7422 48.9131 20.4514 48.7825 20.1905C48.6519 19.9295 48.4628 19.7063 48.232 19.5402V16.6629L41.8808 14.5969L50 10.3047L25 0.392578ZM10.3995 18.434L8.99453 27.3466C11.7968 27.7341 15.149 29.4562 18.2306 31.4925C19.9832 32.6506 21.6247 33.9219 22.9579 35.1553C23.7729 35.9092 24.4543 36.6325 25 37.3441C25.5457 36.6323 26.2271 35.9092 27.0421 35.1553C28.3753 33.9219 30.0167 32.6506 31.7694 31.4925C34.851 29.4562 38.2032 27.7341 41.0055 27.3466L39.6003 18.434H38.9312L25 25.7985L11.0686 18.434H10.3995Z"
                            />
                        </svg>
                    </div>
                    <p className={"absolute w-full text-center bottom-[-50px]"}>Verwacht af te studeren tot <b>{selectedGraduateProfile?.name}</b></p>
                </div>
            ) : <p></p>}
        </div>
    )
}

export default StudyYear;