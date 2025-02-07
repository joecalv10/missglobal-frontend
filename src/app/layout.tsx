import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { DialogProvider } from "@/lib/DialogContext";
import { Providers } from "@/store/providers";
import Layout from "../components/Layout/index";

const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });
const metatitle = "MissGlobal";
const metadescription = `MissGlobal`;
const websiteURL = "https://missglobal-frontend.vercel.app";
const socialImg = `${websiteURL}/social.jpg`;

export const metadata: Metadata = {
  title: metatitle,
  description: metadescription,
  openGraph: {
    type: "website",
    url: websiteURL,
    title: metatitle,
    description: metadescription,
    siteName: metatitle,
    images: [
      {
        url: socialImg,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: metatitle,
    creator: metatitle,
    title: metatitle,
    description: metadescription,
    images: socialImg,
  },
  // manifest: "/manifest.json",
  // icons: {
  //   apple: "/icon.png",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <DialogProvider>
        <html lang="en" className="dark">
          <body className={poppins.className}>
            <Layout>
              <main>{children}</main>
            </Layout>
            <Toaster />
          </body>
        </html>
      </DialogProvider>
    </Providers>
  );
}
