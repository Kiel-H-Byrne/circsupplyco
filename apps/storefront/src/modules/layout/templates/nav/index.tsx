import { Suspense } from "react"
import Image from "next/image"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { ThemeToggle } from "@modules/layout/components/theme-toggle"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white/80 dark:bg-black/80 backdrop-blur-md border-black/5 dark:border-white/10">
        <nav className="content-container txt-xsmall-plus text-black/70 dark:text-white/70 flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-2 group/logo"
              data-testid="nav-store-link"
            >
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover/logo:scale-110">
                <Image
                  src="/logo.png"
                  alt="Circ Supply Co. Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="txt-compact-xlarge-plus text-black dark:text-white group-hover/logo:text-brand-neon uppercase tracking-[0.2em] font-bold transition-colors duration-300">
                Circ Supply Co.
              </span>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <ThemeToggle />
              <LocalizedClientLink
                className="hover:text-brand-neon transition-colors duration-300 text-black dark:text-white"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-brand-neon flex gap-2 transition-colors duration-300 text-black dark:text-white"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
