import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils";
import {
  updateStoresWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function rebrand_store({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Starting store rebranding...");

  // 1. Update Store Name
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name"],
  });

  if (stores.length > 0) {
    logger.info(`Updating store name for: ${stores[0].name}`);
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: stores[0].id },
        update: { name: "Circ Supply Co." },
      },
    });
    logger.info("Store name updated to 'Circ Supply Co.'");
  }

  // 2. Update Products
  logger.info("Updating product branding...");
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle"],
  });

  const productUpdates = products.map((product) => {
    let update = {};
    
    if (product.handle === "t-shirt" || product.title.includes("T-Shirt")) {
      update = {
        title: "SYSTEM Oversized Tee",
        description: "A retro-futuristic staple. Heavyweight cotton with a structured oversized fit, featuring the signature SYSTEM schematic diagram.",
        handle: "system-tee",
      };
    } else if (product.handle === "sweatshirt" || product.title.includes("Sweatshirt")) {
      update = {
        title: "PROTOCOL Heavy Hoodie",
        description: "A masterclass in quiet luxury. 500GSM organic cotton with dropped shoulders and a minimalist high-tech weave.",
        handle: "protocol-hoodie",
      };
    } else if (product.handle === "sweatpants" || product.title.includes("Sweatpants")) {
      update = {
        title: "GRID Cargo Pants",
        description: "Futuristic utility. Multi-pocket design with a tapered technical silhouette and neon-dim accents.",
        handle: "grid-cargos",
      };
    } else if (product.handle === "shorts" || product.title.includes("Shorts")) {
      update = {
        title: "HOLOGRAPHIC Tote",
        description: "The ultimate digital accessory. Iridescent material that shifts with the light, perfect for the modern nomad.",
        handle: "holographic-tote",
      };
    }

    if (Object.keys(update).length > 0) {
      return {
        id: product.id,
        ...update,
      };
    }
    return null;
  }).filter(Boolean);

  if (productUpdates.length > 0) {
    logger.info(`Applying updates to ${productUpdates.length} products...`);
    await updateProductsWorkflow(container).run({
      input: {
        products: productUpdates as any,
      },
    });
    logger.info("Product branding updated.");
  } else {
    logger.info("No matching products found to rebrand.");
  }

  logger.info("Rebranding complete.");
}
