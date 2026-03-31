# 🔒 Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main` branch) | ✅ Active |
| Older commits | ❌ Not supported |

We only maintain and patch the latest version deployed on the `main` branch.

---

## 📣 Reporting a Vulnerability

If you discover a security vulnerability in Meta Mart, **please do not open a public GitHub issue.**

Instead, report it privately:

- **Email:** devopspraharaj25@gmail.com
- **Subject:** `[SECURITY] Meta Mart - <brief description>`

### What to include

- A clear description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fix (optional)

### Response timeline

| Stage | Timeframe |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 days |
| Fix & patch release | Within 14 days (critical: 72 hours) |

We will credit you in the release notes unless you prefer to remain anonymous.

---

## 🛡️ Security Practices

### Authentication
- User authentication is handled entirely by **Clerk**, a production-grade auth provider
- No passwords are stored in our database
- Sessions are managed via secure, httpOnly cookies
- All auth routes are protected via Next.js middleware (`src/middleware.ts`)

### Payments
- All payment processing is handled by **Stripe**
- No card data ever touches our servers
- Stripe's PCI-DSS compliant infrastructure handles all sensitive payment data
- Stripe secret keys are stored only in server-side environment variables and never exposed to the client

### Environment Variables
- All secrets are stored in `.env.local` which is excluded from version control via `.gitignore`
- `NEXT_PUBLIC_` prefixed variables are intentionally public (Clerk publishable key, Stripe publishable key, EmailJS public key)
- Secret keys (`CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`) are only accessible server-side
- On Vercel, all environment variables are encrypted at rest

### Dependencies
- Dependencies are regularly audited with `npm audit`
- Next.js is kept up to date to patch known CVEs (currently on `16.2.1`)
- Dependabot or manual review is used to monitor for vulnerable packages

### API Routes
- The `/api/create-order` route validates input before passing to Stripe
- No sensitive data is logged or returned in API responses beyond what is necessary

### Headers & CSP
- Vercel automatically sets secure headers including `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security`
- HTTPS is enforced on all Vercel deployments

---

## 🚫 Out of Scope

The following are **not** considered security vulnerabilities for this project:

- Issues in third-party services (Clerk, Stripe, EmailJS) — report those to the respective vendors
- Theoretical attacks without a working proof of concept
- Social engineering attacks
- Denial of service (DoS) attacks on the Vercel infrastructure

---

## 🔗 Third-Party Security Policies

| Service | Security Page |
|---|---|
| Clerk | https://clerk.com/security |
| Stripe | https://stripe.com/docs/security |
| Vercel | https://vercel.com/security |
| EmailJS | https://www.emailjs.com/legal/privacy-policy/ |
