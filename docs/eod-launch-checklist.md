# BookMoreHQ End-Of-Day Launch Checklist

Last updated: June 10, 2026

## Required Today

- [x] Connect live Stripe credentials
- [x] Verify live Starter, Growth, and Scale checkout amounts
- [x] Confirm the production Stripe webhook accepts signed events
- [x] Configure reusable Stripe products and prices
- [ ] Submit one complete AI Receptionist onboarding form
- [x] Create the multi-niche demo agent and demo phone number
- [ ] Connect the OpenAI configuration compiler
- [ ] Connect client lead-alert email delivery
- [ ] Run all demo call scenarios
- [ ] Give each closer dashboard access and their checkout process
- [ ] Conduct one role-play demo and close

## Remaining Credentials

- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `LEAD_ALERT_FROM_EMAIL` from a verified sending domain

## Go-Live Gate

Do not send a live checkout link until:

- The package amount and monthly subscription are correct in Stripe.
- The closer name appears in checkout metadata.
- The success page only opens onboarding after payment verification.
- A completed checkout appears in the Stripe dashboard.
- The live receptionist passes normal, urgent, transfer, and notification tests.
- The closer can explain the package, launch timing, overages, and refund terms.

## What Can Be Operational Today

The website checkout, payment verification, onboarding intake, closer links,
pricing, live Stripe collection, and sales process are operational.

The phone demo is operational. Production-grade CRM synchronization, SMS/A2P,
number porting, and automatic commission payouts remain later phases after the
first paid clients validate the workflow.
