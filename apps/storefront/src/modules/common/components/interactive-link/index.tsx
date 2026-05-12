import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "../localized-client-link"
type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group transition-all duration-300"
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-white/60 group-hover:text-brand-neon uppercase tracking-widest text-xs font-bold transition-colors">
        {children}
      </Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-300 text-white/60 group-hover:text-brand-neon transition-all"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
