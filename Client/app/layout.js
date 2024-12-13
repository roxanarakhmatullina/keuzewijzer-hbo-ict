import "./globals.css";
import StudyYearProvider from "@/providers/StudyYearProvider";
import GraduateProfileProvider from "@/providers/GraduateProfileProvider";
import ErrorProvider from "@/providers/ErrorProvider";
import Script from "next/script";

export const metadata = {
  title: "HBO-ICT Keuzewijzer - De Keuzewijzer van Windesheim",
  description: "De HBO-ICT Keuzewijzer helpt studenten van Windesheim bij het kiezen van een afstudeerprofiel binnen de opleiding HBO-ICT. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="canonical" href="https://keuzewijzerhboict.nl/"/>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
      <link rel="shortcut icon" href="/favicons/favicon.ico"/>
      <meta name="theme-color" content="#ffffff"/>
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y0CQ5ZCT5F"
          strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Y0CQ5ZCT5F');
        `}
      </Script>
    </head>
    <body className={"relative w-screen overflow-x-hidden gap-0"}>
    <ErrorProvider>
      <StudyYearProvider>
        <GraduateProfileProvider>
          {children}
        </GraduateProfileProvider>
      </StudyYearProvider>
    </ErrorProvider>
    </body>
    </html>
  );
}
