import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { connection } from "next/server";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const TITLE = "Kampung Batik Jetis Sidoarjo — Wisata Edukasi Batik Tulis";
const DESCRIPTION =
  "Kunjungi Kampung Batik Jetis, Sidoarjo: wisata kampung batik, demo membatik, dan UMKM lokal. Pesan tiket kunjungan Sabtu dan Minggu secara online.";

// Dinamis: SITE_URL adalah env runtime Workers (tidak tersedia saat build).
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const base = siteUrl();
  return {
    metadataBase: new URL(base),
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "/",
      siteName: "Kampung Batik Jetis",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kampung Batik Jetis, Sidoarjo" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${cormorant.variable} ${sourceSans.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
