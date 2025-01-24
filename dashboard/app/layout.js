import './globals.css';
import AuthProvider from "@/Providers/AuthProvider";
import PageProvider from "@/Providers/PageProvider";
import AlertProvider from "@/Providers/AlertProvider";
import Loading from "@/components/loading";

export const metadata = {
  title: "Keuzewijzer HBO-ICT | Dashboard",
  description: "Dashboard va de Keuzewijzer HBO-ICT",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" className={"h-full w-full"}>
      <body className={"bg-[#f3f3f3] relative w-screen overflow-x-hidden gap-0"}>
      <AlertProvider>
          <AuthProvider>
              <PageProvider>
                  <Loading/>
                  {children}
              </PageProvider>
          </AuthProvider>
      </AlertProvider>
      </body>
      </html>
  );
}
