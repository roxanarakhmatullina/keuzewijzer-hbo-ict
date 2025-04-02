import {useContext} from "react";

// Context providers
import {GraduateProfileContext} from "@/providers/GraduateProfileProvider";
import {StudyYearContext} from "@/providers/StudyYearProvider";
import {LocationContext} from "@/providers/LocationProvider";
import {ErrorContext} from "@/providers/ErrorProvider";
import {GoogleAnalyticsContext} from "@/providers/GoogleAnalyticsProvider";

// return hooks
export const useGraduateProfile = () => {
    return useContext(GraduateProfileContext);
}

export const useStudyYear = () => {
    return useContext(StudyYearContext);
}

export const useLocation = () => {
    return useContext(LocationContext);
}

export const useError = () => {
    return useContext(ErrorContext);
}

export const useGoogleAnalytics = () => {
    return useContext(GoogleAnalyticsContext);
}