'use client'

import Header from "@/components/sections/Header";
import { LandingPageComponent } from "../components/pages/landing-page";
import Footer from "@/components/sections/Footer";

export default function Home() {
   
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <LandingPageComponent />
        </main>
        <Footer />
      </div>          
    );
}
