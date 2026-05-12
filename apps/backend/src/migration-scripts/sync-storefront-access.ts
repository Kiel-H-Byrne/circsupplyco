import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils";
import {
  linkSalesChannelsToApiKeyWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function sync_storefront_access({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Starting storefront access synchronization...");

  // 1. Get all Sales Channels
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });

  const scIds = salesChannels.map(sc => sc.id);
  logger.info(`Found ${scIds.length} sales channels.`);

  // 2. Get all Publishable API Keys
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "type"],
  });

  const publishableKeys = apiKeys.filter(k => k.type === "publishable");
  logger.info(`Found ${publishableKeys.length} publishable API keys.`);

  // 3. Link each Publishable Key to ALL Sales Channels
  for (const key of publishableKeys) {
    logger.info(`Linking API Key: ${key.title} (${key.id}) to all sales channels...`);
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: key.id,
        add: scIds,
      },
    });
  }

  // 4. Get all Products
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  });

  logger.info(`Found ${products.length} products.`);

  // 5. Link each Product to ALL Sales Channels
  // In Medusa v2, we update the product's sales_channels field
  if (products.length > 0) {
    const productUpdates = products.map(p => ({
      id: p.id,
      sales_channels: scIds.map(id => ({ id })),
    }));

    logger.info("Linking all products to all sales channels...");
    await updateProductsWorkflow(container).run({
      input: {
        products: productUpdates as any,
      },
    });
  }

  logger.info("Synchronization complete. All products and API keys are now linked to all sales channels.");
}
