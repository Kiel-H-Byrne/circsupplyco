import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-black relative small:min-h-screen text-white">
      <div className="h-16 bg-black/80 backdrop-blur-md border-b border-white/10">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-xs font-bold text-white/60 flex items-center gap-x-2 uppercase flex-1 basis-0 hover:text-brand-neon transition-colors"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block tracking-widest">
              Back to cart
            </span>
            <span className="mt-px block small:hidden tracking-widest">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="txt-compact-xlarge-plus text-white hover:text-brand-neon uppercase tracking-widest font-bold transition-colors"
            data-testid="store-link"
          >
            Circ Supply Co.
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative bg-black" data-testid="checkout-container">{children}</div>
      <div className="py-12 w-full flex flex-col items-center justify-center gap-y-4 opacity-30">
        <span className="text-[10px] uppercase tracking-[0.2em]">Circ Supply Co. Protocol</span>
      </div>
    </div>
  )
}
