import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-white/40 hover:text-brand-neon transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-4xl uppercase tracking-[0.1em] font-bold text-black dark:text-white leading-tight transition-colors"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-base-regular text-black/60 dark:text-white/60 whitespace-pre-line leading-relaxed tracking-wide transition-colors"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
