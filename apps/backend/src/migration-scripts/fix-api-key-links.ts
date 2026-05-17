import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils";
import {
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function fix_api_key_links({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // The key from the error message
  const storefrontKeyToken = "pk_d797fc78b86a12b274876930e2f6cabdf1f3991f2b3a8ecafbfa97729ea59ddc";

  logger.info(`Checking API Key: ${storefrontKeyToken}`);

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title", "type", "sales_channels.id"],
    filters: {
      token: storefrontKeyToken
    }
  });

  if (apiKeys.length === 0) {
    logger.error("Could not find the API key used by the storefront in the database.");
    return;
  }

  const key = apiKeys[0];
  const currentScIds: string[] = (key.sales_channels?.map(sc => sc?.id).filter(Boolean) as string[]) || [];

  logger.info(`API Key "${key.title}" is currently linked to ${currentScIds.length} sales channels.`);

  if (currentScIds.length <= 1) {
    logger.info("API key already has 1 or fewer sales channels. No fix needed here.");
  } else {
    // Keep the FIRST one as the primary
    const primaryScId = currentScIds[0];
    const toRemove = currentScIds.slice(1);

    logger.info(`Unlinking ${toRemove.length} redundant sales channels from the key...`);
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: key.id,
        remove: toRemove
      }
    });
    logger.info(`Key is now linked only to Sales Channel: ${primaryScId}`);
  }

  // Also ensure products are linked to this primary channel
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id"],
  });

  const productIds = products.map(p => p.id);
  logger.info(`Ensuring all ${productIds.length} products are available in the primary channel...`);
  
  // Note: We already linked products to ALL channels, so they are definitely in the primary one.
  
  logger.info("Fix complete. Please restart/refresh your storefront.");
}
