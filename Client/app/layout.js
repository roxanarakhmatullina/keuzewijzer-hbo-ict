import "./globals.css";
import StudyYearProvider from "@/providers/StudyYearProvider";
import GraduateProfileProvider from "@/providers/GraduateProfileProvider";
import ErrorProvider from "@/providers/ErrorProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAnalyticsProvider from "@/providers/GoogleAnalyticsProvider";

export const metadata = {
  title: "HBO-ICT Keuzewijzer - De Keuzewijzer van Windesheim",
  description: "De HBO-ICT Keuzewijzer helpt studenten van Windesheim bij het kiezen van een afstudeerprofiel binnen de opleiding HBO-ICT. ",
  manifest: "/manifest.json",
  robots: "/robots.txt",
  icons: {
      icon: [
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicons/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicons/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicons/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/favicons/android-chrome-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/favicons/android-chrome-512x512.png" },
      ],
  },
  keywords: [
      "hbo-ict", "windesheim", "keuzewijzer", "afstudeerprofiel", "ict", "informatica"
  ],
  canonicalUrl: "https://keuzewijzerhboict.nl/",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className={"relative w-screen overflow-x-hidden gap-0"}>
    <head>
        <meta name="google-site-verification" content="2mp2mLZAJi0O8uQKsjHjg7fkNvj-aoYQTawkNqXWQ3U"/>
    </head>
    <GoogleAnalyticsProvider>
        <ErrorProvider>
            <StudyYearProvider>
                <GraduateProfileProvider>
            {children}
          </GraduateProfileProvider>
        </StudyYearProvider>
      </ErrorProvider>
      <GoogleAnalytics id={"G-Y0CQ5ZCT5F"}/>
    </GoogleAnalyticsProvider>
    </body>
    </html>
  );
}
