import "./globals.css";
import ApiProvider from "@/providers/ApiProvider";
import Development from "@/components/development";

export const metadata = {
  title: "HBO-ICT Keuzewijzer - De Keuzewijzer van Windesheim",
  description: "De HBO-ICT Keuzewijzer helpt studenten van Windesheim bij het kiezen van een afstudeerprofiel binnen de opleiding HBO-ICT. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <meta name="viewport" content="width=500, initial-scale=1"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/nieuw/favicons/logo-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/nieuw/favicons/logo-16x16.png"/>
      <link rel="apple-touch-icon" sizes="180x180" href="/nieuw/favicons/logo-180x180.png"/>
      <link rel="shortcut icon" href="/nieuw/favicon.ico"/>
    </head>
    <body className={"relative w-screen overflow-x-hidden gap-0"}>
      <Development message={"Hey dev! Looks like"}/>
      <ApiProvider>
        {children}
      </ApiProvider>
    </body>
    </html>
  );
}
