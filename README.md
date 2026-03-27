# Revenue Intelligence

Revenue Intelligence is a premium, frontend-only ecommerce analytics demo built as a Next.js App Router project. It presents Aurelium Goods, a mid-sized Shopify brand, through a polished revenue intelligence product experience with shared filters, charts, tables, and rule-based business insights.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Recharts
- lucide-react
- Framer Motion

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production check

```bash
npm run lint
npm run build
```

## Deploy to GitHub Pages

This project is configured to publish as a static Next.js export on GitHub Pages.

1. Push the repository to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main`.

The workflow in `.github/workflows/deploy-pages.yml` will:

- install dependencies
- build the app as a static export
- publish the generated `out/` directory to GitHub Pages

The config also detects the repository name automatically and applies the correct `basePath` for project pages such as `https://<user>.github.io/<repo>/`.

If you are publishing from a user or organization Pages repository like `https://<user>.github.io/`, no extra path prefix is added.

## App structure

- `app/`
  App Router pages and layouts for the dashboard routes.
- `components/dashboard/`
  Shell, charts, KPI cards, tables, dialogs, and loading states.
- `components/providers/`
  Global filter context and shared derived dashboard state.
- `components/ui/`
  Reusable shadcn-style primitives.
- `lib/data/`
  Deterministic mock ecommerce dataset.
- `lib/analytics/`
  Filtering, allocation, aggregation, trends, and insight generation.
- `types/`
  Shared dashboard domain types.

## Mock data

The dataset is generated locally in `lib/data/mock-data.ts` with a deterministic seeded generator so the demo stays stable across runs.

It includes:

- 180 days of daily trading activity
- 1,000+ orders
- five channels: Meta, Google, Email, Organic, Direct
- multiple products and categories
- regions, refunds, discounts, shipping, COGS, and attributed ad spend
- first-time and returning customer behavior

Orders are expanded into allocated line items in `lib/analytics/metrics.ts`, which makes category-level filtering and product-level profitability views feel much more realistic than simple hard-coded cards.

## Filter system

Global filters live in `components/providers/dashboard-provider.tsx`.

The provider:

- stores the active date, channel, category, and region filters
- recalculates filtered orders and allocated line items
- derives KPIs, trends, tables, channel views, customer views, and insights from the same shared state
- powers every page from one frontend-only analytics layer

Because the pages read from the same provider, changing a filter updates charts, KPIs, tables, and rule-based insights consistently across the whole app.
