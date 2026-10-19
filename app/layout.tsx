import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'FounderDesk | Follow-through, made visible', description: 'A focused operating tool for tracking commitments, follow-ups and commercial workflows.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
