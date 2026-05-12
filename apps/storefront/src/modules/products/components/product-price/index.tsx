import { clx } from "@modules/common/components/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-black dark:text-white transition-colors">
      <span
        className={clx("text-3xl font-bold tracking-tighter", {
          "text-brand-neon": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && <span className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mr-2">From</span>}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <div className="flex items-center gap-x-2 text-xs uppercase tracking-widest">
          <span className="text-black/40 dark:text-white/40 transition-colors">Was</span>
          <span
            className="line-through text-black/40 dark:text-white/40 transition-colors"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="text-brand-neon font-bold">
            -{selectedPrice.percentage_diff}%
          </span>
        </div>
      )}
    </div>
  )
}
