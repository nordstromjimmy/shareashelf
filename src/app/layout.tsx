import { Toaster } from "react-hot-toast";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TopShelfy - Your Digital Shelf",
  description:
    "Create a stunning digital liqour shelf, add tasting notes, and share with friends in minutes.",
  keywords: [
    "whiskey collection",
    "whiskey shelf",
    "digital shelf",
    "liqour shelf",
    "top shelf",
    "share whiskey collection",
    "whiskey tasting notes",
  ],
  openGraph: {
    title: "TopShelfy - Your Digital Liqour Shelf",
    description: "Show off your whiskey bottles and tasting notes online.",
    url: "https://topshelfy.com",
    siteName: "TopShelfy",
    images: [
      {
        url: "https://topshelfy.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "TopShelfy - Your Whiskey Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@topshelfy",
    title: "TopShelfy - Your Digital Whiskey Shelf",
    description:
      "Create a beautiful whiskey shelf online, add your bottles, and share it with friends.",
    image: "https://topshelfy.com/og-image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          defer
          data-domain="topshelfy.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body>
        {children}
        <Toaster position="bottom-center" />
        <Footer />
      </body>
    </html>
  );
}
