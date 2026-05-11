# Circulate Supply Co. - MedusaJS Application Context

Welcome to the MedusaJS repository for **Circulate Supply Co.** 

This repository contains the headless e-commerce backend that powers our automated merchandise and travel logistics platform. 

If you are an AI assistant (like Gemini) working in this repository, you **MUST** read the following documents to understand the broader project scope and your specific operational mandates before making any code changes:

1. [PROJECT_SCOPE.md](./PROJECT_SCOPE.md) - Outlines the overarching mission, brand identity, and the end-to-end automated workflow.
2. [MEDUSA_ROLE.md](./MEDUSA_ROLE.md) - Details the exact responsibilities of this MedusaJS application within the larger system.
3. [AI_INSTRUCTIONS.md](./AI_INSTRUCTIONS.md) - Technical guidelines, security guardrails, and development rules for AI agents operating in this codebase.

## Quick Summary
- **Architecture**: Headless e-commerce backend (MedusaJS) + Next.js App Router frontend.
- **Key Feature**: Human-in-the-Loop (HITL) product staging. All AI-generated products are staged here as **Drafts** for manual approval.
- **Pricing Logic**: Dynamic pricing based on an AI-generated `rarityScore` (Base: $25, Max: $50).

Please proceed to the linked documentation for detailed system constraints.
