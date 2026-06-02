import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "WILLIAMS MOBILHOME | Maisons Mobiles de Luxe",
  description:
    "Découvrez l'excellence de l'habitat mobile. Des maisons haut de gamme, intelligentes et élégantes.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning style={{ fontSize: "14px" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}
