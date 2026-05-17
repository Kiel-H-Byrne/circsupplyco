import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils";

export default async function diagnose_products({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Starting product diagnosis...");

  // 1. Check Products
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "status", "sales_channels.*"],
  });

  logger.info(`Found ${products.length} products in total.`);
  
  products.forEach(p => {
    logger.info(`- Product: ${p.title} (ID: ${p.id}, Status: ${p.status})`);
    if (p.sales_channels && p.sales_channels.length > 0) {
      logger.info(`  Linked Sales Channels: ${p.sales_channels?.map(sc => sc?.name).join(", ")}`);
    } else {
      logger.warn(`  WARNING: Product ${p.title} has NO linked sales channels.`);
    }
  });

  // 2. Check Sales Channels
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name", "description"],
  });

  logger.info(`Found ${salesChannels.length} sales channels.`);
  salesChannels.forEach(sc => {
    logger.info(`- Sales Channel: ${sc.name} (ID: ${sc.id})`);
  });

  // 3. Check API Keys and Sales Channel Links
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "type", "sales_channels.*"],
  });

  logger.info(`Found ${apiKeys.length} API keys.`);
  apiKeys.forEach(key => {
    if (key.type === "publishable") {
      logger.info(`- Publishable API Key: ${key.title} (ID: ${key.id})`);
      if (key.sales_channels && key.sales_channels.length > 0) {
        logger.info(`  Linked Sales Channels: ${key.sales_channels?.map(sc => sc?.name).join(", ")}`);
      } else {
        logger.warn(`  WARNING: Publishable API Key ${key.title} has NO linked sales channels.`);
      }
    }
  });

  // 4. Check Regions
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  });

  logger.info(`Found ${regions.length} regions.`);
  regions.forEach(r => {
    logger.info(`- Region: ${r.name} (Currency: ${r.currency_code}, Countries: ${r.countries?.map(c => c?.iso_2).join(", ")})`);
  });

  logger.info("Diagnosis complete.");
}
