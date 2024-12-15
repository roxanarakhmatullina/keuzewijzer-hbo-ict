'use client'
import React, { useState, useEffect } from 'react';
import Script from "next/script";
import CheckBox from "@/icons/checkbox";
import {useGoogleAnalytics} from "@/hooks";
const GoogleAnalytics = ({ id }) => {

    const {showModal, setShowModal} = useGoogleAnalytics()
    const [consent, setConsent] = useState({
        necessary: true,
        statistics: false,
    });

    useEffect(() => {
        const storedConsent = JSON.parse(localStorage.getItem('ga-consent-keuzewijzerhboict'));
        const now = new Date();

        if (storedConsent) {
            const acceptDate = new Date(storedConsent.date);
            const fourteenDaysLater = new Date(acceptDate);
            fourteenDaysLater.setDate(fourteenDaysLater.getDate() + 14);

            if (now > fourteenDaysLater) {
                // Consent expired
                setShowModal(true);
            } else {
                // Consent still valid
                setConsent(storedConsent.consent);
            }
        } else {
            // No consent stored
            setShowModal(true);
        }
    }, []);

    const handleCheckboxChange = (category) => {
        setConsent((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const savePreferences = () => {
        const consentData = {
            consent,
            date: new Date().toISOString(),
        };
        localStorage.setItem('ga-consent-keuzewijzerhboict', JSON.stringify(consentData));
        setShowModal(false);
    };

    const acceptAll = () => {
        const allConsent = {
            necessary: true,
            statistics: true,
        };
        const consentData = {
            consent: allConsent,
            date: new Date().toISOString(),
        };
        setConsent(allConsent);
        localStorage.setItem('ga-consent-keuzewijzerhboict', JSON.stringify(consentData));
        setShowModal(false);
    };

    if(process.env.NODE_ENV !== 'production') return null;

    return (
        <>
            {consent.statistics && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${id}');
                        `}
                    </Script>
                </>
            )}
            {showModal && (
                <div
                    className={"fixed bg-[rgba(0,0,0,0.5)] z-[3000] left-0 top-0 w-screen h-screen flex justify-center align-middle items-center flex-col gap-[10px] p-[10px] box-border"}>
                    <div
                        className={"w-full md:max-w-[500px] h-auto bg-[#fff] border-[1px] borer-[#f3f3f3] p-[20px] rounded-[20px] box-border flex flex-col gap-[20px] items-start shadow-lg"}>
                        <h1 className={"text-[18px] font-bold"}>Cookie voorkeuren</h1>
                        <div
                            className={"w-full h-auto flex flex-col gap-[10px] justify-start align-middle items-start"}>
                            <div
                                className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-auto flex flex-row gap-[10px] justify-start align-middle items-center"}>
                                <CheckBox disabled={true} state={consent.necessary} />

                                <div
                                    className={"w-full h-auto flex flex-col gap-[0px] justify-start align-middle items-start"}>
                                    <h1 className={"text-[16px] font-bold"}>Noodzakelijk</h1>
                                    <p className={"text-[14px]"}>Noodzakelijke cookies helpen de website bruikbaar te
                                        maken door basisfuncties zoals navigatie in te schakelen. De website kan niet goed
                                        functioneren zonder deze cookies.</p>
                                </div>
                            </div>

                            <div
                                className={"w-full bg-[#f3f3f3] rounded-[12px] p-[10px] box-border h-auto flex flex-row gap-[10px] justify-start align-middle items-center"}>
                                <CheckBox disabled={false} state={consent.statistics}
                                          onClick={() => handleCheckboxChange('statistics')} />
                                <div
                                    className={"w-full h-auto flex flex-col gap-[0px] justify-start align-middle items-start"}>
                                    <h1 className={"text-[16px] font-bold"}>Statistieken</h1>
                                    <p className={"text-[14px]"}>Statistische cookies helpen ons om de website te
                                        verbeteren door anonieme gegevens te verzamelen en te rapporteren.</p>
                                </div>
                            </div>
                        </div>
                        <p className={"text-[14px]"}>Je kunt je voorkeuren op elk moment aanpassen door onderaan op
                            cookiebeleid te klikken.</p>
                        <div
                            className={"w-full box-border h-auto flex md:flex-row flex-col gap-[10px] justify-start align-middle items-center"}>
                            <button
                                onClick={savePreferences}
                                className={"w-full h-[50px] md:h-[40px] font-bold bg-[#d0e2f5] text-[#124477] text-[14px]  rounded-[10px] p-[10px] box-border cursor-pointer flex justify-center align-middle items-center"}>
                                Opslaan
                            </button>
                            <button
                                onClick={acceptAll}
                                className={"w-full h-[50px] md:h-[40px] font-bold bg-[#124477] text-[14px] text-white rounded-[10px] p-[10px] box-border cursor-pointer flex justify-center align-middle items-center"}>
                                Accepteren
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GoogleAnalytics;