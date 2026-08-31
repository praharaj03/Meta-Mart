<div align="center">

<img src="./public/logo.png" alt="Meta Mart Logo" width="120" />

# 🛒 Meta Mart

### _Premium E-Commerce, Reimagined_

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://meta-mart-sable.vercel.app/)

<br/>

> **🌐 Live Demo → [meta-mart-sable.vercel.app](https://meta-mart-sable.vercel.app/)**

<br/>

![Meta Mart Preview](./Metamart.png)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🛍️ Shopping
- Product catalogue with category filters & real-time search
- Wishlist / favourites toggle (session-persisted)
- Add to cart with toast notifications
- Auto-sliding hero product carousel
- Responsive product grid (1 → 2 → 3 columns)

</td>
<td width="50%">

### 🔐 Auth & Users
- Sign up / Login via **Clerk** (Google, GitHub, email)
- Protected routes with Next.js middleware
- User profile & session management
- Redirect flows post-authentication

</td>
</tr>
<tr>
<td width="50%">

### 💳 Checkout & Orders
- Multi-step checkout with address form & draft persistence
- **Stripe**-powered secure card payments
- UPI payment UI (demo mode)
- Order confirmation with confetti 🎉
- Real-time 5-step order tracking stepper
- Persistent order history per user
- PDF receipt download

</td>
<td width="50%">

### 🍪 Privacy & Legal
- Cookie consent banner (Functional / Analytics / Marketing)
- Consent stored as a real browser cookie (`mm_cookie_consent`)
- Cart persistence gated behind functional cookie consent
- Full **Privacy Policy** page (`/privacy-policy`)
- Full **Terms & Conditions** page (`/terms`)
- Sticky sidebar table of contents on legal pages

</td>
</tr>
<tr>
<td width="50%">

### 📬 Contact & Support
- Contact form powered by **EmailJS**
- FAQ accordion with deep-link anchors (`#shipping`, `#returns`)
- Fully responsive across all screen sizes
- Smooth animations & page transitions

</td>
<td width="50%">

### 🎨 Design
- Dark purple theme throughout (`#08070d` base)
- `Space Grotesk` display font + `Manrope` body + `DM Mono` eyebrow
- Purple grid background, glow buttons, glass panels
- Mobile-first responsive layout
- Scroll-to-top button in footer

</td>
</tr>
</table>

---

## 🗂️ Project Structure

```
metamart/
├── public/                        # Static assets
│   ├── logo.png
│   ├── favicon.svg
│   ├── site.webmanifest
│   ├── slider.avif
│   └── ...icons & images
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API route handlers
│   │   │   ├── create-order/
│   │   │   │   └── route.ts       # Stripe checkout session
│   │   │   ├── orders/
│   │   │   │   └── route.ts       # Fetch orders by email
│   │   │   ├── products/
│   │   │   │   └── route.ts       # Fetch products from DB
│   │   │   └── webhook/
│   │   │       └── route.ts       # Stripe webhook handler
│   │   │
│   │   ├── cart/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Cart page
│   │   ├── checkout/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Checkout + Stripe redirect
│   │   ├── contact/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Contact form (EmailJS)
│   │   ├── faq/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # FAQ accordion (#shipping, #returns anchors)
│   │   ├── login/
│   │   │   ├── [[...rest]]/
│   │   │   │   └── page.tsx       # Clerk sign-in
│   │   │   └── login.css
│   │   ├── orders/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Order history + tracking stepper
│   │   ├── privacy-policy/
│   │   │   └── page.tsx           # Full Privacy Policy (GDPR / CCPA)
│   │   ├── receipt/
│   │   │   └── [orderId]/
│   │   │       └── page.tsx       # Individual order receipt
│   │   ├── register/
│   │   │   └── [[...rest]]/
│   │   │       └── page.tsx       # Clerk sign-up
│   │   ├── shop/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx           # Product listing + filters + search
│   │   ├── terms/
│   │   │   └── page.tsx           # Full Terms & Conditions
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css            # Global styles, dark theme, prose-legal
│   │   ├── layout.tsx             # Root layout + metadata
│   │   └── page.tsx               # Homepage (hero, featured, promise)
│   │
│   ├── components/
│   │   ├── AutoSlider.tsx         # Auto-advancing image carousel
│   │   ├── ClientProviders.tsx    # ClerkProvider + CartProvider + CookieConsent
│   │   ├── CookieConsent.tsx      # Cookie banner + consent manager modal
│   │   ├── Footer.tsx             # Site footer (nav, support links, newsletter)
│   │   ├── LoadingScreen.tsx      # Full-screen page loader
│   │   └── Navbar.tsx             # Responsive navbar + mobile menu + search
│   │
│   ├── context/
│   │   ├── CartContext.tsx        # Global cart state (consent-gated persistence)
│   │   └── useCookieConsent.ts    # Cookie consent hook (read/write mm_cookie_consent)
│   │
│   ├── data/
│   │   └── products/              # Static product seed data
│   │
│   ├── lib/
│   │   ├── db.ts                  # MongoDB Atlas connection
│   │   └── email.ts               # EmailJS helper
│   │
│   ├── models/
│   │   ├── Order.ts               # Mongoose Order schema
│   │   └── Product.ts             # Mongoose Product schema
│   │
│   ├── utils/
│   │   └── generateReceipt.ts     # PDF receipt generator
│   │
│   └── proxy.ts                   # Dev proxy config
│
├── .env.local                     # Environment variables (never commit)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts                 # Next.js config
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- npm or yarn
- [Clerk](https://clerk.com) account
- [Stripe](https://stripe.com) account
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- [EmailJS](https://www.emailjs.com) account

### Installation

```bash
# Clone the repo
git clone https://github.com/praharaj03/Meta-Mart.git
cd Meta-Mart/metamart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys — see section below

# Run development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the `metamart/` root:

```env
# ── Clerk Authentication ──────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ── MongoDB Atlas ─────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/metamart

# ── Stripe ────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── EmailJS ───────────────────────────────────────────
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

> ⚠️ Never commit `.env.local` to version control. It is already listed in `.gitignore`.

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router, Turbopack) | Routing, SSR, API routes |
| Language | TypeScript 5 | Type safety |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Auth | Clerk | Sign-in, sign-up, session management |
| Payments | Stripe | Checkout sessions, webhooks |
| Database | MongoDB Atlas + Mongoose | Orders & products |
| Email | EmailJS | Contact form delivery |
| Fonts | Space Grotesk, Manrope, DM Mono | Typography |
| Deployment | Vercel | Hosting & edge functions |
| State | React Context API | Cart & cookie consent |

---

## 🍪 Cookie Consent

MetaMart implements a real cookie consent system:

| Cookie | Name | Purpose | Expiry |
|---|---|---|---|
| Consent record | `mm_cookie_consent` | Stores user's consent choices | 1 year |
| Cart | `localStorage: cart` | Persists cart between sessions | Session / until cleared |

**Three consent categories:**
- **Functional** — always on; required for cart persistence and session
- **Analytics** — opt-in; anonymised usage data
- **Marketing** — opt-in; personalised offers (off by default)

Users can update their preferences at any time via the **Cookies** link in the footer.

---

## 📜 Scripts

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📄 Legal Pages

| Page | Route | Description |
|---|---|---|
| Privacy Policy | `/privacy-policy` | GDPR & CCPA compliant, data collection, retention, user rights |
| Terms & Conditions | `/terms` | Orders, returns, IP, liability, dispute resolution |

Both pages feature a sticky sidebar table of contents and deep-link anchors.

---

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for our security policy, how to report vulnerabilities, and best practices followed in this project.

---

## 📄 License

This project is open source under the [MIT License](./LICENSE).

---

<div align="center">

Made with ❤️ by [Abhisek Praharaj](https://github.com/praharaj03)

[![GitHub](https://img.shields.io/badge/GitHub-praharaj03-181717?style=flat-square&logo=github)](https://github.com/praharaj03)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-praharajabhisek-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/praharajabhisek)
[![Twitter](https://img.shields.io/badge/Twitter-praharaj25-1DA1F2?style=flat-square&logo=x)](https://x.com/praharaj25)
[![Instagram](https://img.shields.io/badge/Instagram-blank__canvas03-E4405F?style=flat-square&logo=instagram)](https://instagram.com/blank_canvas03)

⭐ Star this repo if you found it helpful!

</div>
