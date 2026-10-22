import "./globals.css";
import { Michroma, Outfit } from "next/font/google";

const display = Michroma({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Outfit({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Knowza – Ask anything, get the answer",
  description: "Knowza is a general knowledge answering app powered by an RNN trained on thousands of questions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
