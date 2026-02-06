import type { Metadata } from "next";
import "./globals.css";
import FloatingHearts from "@/components/FloatingHearts";

export const metadata: Metadata = {
    title: "Memories",
    description: "Our shared moments together",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased relative min-h-screen">
                <FloatingHearts />
                <div className="relative z-10">
                    {children}
                </div>
            </body>
        </html>
    );
}
