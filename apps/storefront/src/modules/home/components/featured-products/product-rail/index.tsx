import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-32">
      <div className="flex items-end justify-between mb-12 border-b border-black/5 dark:border-white/5 pb-6">
        <div className="flex flex-col gap-y-2">
          <Text className="text-black dark:text-white text-3xl uppercase tracking-[0.2em] font-bold">
            {collection.title}
          </Text>
          <div className="w-12 h-[2px] bg-brand-neon"></div>
        </div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          Explore All
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-8 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id} className="holographic p-1">
              <div className="bg-white dark:bg-black p-4 transition-colors duration-300">
                <ProductPreview product={product} region={region} isFeatured />
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
