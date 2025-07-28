import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/store/providers";
import Navbar from "@/components/utility/navbar";
import { AppContextProvider } from "@/context/appContext";
import { Footer } from "@/components/myComponents/subs/footer";
// import {Roboto} from "next/font/google"

// const roboto = Roboto({
//   subsets : ["latin"], style : "normal"
// });

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const metadata: Metadata = {
  title: "Succo",
  description: "Your one stop store for food items",
};

export const SEO_CONFIG = {
  description:'Your one stop store for food items',
  fullName: "Lois Food and Spices",
  name: "Lois Food and Spices",
  slogan: "Lois Food and Spices",
};

export const SYSTEM_CONFIG = {
  redirectAfterSignIn: "/dashboard/uploads",
  redirectAfterSignUp: "/dashboard/uploads",
  // repoName: "relivator",
  // repoOwner: "blefnk",
  // repoStars: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppContextProvider>
        <body
          className={`font-roboto_mono antialiased`}
          // ${geistSans.variable} ${geistMono.variable}
        >
          <Providers>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                {children}
                <Footer />
              </ThemeProvider>
            </Providers>
        </body>
      </AppContextProvider>
    </html>
  );
}
