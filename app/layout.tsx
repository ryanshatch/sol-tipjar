import type { Metadata, Viewport } from "next";
import { SolanaProvider } from "@/components/SolanaProvider";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_TITLE} — Tip with SOL`,
  description: APP_DESCRIPTION,
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: `${APP_TITLE} — Tip with SOL`,
    description: APP_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${APP_TITLE} — Tip with SOL`,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08080b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
