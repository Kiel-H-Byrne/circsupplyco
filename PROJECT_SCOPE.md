# Project Scope: Circulate Supply Co.

## 1. Project Mission & Brand Identity
**Mission**: An autonomous, private, cloud-hosted system that transforms conceptual designs into physical merchandise and orchestrated travel logistics.
**Brand Name**: Circulate Supply Co.
**Aesthetic**: Modern, Clean, Striking.
**Voice**: Tech-forward, modular, professional yet creative. Intersection of technology and streetwear.

## 2. Core Architectural Mandates
The platform operates on a distributed microservices architecture:
- **Backend/E-commerce**: MedusaJS (this repository) serves as the headless commerce engine.
- **Frontend**: Next.js (App Router) for the user-facing storefront.
- **Orchestration**: Long-running tasks and agentic workflows are handled by **Trigger.dev (v3)**. Agentic loops are strictly prohibited in standard serverless functions.
- **Database/Logging**: Supabase is used for logging workflow steps and storing metadata.

## 3. Implementation Workflow Protocol
The creation of merchandise follows a strict 8-step autonomous pipeline. While MedusaJS only handles the "Stage" step directly, understanding the full context is critical:

1. **Expand**: Use LLM (Gemini 1.5 Pro) to expand a concept into a brand-aligned brief, generating an `aesthetic` category and a `rarityScore`.
2. **Generate**: Use Replicate (Flux) for raw artwork generation.
3. **Process**: Remove the image background (`lucataco/remove-bg`) and upscale the image (`nightmareai/real-esrgan`).
4. **Host**: Upload the processed image to imgBB for a permanent URL (permanent assets are mandatory).
5. **Manufacture**: Upload to Printify Media Library and create/publish the product via Printify's API (Blueprint 12, Provider 45). *Rate limits apply.*
6. **Stage (Medusa's Role)**: Create a Draft product in MedusaJS. Set the price dynamically based on the `rarityScore` and assign it to the appropriate aesthetic collection.
7. **Log**: Record every step in Supabase (`workflow_logs`) and the final product details in the `products` table.
8. **Distribute**: Publish marketing assets via Ayrshare.
