import {useContext} from "react";

// Context providers
import {GraduateProfileContext} from "@/providers/GraduateProfileProvider";
import {StudyYearContext} from "@/providers/StudyYearProvider";
import {ErrorContext} from "@/providers/ErrorProvider";

// return hooks
export const useGraduateProfile = () => {
    return useContext(GraduateProfileContext);
}

export const useStudyYear = () => {
    return useContext(StudyYearContext);
}

export const useError = () => {
    return useContext(ErrorContext);
}
