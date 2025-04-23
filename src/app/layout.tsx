import "./globals.css";
import type { Metadata } from "next";
import { SupabaseAuthProvider } from "@/lib/contexts/SupabaseAuthContext";

export const metadata: Metadata = {
  title: "Business Analytics Dashboard",
  description: "Real-time data analytics dashboard for businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
