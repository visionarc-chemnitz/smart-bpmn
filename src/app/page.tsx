'use client'

import { LandingPageComponent } from "@/components/pages/landing-page";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder with the same structure to prevent layout shift
        return (
            <main className="w-full min-h-screen bg-white dark:bg-gray-900">
                <div aria-hidden="true" />
            </main>
        );
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="w-full min-h-screen">
                <LandingPageComponent />
            </main>
        </ThemeProvider>
    );
}
