# PhoneStore

A responsive Next.js storefront for phones and accessories with authentication, cart persistence, order history, support chat, admin order management and Zarinpal checkout.

## Run locally

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Configure MongoDB, JWT and payment environment variables.

4. Start development:

   ```bash
   npm run dev
   ```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

Or run all checks:

```bash
npm run check
```

## Main routes

- `/` — home
- `/product` — searchable/filterable catalog
- `/product/[id]` — product detail
- `/category/[slug]` — category catalog
- `/basket` — cart and checkout
- `/login`, `/signup` — authentication
- `/orders` — signed-in order history
- `/contact` — support entry point
- `/admin` — admin order dashboard
- `/adminchat` — admin support inbox

See `PRODUCTION_READINESS.md` for the refactor notes, security changes and deployment requirements.
