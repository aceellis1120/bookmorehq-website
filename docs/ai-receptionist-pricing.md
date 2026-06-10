# BookMoreHQ AI Receptionist Pricing

Last verified: June 7, 2026

## Commercial Terms

- The setup fee and first month are collected together before implementation begins.
- Setup fees are $2,000 for Starter, $2,500 for Growth, and $3,000 for Scale.
- Closer commission is fixed by package:
  - Starter: $1,000
  - Growth: $1,250
  - Scale: $1,500
- BookMoreHQ retains all recurring revenue.
- Commission is earned only after payment clears and is reversed for refunds or chargebacks.
- Custom integrations, number porting, and work outside the listed scope are quoted separately.
- Clients that exceed their included minutes for two consecutive months move to the next package.

## Packages

| Package | Setup | Monthly | AI Minutes | SMS Segments | Locations / Numbers |
| --- | ---: | ---: | ---: | ---: | ---: |
| Starter | $2,000 | $1,000 | 500 | 500 | 1 |
| Growth | $2,500 | $1,500 | 1,000 | 1,000 | 1 |
| Scale | $3,000 | $2,500 | 2,500 | 2,500 | Up to 3 |

### Starter

- 24/7 AI call answering
- One local phone number
- One business location
- Lead qualification and intake
- Appointment request or calendar booking
- Urgent-call routing
- Customer confirmation texts
- Internal text and email lead alerts
- Call summaries and lead log
- Monthly performance report
- One routine script optimization per month

### Growth

Everything in Starter, plus:

- Advanced call routing
- Up to two departments or primary call flows
- CRM or field-service platform sync
- Estimate and missed-lead follow-up triggers
- Weekly performance report
- Two routine script optimizations per month
- Priority support

### Scale

Everything in Growth, plus:

- Up to three locations or phone numbers
- Up to five primary call flows
- Multi-team routing and escalation
- Advanced scheduling rules
- Custom reporting views
- Weekly optimization
- Priority launch and support

## Overage And Add-On Pricing

| Item | Client Price |
| --- | ---: |
| Additional AI minute | $0.50 |
| Additional SMS segment | $0.05 |
| Additional phone number outside package | $50/month |
| Additional location outside package | Starting at $250/month |
| Custom integration | Quoted separately |
| Number porting | Quoted separately |
| Major call-flow rebuild | Quoted separately |

## Cost Assumptions

The model intentionally uses conservative assumptions.

- Bland AI Start: $0.14 per connected AI minute
- Twilio inbound local voice: $0.0085 per minute
- Twilio local number: $1.15 per month
- Twilio SMS: $0.0083 per segment
- Carrier-fee reserve: $0.004 per SMS segment
- Twilio A2P campaign: $2 per month
- Transfer reserve: 10% of included minutes at an estimated $0.0725 per transfer minute
- Stripe card processing plus Billing reserve: 3.6% + $0.30
- Infrastructure allocation: $5-$12 per client per month
- Support allowance: $100-$250 per client per month

Actual costs vary with call duration, transfers, carrier fees, support demand, payment method, and vendor plan.

## Estimated Monthly Economics

| Package | Revenue | Direct Vendor + Payment Cost | Support + Infrastructure Allowance | Estimated Contribution | Margin |
| --- | ---: | ---: | ---: | ---: | ---: |
| Starter | $1,000 | $123.48 | $105 | $771.52 | 77.2% |
| Growth | $1,500 | $225.50 | $158 | $1,116.50 | 74.4% |
| Scale | $2,500 | $515.88 | $262 | $1,722.13 | 68.9% |

Contribution is before general company overhead, taxes, refunds, chargebacks, sales commissions outside the setup fee, and owner compensation.

## Initial Payment Economics

The initial invoice includes the package-specific setup fee and the first month.

| Package | Client Pays At Signing | Closer Commission | Conservative Estimated BookMoreHQ Contribution |
| --- | ---: | ---: | ---: |
| Starter | $3,000 | $1,000 | About $1,481 |
| Growth | $4,000 | $1,250 | About $2,058 |
| Scale | $5,500 | $1,500 | About $2,895 |

The initial contribution estimates include:

- Card and subscription-processing reserve
- $19 A2P registration and vetting fees
- First-month vendor usage at the full package allowance
- Monthly support and infrastructure allowance
- $200 internal setup-labor allowance

If the client pays by ACH, contribution is higher because Stripe ACH fees are lower than card fees.

## Platform-Level Costs

These are shared company costs rather than per-client charges.

| Platform | Launch Cost | Expected Paid Cost |
| --- | ---: | ---: |
| Vercel hosting | $0 during development | $20/month Pro |
| Supabase database/auth | $0 during development | About $25/month Pro |
| Resend transactional email | $0 up to 3,000 emails/month | $20/month for 50,000 |
| Bland Start platform fee | $0 | Usage based |

### Bland Plan Upgrade Thresholds

- Stay on Start at $0.14/minute while total usage is below roughly 15,000 minutes/month.
- Build costs $299/month plus $0.12/minute and breaks even near 14,950 minutes/month.
- Scale costs $499/month plus $0.11/minute and becomes more economical than Build above roughly 20,000 minutes/month.

## Operating Guardrails

- Do not begin implementation until the initial payment clears.
- Do not promise unlimited minutes, texts, call flows, integrations, or revisions.
- Do not enable SMS until the client's A2P registration is approved.
- Do not guarantee revenue or a specific number of booked jobs.
- Track minutes and SMS usage in the owner dashboard.
- Alert the owner and closer when a client reaches 80% and 100% of allowance.
- Bill overages or upgrade the client instead of absorbing excess usage.

## Official Pricing Sources

- Bland AI: https://bland.ai/pricing
- Twilio Voice: https://www.twilio.com/en-us/voice/pricing/us
- Twilio SMS: https://www.twilio.com/content/twilio-com/global/en-us/sms/pricing/us
- Twilio A2P 10DLC: https://www.twilio.com/en-us/phone-numbers/a2p-10dlc
- Stripe: https://stripe.com/us/pricing
- Vercel: https://vercel.com/docs/plans/pro
- Resend: https://resend.com/docs/knowledge-base/what-is-resend-pricing
