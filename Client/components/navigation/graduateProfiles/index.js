'use client';
import React, { useEffect, useState } from 'react';
import { useGraduateProfile, useStudyYear, useLocation } from "@/hooks";
import GraduateProfile from "@/components/navigation/graduateProfiles/graduateProfile";
import SkeletonLoader from "@/components/loaders/skeletonLoader";
import { api } from "@/hooks/api";

const GraduateProfiles = ({ setNavbarOpen }) => {
  const { selectedGraduateProfile, setGraduateProfiles } = useGraduateProfile();
  const { location } = useLocation();
  const { startedStudyYear } = useStudyYear();

  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [otherProfiles, setOtherProfiles] = useState([]);

  useEffect(() => {
    const fetchGraduateProfiles = async () => {
      try {
        const response = await api.get(`/Cohort/${startedStudyYear?.id}/graduateProfiles`);
        const allProfiles = response.data || [];

        setGraduateProfiles(allProfiles); // global state

        const loc = location?.name?.toLowerCase();

        const isAvailable = (profile) =>
          (loc === 'almere' && profile.almere) || (loc === 'zwolle' && profile.zwolle);

        setAvailableProfiles(allProfiles.filter(isAvailable));
        setOtherProfiles(allProfiles.filter(profile => !isAvailable(profile)));

      } catch (error) {
        console.error("Error fetching graduate profiles:", error);
      }
    };

    if (startedStudyYear?.id) {
      fetchGraduateProfiles();
    }
  }, [location, startedStudyYear?.id]);

  if (!availableProfiles.length && !otherProfiles.length) {
    return <SkeletonLoader />;
  }

  const otherLabel = location?.name === 'Almere'
    ? 'Alleen beschikbaar in Zwolle'
    : 'Alleen beschikbaar in Almere';

  return (
    <div className="flex w-full md:max-w-[300px] h-auto flex-col gap-[15px] justify-center align-middle items-center">
      <p className={`w-full text-center ${selectedGraduateProfile ? "md:text-left md:text-[13px]" : ""} font-bold`}>
        Afstudeerrichtingen:
      </p>

      <div className="w-full h-auto flex flex-col gap-[10px] box-border justify-center align-middle items-center">
        {/* Available in location */}
        {availableProfiles.map(profile => (
          <GraduateProfile key={`graduate-profile-${profile.id}`} {...profile} />
        ))}

        {/* Divider text */}
        {otherProfiles.length > 0 && (
          <p className="text-[12px] font-semibold text-gray-500 mt-4 mb-1 w-full text-center">
            {otherLabel}
          </p>
        )}

        {/* Not available in location */}
        {otherProfiles.map(profile => (
          <GraduateProfile key={`graduate-profile-${profile.id}`} {...profile} />
        ))}
      </div>

      <button
        onClick={() => setNavbarOpen(false)}
        className={`md:hidden hover:brightness-95 w-full h-[50px] font-bold ${selectedGraduateProfile ? "bg-[#124477] text-white" : "bg-[#e5e5e5] pointer-events-none text-[#c5c5c5]"} rounded-[12px] p-[10px] box-border`}>
        Volgende
      </button>
    </div>
  );
};

export default GraduateProfiles;
