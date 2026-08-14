import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/context/cartcontext";
import GlobalProvider from "@/app/context/GlobalProvider";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import ChatWidget from "@/app/components/Chatwidget";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL
  ? new URL(process.env.NEXT_PUBLIC_APP_URL)
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "PhoneStore | Phones & Accessories",
    template: "%s | PhoneStore",
  },
  description:
    "Browse phones, headphones and charging essentials with a fast, responsive shopping experience.",
  applicationName: "PhoneStore",
  keywords: ["phones", "smartphones", "headphones", "chargers", "phone accessories"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "PhoneStore",
    description: "Phones and essential accessories in one focused storefront.",
    siteName: "PhoneStore",
  },
  verification: {
    google: "Me14Gm6Mis4mXmiFyCTepFUrXCYMt58ziZt8MCpOjC4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <GlobalProvider>
          <CartProvider>
            <SiteHeader />
            <main id="main-content" className="min-h-[70vh]">
              {children}
            </main>
            <SiteFooter />
            <ChatWidget />
          </CartProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
