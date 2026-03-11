# Choice Bagging Equipment Portal

Two-property web application for CBE customers.

## Routes

- `/` — **Customer Portal** (Dashboard, My Machines, Orders, Quote Requests, Profile)
- `/parts` — **Parts Store** (Browse machines, view parts, shopping cart)

Each property has a small cross-link in the top nav bar to navigate to the other.

## What's New

- **Vertical sidebar navigation** replaces horizontal tabs in the Customer Portal
- **"Inquiry" renamed to "Quote Request"** throughout the portal
- **My Machines list** now shows Sales Order No., Serial No., and Service Landing Page link
- **Machine Detail View** with internal tabs: Overview, Invoices, Approved Quotes, Service & QR
- Machine detail includes QR Code and Service Landing Page placeholders (integrated from external service app)

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo on [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — click Deploy

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
