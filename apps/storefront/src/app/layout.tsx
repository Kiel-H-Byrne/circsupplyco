import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { ThemeProvider } from "@lib/context/theme-provider"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black text-black dark:text-white antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <main className="relative bg-grid-black dark:bg-grid-white min-h-screen">
            {props.children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
