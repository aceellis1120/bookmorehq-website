# BookMoreHQ

BookMoreHQ is the agency website and operations platform for selling,
onboarding, provisioning, and managing AI receptionist clients.

## Platform

- Public service website
- Owner and closer dashboards
- Stripe subscription checkout and payment synchronization
- Paid-client onboarding
- OpenAI receptionist configuration compiler
- Bland AI number provisioning and call activity
- Vercel Blob operations storage
- Hourly payment and provisioning automation

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local`. Configure the integrations needed by the
environment:

- `AUTH_SECRET` and dashboard user credentials
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `BLAND_API_KEY` and `BLAND_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `CRON_SECRET`

Never commit live credentials.

## Verification

```bash
npm run lint
npm run build
```

Pricing and operating assumptions live in `docs/`.
