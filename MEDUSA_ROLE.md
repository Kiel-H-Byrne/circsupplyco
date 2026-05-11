# The Role of MedusaJS

Within the Circulate Supply Co. ecosystem, this MedusaJS application serves as the single source of truth for commerce, inventory, and pricing. It operates as a headless backend, consumed by a Next.js storefront and manipulated by automated orchestration scripts (Trigger.dev).

## Key Responsibilities & Constraints

### 1. Human-in-the-Loop (HITL) Enforcement
The entire product creation pipeline is highly automated via AI. However, **quality control is manual**.
- **Mandate**: Every product created in MedusaJS via the automation pipeline **MUST** be staged as a **Draft**.
- AI agents and automated scripts are strictly prohibited from publishing products directly to the live storefront. An operator must review the artwork and metadata before marking the product as "Published."

### 2. Dynamic Pricing Engine
Pricing is not static. It is calculated dynamically based on an AI-generated `rarityScore` assigned during the "Expand" phase of the workflow.
- **The Score**: An integer from `1` to `10`.
- **Base Price**: $25.00
- **Maximum Price**: $50.00
- **Implementation**: The MedusaJS application must accurately reflect this pricing logic when receiving new product payloads from the creation pipeline.

### 3. Collection Management (Aesthetics)
Products belong to specific aesthetic collections generated during the AI brief expansion. MedusaJS manages these categories, ensuring the Next.js frontend can accurately filter and display products based on their assigned aesthetic.

### 4. Future Modules: Travel Logistics
While currently focused on merchandise, the system will eventually orchestrate travel logistics. Similar to merchandise, sensitive operations (like final bookings) will be routed through MedusaJS and require operator confirmation (HITL).
