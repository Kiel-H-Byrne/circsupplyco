import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "Created by Medusa",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Default Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Circ Supply Co.",
          supported_currencies: [
            {
              currency_code: "eur",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Shirts",
          is_active: true,
        },
        {
          name: "Sweatshirts",
          is_active: true,
        },
        {
          name: "Pants",
          is_active: true,
        },
        {
          name: "Merch",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "SYSTEM Oversized Tee",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Shirts")!.id,
          ],
          description:
            "A retro-futuristic staple. Heavyweight cotton with a structured oversized fit, featuring the signature SYSTEM schematic diagram.",
          handle: "system-tee",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "S / Black",
              sku: "SYSTEM-TEE-S-BLACK",
              options: {
                Size: "S",
                Color: "Black",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "S / White",
              sku: "SYSTEM-TEE-S-WHITE",
              options: {
                Size: "S",
                Color: "White",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M / Black",
              sku: "SYSTEM-TEE-M-BLACK",
              options: {
                Size: "M",
                Color: "Black",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M / White",
              sku: "SYSTEM-TEE-M-WHITE",
              options: {
                Size: "M",
                Color: "White",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L / Black",
              sku: "SYSTEM-TEE-L-BLACK",
              options: {
                Size: "L",
                Color: "Black",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L / White",
              sku: "SYSTEM-TEE-L-WHITE",
              options: {
                Size: "L",
                Color: "White",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL / Black",
              sku: "SYSTEM-TEE-XL-BLACK",
              options: {
                Size: "XL",
                Color: "Black",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL / White",
              sku: "SYSTEM-TEE-XL-WHITE",
              options: {
                Size: "XL",
                Color: "White",
              },
              prices: [
                {
                  amount: 45,
                  currency_code: "eur",
                },
                {
                  amount: 50,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "PROTOCOL Heavy Hoodie",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Sweatshirts")!.id,
          ],
          description:
            "A masterclass in quiet luxury. 500GSM organic cotton with dropped shoulders and a minimalist high-tech weave.",
          handle: "protocol-hoodie",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "PROTOCOL-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 120,
                  currency_code: "eur",
                },
                {
                  amount: 130,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M",
              sku: "PROTOCOL-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 120,
                  currency_code: "eur",
                },
                {
                  amount: 130,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L",
              sku: "PROTOCOL-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 120,
                  currency_code: "eur",
                },
                {
                  amount: 130,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL",
              sku: "PROTOCOL-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 120,
                  currency_code: "eur",
                },
                {
                  amount: 130,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "GRID Cargo Pants",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Pants")!.id,
          ],
          description:
            "Futuristic utility. Multi-pocket design with a tapered technical silhouette and neon-dim accents.",
          handle: "grid-cargos",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "GRID-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 95,
                  currency_code: "eur",
                },
                {
                  amount: 105,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "M",
              sku: "GRID-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 95,
                  currency_code: "eur",
                },
                {
                  amount: 105,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "L",
              sku: "GRID-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 95,
                  currency_code: "eur",
                },
                {
                  amount: 105,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "XL",
              sku: "GRID-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 95,
                  currency_code: "eur",
                },
                {
                  amount: 105,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "HOLOGRAPHIC Tote",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Merch")!.id,
          ],
          description:
            "The ultimate digital accessory. Iridescent material that shifts with the light, perfect for the modern nomad.",
          handle: "holographic-tote",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["OS"],
            },
          ],
          variants: [
            {
              title: "OS",
              sku: "HOLO-TOTE-OS",
              options: {
                Size: "OS",
              },
              prices: [
                {
                  amount: 35,
                  currency_code: "eur",
                },
                {
                  amount: 40,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      })),
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
