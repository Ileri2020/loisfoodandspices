import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/store/providers";
import Navbar from "@/components/utility/navbar";
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

export const metadata: Metadata = {
  title: "Succo",
  description: "Your one stop restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
            </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}
