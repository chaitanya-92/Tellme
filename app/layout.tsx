import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Tellme — The web, spoken.",
 description: "Turn long webpages and discussion threads into natural audio while you work."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}