import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>TopShelfy</title>
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
      </body>
    </html>
  );
}
