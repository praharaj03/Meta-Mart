<div align="center">

<img src="./public/logo.png" alt="Meta Mart Logo" width="120" />

# 🛒 Meta Mart

### _Premium E-Commerce, Reimagined_

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
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
- Product showcase with category filters
- Real-time search across all products
- Wishlist / favorites toggle
- Add to cart with toast notifications
- Auto-sliding product carousel

</td>
<td width="50%">

### 🔐 Auth & Users
- Sign up / Login via **Clerk**
- Protected routes with middleware
- User profile & session management
- Redirect flows post auth

</td>
</tr>
<tr>
<td width="50%">

### 💳 Checkout & Orders
- Multi-step checkout with address form
- **Stripe**-powered secure payments
- Order confirmation with confetti 🎉
- Real-time order tracking stepper
- Persistent order history

</td>
<td width="50%">

### 📬 Contact & Support
- Contact form via **EmailJS**
- FAQ page with animated accordion
- Responsive across all devices
- Smooth page transitions & animations

</td>
</tr>
</table>

---

## 🗂️ Project Structure

```
meta-mart/
├── public/               # Static assets
├── src/
│   ├── app/
│   │   ├── api/          # Stripe order API route
│   │   ├── cart/         # Cart page
│   │   ├── checkout/     # Checkout + Stripe redirect
│   │   ├── contact/      # Contact form (EmailJS)
│   │   ├── faq/          # FAQ accordion
│   │   ├── login/        # Clerk sign-in
│   │   ├── orders/       # Order history + tracker
│   │   ├── register/     # Clerk sign-up
│   │   └── shop/         # Product listing + filters
│   ├── components/
│   │   ├── AutoSlider    # Hero carousel
│   │   ├── Navbar        # Responsive nav + search
│   │   ├── Footer        # Site footer
│   │   └── LoadingScreen # Page loader
│   ├── context/
│   │   └── CartContext   # Global cart state
│   └── middleware.ts     # Clerk auth middleware
├── .env.local            # Environment variables
└── next.config.ts        # Next.js config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18`
- npm or yarn
- Clerk account
- Stripe account
- EmailJS account

### Installation

```bash
# Clone the repo
git clone https://github.com/praharaj03/Meta-Mart.git
cd Meta-Mart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys (see Environment Variables section)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> ⚠️ Never commit `.env.local` to version control.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth | Clerk |
| Payments | Stripe |
| Email | EmailJS |
| Deployment | Vercel |
| State | React Context API |

---

## 📜 Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

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
