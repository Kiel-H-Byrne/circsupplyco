# AI Agent Instructions

As an AI agent (e.g., Gemini, Antigravity) working within this MedusaJS repository, you must adhere to the following rules without exception:

## 1. Type Safety & Data Validation
- **TypeScript Exclusively**: All code must be written in TypeScript. Do not use plain JavaScript.
- **Strict Schemas**: Maintain strict `zod` schemas for all API payloads and internal state modifications. Ensure payloads from external orchestration services match expected structures exactly.

## 2. Security Guardrails
- **No Secrets in Code**: Never log or print API keys (e.g., Printify, Medusa Admin tokens, Replicate, Supabase).
- **Service Role for Backend Tasks**: When writing scripts or backend tasks that interact with Supabase, use the `service_role` key via `supabaseAdmin` to ensure Row Level Security (RLS) is handled correctly for automated operations.

## 3. Workflow & Documentation
- **Update TODOS.md**: Always update the `TODOS.md` file in the root directory after completing a significant milestone or changing the status of a feature.
- **Extensibility**: When implementing new features or API routes in Medusa, ensure they are modular enough to be registered as tools in our Hierarchical Multi-Agent Supervisor pattern.

## 4. Architectural Adherence
- Do not implement long-running agentic loops inside MedusaJS endpoints. Medusa should quickly acknowledge requests. Heavy orchestration belongs in Trigger.dev.
- Respect the Human-in-the-Loop (HITL) rule: Do not write code that circumvents the Draft-status requirement for new products.

## 5. Administrative Tasks
- **Production Admin User**: If tasked with creating a new admin user in production, refer to `GCP_DEPLOYMENT.md`. Use Cloud Run Jobs with the correct VPC connector and environment variables. Do not attempt to run admin creation commands directly on the Cloud Run service instance.
