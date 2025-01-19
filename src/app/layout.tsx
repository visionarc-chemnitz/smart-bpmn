import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VisionArc - Where Vision Meets Innovation",
  description: "VisionArc combines cutting-edge AI technology with intuitive SaaS solutions to transform your data.",
  keywords: ["AI", "SaaS", "Business Intelligence", "BPMN", "Workflow Automation", "Workflow Management"],
  authors: [{ name: "VisionArc Team" }],
  openGraph: {
    title: "VisionArc - Where Vision Meets Innovation",
    description: "VisionArc combines cutting-edge AI technology with intuitive SaaS solutions to transform your data.",
    url: "https://v-arc.vercel.app",
    siteName: "VisionArc",
    images: [
      {
        url: "/assets/img/logo/vision_arc_logo.png",
        width: 1200,
        height: 630,
        alt: "VisionArc Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisionArc - Where Vision Meets Innovation",
    description: "VisionArc combines cutting-edge AI technology with intuitive SaaS solutions to transform your data.",
    images: ["/assets/img/logo/vision_arc_logo.png"],
  },
  manifest: '/assets/img/favicon/site.webmanifest',
  other: {
    'apple-mobile-web-app-title': 'VisionArc'
  },
  icons: {
    icon: [
      { url: '/assets/img/favicon/favicon.ico' },
      { url: '/assets/img/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/img/favicon/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/assets/img/favicon/favicon.ico',
    apple: '/assets/img/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/assets/img/favicon/apple-touch-icon.png',
        sizes: '180x180'
      }
    ],
  },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
        {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
