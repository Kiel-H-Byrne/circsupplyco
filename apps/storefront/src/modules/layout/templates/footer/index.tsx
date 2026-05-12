import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { Text, clx } from "@modules/common/components/ui";
import Image from "next/image";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import MedusaCTA from "@modules/layout/components/medusa-cta";

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  });
  const productCategories = await listCategories();

  return (
    <footer className="border-t border-black/5 dark:border-white/10 w-full bg-white dark:bg-black transition-colors duration-300">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
          <div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-3 group/footer-logo"
            >
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover/footer-logo:rotate-12">
                <Image
                  src="/logo.png"
                  alt="Circ Supply Co. Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="txt-compact-xlarge-plus text-black dark:text-white group-hover/footer-logo:text-brand-neon uppercase tracking-widest font-bold transition-colors duration-300">
                Circ Supply Co.
              </span>
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-black dark:text-white uppercase tracking-wider transition-colors">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return;
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null;

                    return (
                      <li
                        className="flex flex-col gap-2 text-black/50 dark:text-white/50 txt-small transition-colors"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-brand-neon transition-colors duration-300",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-brand-neon transition-colors duration-300"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-black dark:text-white uppercase tracking-wider transition-colors">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-black/50 dark:text-white/50 txt-small transition-colors",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-brand-neon transition-colors duration-300"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-black dark:text-white uppercase tracking-wider transition-colors">Social</span>
              <ul className="grid grid-cols-1 gap-y-2 text-black/50 dark:text-white/50 txt-small transition-colors">
                <li>
                  <a
                    href="https://instagram.com/circsupplyco"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-neon transition-colors duration-300"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/circsupplyco"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-neon transition-colors duration-300"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/circsupplyco"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-neon transition-colors duration-300"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-black/40 dark:text-white/40 transition-colors">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Circ Supply Co. All rights reserved.
          </Text>
          <div className="flex items-center gap-x-4">
            <span className="text-[10px] uppercase tracking-[0.2em]">Powered by Medusa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
