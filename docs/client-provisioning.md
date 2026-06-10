# BookMoreHQ Client Provisioning

## Reusable Architecture

BookMoreHQ owns one Bland organization and one server-side API key. Clients do
not create Bland accounts or API keys.

1. A closer sends a package-specific Stripe checkout link.
2. Stripe confirms payment and creates the client record.
3. The verified checkout opens the AI Receptionist onboarding form.
4. OpenAI interprets the form into a structured, business-specific phone-agent
   configuration: tone, system prompt, call goals, approved capabilities,
   blocked capabilities, analysis instructions, and test scenarios.
5. Deterministic BookMoreHQ guardrails are appended so the model cannot invent
   integrations, quote authority, payment access, or confirmed scheduling.
6. Bland purchases one client phone number and applies that configuration.
7. The dashboard moves the client into testing.
8. BookMoreHQ runs acceptance calls and marks the client live.

The same checkout session is idempotent: resubmitting the form cannot purchase a
second number.

The compiled prompt is saved with the onboarding record. Retries reuse the same
configuration rather than paying for another model call or allowing prompt
drift between attempts.

The owner dashboard shows whether the AI configuration is pending, compiled,
failed, or requires review. The system never purchases a number while the
compiler is missing, failed, or awaiting review.

Provisioning also uses a lock. Repeated owner clicks share the same job, failed
configuration retries reuse the already purchased number, and abandoned jobs
can be retried after ten minutes.

## Automatic Provisioning

Set `BLAND_AUTO_PROVISION=true` only after Stripe is using a live key. In test
mode, onboarding records enter the owner provisioning queue so test checkouts
cannot create recurring Bland number charges.

Production is intentionally set to `BLAND_AUTO_PROVISION=false` until live
Stripe checkout and acceptance testing are complete.

## Hourly Safety Net

GitHub Actions calls `/api/automation/hourly` seven minutes after every hour.
The secured job:

1. Synchronizes completed Stripe checkouts into clients, payments, commissions,
   and onboarding.
2. Finds paid clients who submitted every required receptionist field.
3. Provisions up to ten eligible clients per run.
4. Leaves paid clients with incomplete onboarding in the dashboard without
   purchasing a number.
5. Skips number provisioning while Stripe is using a test key.

The form still provisions immediately when live Stripe and
`BLAND_AUTO_PROVISION=true` are enabled. The hourly job catches interrupted
webhooks, delayed records, and failed configuration retries.

## Client-Specific Manual Access

Some scheduling platforms require the client to authorize BookMoreHQ through
OAuth or provide an API credential. That authorization cannot be inferred from
the onboarding form. Until it is connected, the receptionist records an
appointment request and does not claim the appointment is confirmed.

SMS confirmations may also require carrier/A2P registration for the assigned
number. Voice answering, lead capture, transfer routing, analysis, call
recording, and dashboard usage tracking can be provisioned from the form.

Lead alert destinations are captured by the form and attached to the Bland
configuration. Sending outbound email or SMS alerts requires a connected
delivery provider; until that is connected, call details remain available in
the BookMoreHQ call dashboard.
