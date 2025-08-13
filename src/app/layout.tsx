import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SuppliersProvider } from "@/contexts/SuppliersContext";
import { PaymentRequestsProvider } from "@/contexts/PaymentRequestsContext";
import { InvoicesProvider } from "@/contexts/InvoicesContext";
import { PaymentsProvider } from "@/contexts/PaymentsContext";
import { ReportsProvider } from "@/contexts/ReportsContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinControl - Sistema de Controle de Custos",
  description: "Sistema de controle financeiro para o Instituto Superior Politécnico do Bie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <SuppliersProvider>
              <PaymentRequestsProvider>
                <InvoicesProvider>
                  <PaymentsProvider>
                    <ReportsProvider>
                      {children}
                      <Toaster position="top-right" richColors />
                    </ReportsProvider>
                  </PaymentsProvider>
                </InvoicesProvider>
              </PaymentRequestsProvider>
            </SuppliersProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
