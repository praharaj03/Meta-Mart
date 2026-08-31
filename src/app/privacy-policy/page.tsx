import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'MetaMart Privacy Policy — how we collect, use, and protect your personal data.',
};

const LAST_UPDATED = 'June 15, 2025';
const EFFECTIVE_DATE = 'June 15, 2025';

const sections = [
  { id: 'overview',        title: '1. Overview' },
  { id: 'data-collected',  title: '2. Data We Collect' },
  { id: 'how-we-use',      title: '3. How We Use Your Data' },
  { id: 'sharing',         title: '4. Sharing & Disclosure' },
  { id: 'cookies',         title: '5. Cookies & Tracking' },
  { id: 'retention',       title: '6. Data Retention' },
  { id: 'your-rights',     title: '7. Your Rights' },
  { id: 'security',        title: '8. Security' },
  { id: 'children',        title: '9. Children\'s Privacy' },
  { id: 'international',   title: '10. International Transfers' },
  { id: 'changes',         title: '11. Changes to This Policy' },
  { id: 'contact',         title: '12. Contact Us' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#08070d] text-[#f7f4ff]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 sm:px-6 border-b border-white/8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow text-xs text-purple-300 mb-3">Legal</p>
          <h1 className="display-font text-4xl sm:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
            <span>Last updated: <span className="text-zinc-300">{LAST_UPDATED}</span></span>
            <span>Effective: <span className="text-zinc-300">{EFFECTIVE_DATE}</span></span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:grid lg:grid-cols-[240px_1fr] lg:gap-16">

        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-4">Contents</p>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className="block text-sm text-zinc-400 hover:text-purple-300 py-1 border-l-2 border-transparent hover:border-purple-400 pl-3 transition-all duration-150">
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <article className="prose-legal">

          <Section id="overview" title="1. Overview">
            <p>MetaMart ("we", "us", or "our") operates the website at <strong>meta-mart.vercel.app</strong> (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.</p>
            <p>By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the Service.</p>
            <Callout>This policy applies to all users globally. Where local laws grant additional rights (e.g. GDPR, CCPA), those rights are described in Section 7.</Callout>
          </Section>

          <Section id="data-collected" title="2. Data We Collect">
            <h3>2.1 Information You Provide</h3>
            <Table rows={[
              ['Full name', 'Order fulfilment and account creation'],
              ['Email address', 'Order confirmations, receipts, and support'],
              ['Phone number', 'Delivery coordination'],
              ['Shipping address', 'Order delivery'],
              ['Payment details', 'Processed securely by Stripe — we never store card numbers'],
            ]} headers={['Data', 'Purpose']} />

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Log data</strong> — IP address, browser type, pages visited, time and date of visit, time spent on pages.</li>
              <li><strong>Device data</strong> — device type, operating system, unique device identifiers.</li>
              <li><strong>Cookies & similar technologies</strong> — see Section 5 for full details.</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <ul>
              <li><strong>Clerk (authentication)</strong> — name, email, and profile picture from your chosen sign-in provider (Google, GitHub, etc.).</li>
              <li><strong>Stripe (payments)</strong> — transaction status and billing country. Stripe's own privacy policy governs payment data.</li>
            </ul>
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Data">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfil your orders, including sending confirmation emails and receipts.</li>
              <li>Manage your account and authenticate your identity.</li>
              <li>Provide customer support and respond to enquiries.</li>
              <li>Send transactional emails (order updates, shipping notifications). We do <strong>not</strong> send marketing emails without your explicit consent.</li>
              <li>Detect, prevent, and address fraud, security incidents, and technical issues.</li>
              <li>Comply with legal obligations (tax records, consumer protection laws).</li>
              <li>Improve our website, products, and services through aggregated, anonymised analytics — only if you have consented to analytics cookies.</li>
            </ul>
            <Callout type="info">We operate on a <strong>data minimisation</strong> principle — we only collect what is strictly necessary for the stated purpose.</Callout>
          </Section>

          <Section id="sharing" title="4. Sharing & Disclosure">
            <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share data only in the following circumstances:</p>
            <Table headers={['Recipient', 'Reason', 'Data Shared']} rows={[
              ['Stripe', 'Payment processing', 'Order total, billing country, email'],
              ['Clerk', 'Authentication', 'Email, name, profile picture'],
              ['MongoDB Atlas', 'Order & product database', 'Order details, delivery address'],
              ['EmailJS', 'Contact form delivery', 'Name, email, message content'],
              ['Vercel', 'Hosting & edge functions', 'Request logs, IP address'],
              ['Law enforcement', 'Legal obligation only', 'As required by valid legal process'],
            ]} />
            <p>All third-party processors are contractually bound to handle your data securely and only for the purposes we specify.</p>
          </Section>

          <Section id="cookies" title="5. Cookies & Tracking">
            <p>We use cookies and similar tracking technologies. You can manage your preferences at any time via the cookie banner or the <strong>Cookies</strong> link in our footer.</p>
            <Table headers={['Category', 'Examples', 'Can be declined?']} rows={[
              ['Functional', 'Cart contents (mm_cart), session token, cookie consent (mm_cookie_consent)', 'No — required for the site to work'],
              ['Analytics', 'Page view counts, navigation paths (anonymised)', 'Yes'],
              ['Marketing', 'Ad personalisation, retargeting pixels', 'Yes'],
            ]} />
            <p>Most browsers allow you to refuse cookies via their settings. Disabling functional cookies will prevent cart persistence between sessions.</p>
          </Section>

          <Section id="retention" title="6. Data Retention">
            <ul>
              <li><strong>Order records</strong> — retained for 7 years to comply with tax and accounting regulations.</li>
              <li><strong>Account data</strong> — retained while your account is active. Deleted within 30 days of account closure upon request.</li>
              <li><strong>Support correspondence</strong> — retained for 2 years.</li>
              <li><strong>Analytics data</strong> — aggregated and anonymised; retained indefinitely. Raw logs deleted after 90 days.</li>
              <li><strong>Cookie consent records</strong> — stored in your browser for 1 year.</li>
            </ul>
          </Section>

          <Section id="your-rights" title="7. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <Table headers={['Right', 'Description']} rows={[
              ['Access', 'Request a copy of the personal data we hold about you.'],
              ['Rectification', 'Ask us to correct inaccurate or incomplete data.'],
              ['Erasure', 'Request deletion of your personal data ("right to be forgotten").'],
              ['Restriction', 'Ask us to limit how we process your data.'],
              ['Portability', 'Receive your data in a structured, machine-readable format.'],
              ['Objection', 'Object to processing based on legitimate interests or for direct marketing.'],
              ['Withdraw consent', 'Withdraw consent at any time where processing is consent-based.'],
            ]} />
            <Callout>To exercise any of these rights, email us at <strong>devopspraharaj25@gmail.com</strong>. We will respond within 30 days. We may need to verify your identity before processing the request.</Callout>
            <h3>GDPR (EU/EEA Users)</h3>
            <p>Our lawful bases for processing are: contract performance (order fulfilment), legal obligation (tax records), legitimate interests (fraud prevention, security), and consent (analytics/marketing cookies).</p>
            <h3>CCPA (California Residents)</h3>
            <p>California residents have the right to know what personal information is collected, to delete it, and to opt out of its sale. We do not sell personal information.</p>
          </Section>

          <Section id="security" title="8. Security">
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>TLS/HTTPS encryption for all data in transit.</li>
              <li>Payment data handled exclusively by Stripe (PCI-DSS Level 1 certified).</li>
              <li>Authentication managed by Clerk with support for MFA.</li>
              <li>Database access restricted by IP allowlist and role-based permissions.</li>
              <li>Regular dependency audits and security patches.</li>
            </ul>
            <p>No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security. In the event of a data breach affecting your rights, we will notify you within 72 hours as required by applicable law.</p>
          </Section>

          <Section id="children" title="9. Children's Privacy">
            <p>Our Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will delete such information.</p>
          </Section>

          <Section id="international" title="10. International Transfers">
            <p>MetaMart is operated from India. Your information may be transferred to and processed in countries other than your own, including the United States (Vercel, Clerk, Stripe) and the European Union. These countries may have data protection laws different from those in your country.</p>
            <p>Where we transfer data outside the EEA, we ensure appropriate safeguards are in place (Standard Contractual Clauses or adequacy decisions).</p>
          </Section>

          <Section id="changes" title="11. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
            <ul>
              <li>Posting the new policy on this page with an updated "Last updated" date.</li>
              <li>Sending an email notification to registered users for material changes.</li>
              <li>Displaying a prominent notice on our website for 30 days after the change.</li>
            </ul>
            <p>Your continued use of the Service after changes become effective constitutes acceptance of the revised policy.</p>
          </Section>

          <Section id="contact" title="12. Contact Us">
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <div className="not-prose mt-4 p-5 rounded-xl bg-white/4 border border-white/10 space-y-2 text-sm">
              <p><span className="text-zinc-400">Email:</span> <a href="mailto:devopspraharaj25@gmail.com" className="text-purple-300 hover:text-purple-200">devopspraharaj25@gmail.com</a></p>
              <p><span className="text-zinc-400">Contact form:</span> <Link href="/contact" className="text-purple-300 hover:text-purple-200">metamart.vercel.app/contact</Link></p>
              <p><span className="text-zinc-400">Response time:</span> <span className="text-zinc-300">Within 30 days</span></p>
            </div>
          </Section>

          <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-sm text-zinc-500">
            <Link href="/terms" className="hover:text-purple-300 transition-colors">Terms & Conditions →</Link>
            <Link href="/faq" className="hover:text-purple-300 transition-colors">FAQ →</Link>
            <Link href="/contact" className="hover:text-purple-300 transition-colors">Contact Us →</Link>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-28">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 pb-3 border-b border-white/8">{title}</h2>
      <div className="space-y-4 text-[15px] text-zinc-300 leading-7">{children}</div>
    </section>
  );
}

function Callout({ children, type = 'note' }: { children: React.ReactNode; type?: 'note' | 'info' }) {
  return (
    <div className={`my-4 p-4 rounded-xl border text-sm leading-relaxed ${
      type === 'info'
        ? 'bg-purple-500/8 border-purple-400/25 text-purple-200'
        : 'bg-white/4 border-white/10 text-zinc-300'
    }`}>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {headers.map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-zinc-200 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/6 last:border-0 hover:bg-white/3 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-4 py-3 text-zinc-300 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
