## Cash Pilot — Expense Tracker Frontend

Cash Pilot is a sleek, responsive frontend for tracking income and expenses, visualizing spending, and managing accounts. It’s optimized for a smooth UX with modern UI components and animations.

### Highlights
- Modern, accessible UI with dark mode-friendly styles
- Dashboard with animated stats, charts, and recent activity
- Accounts and transactions management
- Category-based expense breakdown
- Mobile-first design with desktop enhancements

### Tech Stack
- Next.js (App Router) + React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

### Getting Started
Prerequisites:
- Node.js 18+ (recommend 20+)
- pnpm (recommended) or npm/yarn

Install dependencies:
```bash
pnpm install
# or
npm install
```

Run the dev server:
```bash
pnpm dev
# or
npm run dev
```

Build for production:
```bash
pnpm build
pnpm start
```

Lint and format:
```bash
pnpm lint
pnpm format
```

### Environment Variables
Create a `.env.local` in the project root for any required keys. Examples:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=cash-pilot
```

If you already use an auth provider or external API, add the corresponding `NEXT_PUBLIC_*` or server-only vars here.

### Project Structure

```
├── app/                           # Next.js app directory
│   ├── actions/                   # Server actions (API calls)
│   │   ├── auth.ts                # Authentication actions
│   │   ├── accounts.ts            # Account actions
│   │   ├── categories.ts          # Category actions
│   │   ├── transactions.ts        # Transaction actions
│   │   ├── budgets.ts             # Budget actions
│   │   ├── goals.ts               # Goal actions
│   │   └── profile.ts              # Profile actions
│   │
│   ├── api/                       # Next.js API routes
│   │   └── auth/
│   │       └── set-token/
│   │           └── route.ts        # Cookie management endpoint
│   │
│   ├── auth/                      # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── sign-up-success/
│   │
│   └── dashboard/                 # Dashboard pages
│       ├── page.tsx               # Main dashboard
│       ├── accounts/
│       ├── transactions/
│       ├── budgets/
│       ├── goals/
│       └── settings/
│
├── components/                    # React components
│   ├── ui/                        # shadcn/ui components
│   └── [component-name].tsx      # Feature components
│
├── lib/                           # Utility libraries
│   ├── api-client.ts              # FastAPI client wrapper
│   ├── middleware.ts              # Next.js middleware (auth)
│   ├── server.ts                  # (Legacy - can be removed)
│   ├── client.ts                  # (Legacy - can be removed)
│   └── types.ts                   # TypeScript types
│
├── providers/                     # React context providers
│   └── auth.privider.tsx          # Auth context provider
│
└── validators/                    # Zod validation schemas
```

### Naming and Branding
Throughout the app and documentation, the frontend is referred to as “Cash Pilot” (nickname: `cash-pilot`).

### Contributing
1. Create a feature branch
2. Commit with clear messages
3. Open a PR describing changes and screenshots/GIFs when UI is affected

### License
MIT — feel free to use and adapt Cash Pilot for your needs.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
