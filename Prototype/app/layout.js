import localFont from "next/font/local";
import "./globals.css";
import SemesterProvider from "@/providers/SemesterProvider";

export const metadata = {
  title: "Nieuwe betere Keuzewijzer",
  description: "Een nieuwe en betere keuzewijzer voor HBO-ICT studenten om route te bepalen naar een afstudeerprofiel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <meta name="viewport" content="width=500, initial-scale=1"/>
    </head>
    <body className={"max-w-[100vw]"}>
    <SemesterProvider>
      {children}
    </SemesterProvider>
    </body>
    </html>
  );
}
