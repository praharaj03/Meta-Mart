import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'MetaMart Terms & Conditions — the rules governing your use of our platform and services.',
};

const LAST_UPDATED = 'June 15, 2025';
const EFFECTIVE_DATE = 'June 15, 2025';

const sections = [
  { id: 'acceptance',      title: '1. Acceptance of Terms' },
  { id: 'eligibility',     title: '2. Eligibility' },
  { id: 'account',         title: '3. Your Account' },
  { id: 'products',        title: '4. Products & Pricing' },
  { id: 'orders',          title: '5. Orders & Payment' },
  { id: 'shipping',        title: '6. Shipping & Delivery' },
  { id: 'returns',         title: '7. Returns & Refunds' },
  { id: 'prohibited',      title: '8. Prohibited Conduct' },
  { id: 'ip',              title: '9. Intellectual Property' },
  { id: 'disclaimer',      title: '10. Disclaimers' },
  { id: 'liability',       title: '11. Limitation of Liability' },
  { id: 'indemnification', title: '12. Indemnification' },
  { id: 'termination',     title: '13. Termination' },
  { id: 'governing-law',   title: '14. Governing Law' },
  { id: 'disputes',        title: '15. Dispute Resolution' },
  { id: 'changes',         title: '16. Changes to Terms' },
  { id: 'contact',         title: '17. Contact Us' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#08070d] text-[#f7f4ff]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 sm:px-6 border-b border-white/8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow text-xs text-purple-300 mb-3">Legal</p>
          <h1 className="display-font text-4xl sm:text-5xl font-bold tracking-tight mb-4">Terms &amp; Conditions</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
            <span>Last updated: <span className="text-zinc-300">{LAST_UPDATED}</span></span>
            <span>Effective: <span className="text-zinc-300">{EFFECTIVE_DATE}</span></span>
          </div>
          <Callout type="warning">
            Please read these Terms carefully before using MetaMart. By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part, you may not use our Service.
          </Callout>
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

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and MetaMart ("Company", "we", "us", or "our"), governing your access to and use of the MetaMart website located at <strong>meta-mart.vercel.app</strong> and all related services (collectively, the "Service").</p>
            <p>By creating an account, browsing the website, or placing an order, you confirm that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy-policy" className="text-purple-300 hover:text-purple-200">Privacy Policy</Link>, which is incorporated herein by reference.</p>
          </Section>

          <Section id="eligibility" title="2. Eligibility">
            <p>To use our Service, you must:</p>
            <ul>
              <li>Be at least <strong>18 years of age</strong>, or the age of majority in your jurisdiction, whichever is greater.</li>
              <li>Have the legal capacity to enter into a binding contract.</li>
              <li>Not be prohibited from using the Service under applicable laws.</li>
              <li>Provide accurate, current, and complete information during registration and checkout.</li>
            </ul>
            <p>If you are under 18, you may only use the Service under the supervision of a parent or legal guardian who agrees to these Terms on your behalf.</p>
          </Section>

          <Section id="account" title="3. Your Account">
            <h3>3.1 Registration</h3>
            <p>You may browse the Service without an account. To place orders, you must register using Clerk authentication. You agree to provide accurate information and keep it updated.</p>
            <h3>3.2 Account Security</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to:</p>
            <ul>
              <li>Notify us immediately of any unauthorised access to your account.</li>
              <li>Not share your credentials with any third party.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
            <h3>3.3 Account Termination</h3>
            <p>We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms, engage in fraudulent activity, or for any other reason with or without notice.</p>
          </Section>

          <Section id="products" title="4. Products & Pricing">
            <h3>4.1 Product Descriptions</h3>
            <p>We make every effort to display products accurately. However, we do not warrant that product descriptions, images, pricing, or other content is accurate, complete, or error-free. Product images are for illustrative purposes and may differ slightly from the actual product.</p>
            <h3>4.2 Pricing</h3>
            <p>All prices are displayed in <strong>Indian Rupees (rs )</strong> and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without prior notice. Price changes will not affect orders already confirmed.</p>
            <h3>4.3 Availability</h3>
            <p>All products are subject to availability. We reserve the right to limit quantities, discontinue products, or refuse orders at our discretion. If a product becomes unavailable after your order is placed, we will notify you and offer a full refund.</p>
            <Callout>Prices shown during checkout are final. Any discrepancy between listed and charged prices should be reported to us within 7 days.</Callout>
          </Section>

          <Section id="orders" title="5. Orders & Payment">
            <h3>5.1 Order Placement</h3>
            <p>By placing an order, you make an offer to purchase the selected products at the stated price. An order confirmation email does not constitute acceptance — acceptance occurs when we dispatch the goods.</p>
            <h3>5.2 Payment Processing</h3>
            <p>Payments are processed securely by <strong>Stripe</strong>. We accept all major credit and debit cards. By providing payment information, you represent that you are authorised to use the payment method.</p>
            <Table headers={['Payment Method', 'Processing Time', 'Fees']} rows={[
              ['Credit / Debit Card (Stripe)', 'Instant', 'None charged to customer'],
              ['UPI (Demo only)', 'N/A — not currently active', 'N/A'],
            ]} />
            <h3>5.3 Order Cancellation</h3>
            <p>You may cancel an order within <strong>1 hour</strong> of placement by contacting us at <a href="mailto:devopspraharaj25@gmail.com" className="text-purple-300 hover:text-purple-200">devopspraharaj25@gmail.com</a>. Once an order has been dispatched, it cannot be cancelled — please refer to our Returns policy.</p>
            <h3>5.4 Failed Payments</h3>
            <p>If a payment fails, your order will not be processed. You will be notified and may retry with a different payment method. We are not liable for any losses arising from failed transactions.</p>
          </Section>

          <Section id="shipping" title="6. Shipping & Delivery">
            <Table headers={['Shipping Type', 'Estimated Time', 'Cost']} rows={[
              ['Standard Shipping', '5–7 business days', 'Free on orders over rs 100; rs 15 otherwise'],
              ['Express Shipping', '2–3 business days', 'rs 25'],
              ['Overnight Delivery', 'Next business day', 'rs 45'],
              ['International', '10–21 business days', 'Calculated at checkout'],
            ]} />
            <p>Delivery times are estimates and not guaranteed. We are not responsible for delays caused by customs, weather, carrier issues, or other circumstances beyond our control.</p>
            <p>Risk of loss and title for products pass to you upon delivery to the carrier. If your order is lost in transit, contact us within <strong>14 days</strong> of the estimated delivery date.</p>
            <Callout type="info">Delivery addresses cannot be changed after an order is dispatched. Ensure your address is correct before confirming your order.</Callout>
          </Section>

          <Section id="returns" title="7. Returns & Refunds">
            <h3>7.1 Return Eligibility</h3>
            <p>We offer a <strong>30-day return policy</strong> from the date of delivery. To be eligible for a return:</p>
            <ul>
              <li>The item must be unused, in its original condition, and in original packaging.</li>
              <li>Tags must be attached where applicable.</li>
              <li>You must have proof of purchase (order confirmation email or receipt).</li>
            </ul>
            <h3>7.2 Non-Returnable Items</h3>
            <ul>
              <li>Digital products or downloadable software.</li>
              <li>Perishable goods.</li>
              <li>Items marked as "Final Sale" or "Non-Returnable" at the time of purchase.</li>
              <li>Items that have been used, damaged, or altered after delivery.</li>
            </ul>
            <h3>7.3 Refund Process</h3>
            <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds are processed to your original payment method within <strong>5–10 business days</strong>. Stripe processing times may vary.</p>
            <h3>7.4 Defective or Incorrect Items</h3>
            <p>If you receive a defective, damaged, or incorrect item, contact us within <strong>48 hours</strong> of delivery with photos. We will arrange a free return and send a replacement or issue a full refund at no cost to you.</p>
            <h3>7.5 Return Shipping</h3>
            <p>Return shipping costs are the customer's responsibility unless the return is due to our error (wrong item, defective product). We recommend using a trackable shipping service.</p>
          </Section>

          <Section id="prohibited" title="8. Prohibited Conduct">
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable local, national, or international law or regulation.</li>
              <li>Engage in fraudulent activity, including using stolen payment methods or false identities.</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its related systems.</li>
              <li>Transmit any unsolicited or unauthorised advertising or promotional material (spam).</li>
              <li>Introduce viruses, trojans, worms, or other malicious or technologically harmful material.</li>
              <li>Scrape, crawl, or systematically extract data from the Service without our written consent.</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
              <li>Place fraudulent or speculative orders.</li>
            </ul>
            <p>Violation of these prohibitions may result in immediate account termination and may be reported to law enforcement authorities.</p>
          </Section>

          <Section id="ip" title="9. Intellectual Property">
            <h3>9.1 Our Content</h3>
            <p>The Service and its original content, features, and functionality — including but not limited to text, graphics, logos, icons, images, audio clips, and software — are owned by MetaMart and are protected by copyright, trademark, and other intellectual property laws.</p>
            <h3>9.2 Limited Licence</h3>
            <p>We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Service for personal, non-commercial purposes. This licence does not include the right to:</p>
            <ul>
              <li>Reproduce, distribute, or publicly display any content from the Service.</li>
              <li>Modify or create derivative works based on the Service.</li>
              <li>Use any data mining, robots, or similar data gathering tools.</li>
              <li>Use the Service for any commercial purpose without our written consent.</li>
            </ul>
            <h3>9.3 Trademarks</h3>
            <p>"MetaMart" and the MetaMart logo are trademarks of the Company. You may not use our trademarks without prior written permission.</p>
          </Section>

          <Section id="disclaimer" title="10. Disclaimers">
            <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
            <ul>
              <li>WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.</li>
              <li>WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.</li>
              <li>WARRANTIES REGARDING THE ACCURACY OR COMPLETENESS OF ANY CONTENT.</li>
            </ul>
            <p>We do not warrant that the Service will meet your requirements or that any errors will be corrected. Your use of the Service is at your sole risk.</p>
          </Section>

          <Section id="liability" title="11. Limitation of Liability">
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, METAMART AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:</p>
            <ul>
              <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
              <li>Loss of profits, revenue, data, goodwill, or other intangible losses.</li>
              <li>Damages resulting from unauthorised access to or alteration of your data.</li>
              <li>Damages resulting from any third-party conduct on the Service.</li>
            </ul>
            <p>In no event shall our total liability to you for all claims exceed the greater of <strong>rs 100</strong> or the amount you paid to MetaMart in the <strong>12 months</strong> preceding the claim.</p>
            <p>Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.</p>
          </Section>

          <Section id="indemnification" title="12. Indemnification">
            <p>You agree to defend, indemnify, and hold harmless MetaMart and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to:</p>
            <ul>
              <li>Your violation of these Terms.</li>
              <li>Your use of the Service.</li>
              <li>Your violation of any third-party rights, including intellectual property or privacy rights.</li>
              <li>Any content you submit, post, or transmit through the Service.</li>
            </ul>
          </Section>

          <Section id="termination" title="13. Termination">
            <p>We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.</p>
            <p>Upon termination:</p>
            <ul>
              <li>Your right to use the Service will immediately cease.</li>
              <li>We may delete your account and associated data in accordance with our Privacy Policy.</li>
              <li>Any outstanding orders placed before termination will be fulfilled unless they involve fraudulent activity.</li>
              <li>Provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</li>
            </ul>
            <p>You may terminate your account at any time by contacting us. Termination does not entitle you to a refund of any amounts paid.</p>
          </Section>

          <Section id="governing-law" title="14. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions.</p>
            <p>For users in the European Union, nothing in these Terms affects your rights as a consumer under applicable EU consumer protection laws, which cannot be excluded by contract.</p>
          </Section>

          <Section id="disputes" title="15. Dispute Resolution">
            <h3>15.1 Informal Resolution</h3>
            <p>Before filing a formal dispute, you agree to contact us at <a href="mailto:devopspraharaj25@gmail.com" className="text-purple-300 hover:text-purple-200">devopspraharaj25@gmail.com</a> and attempt to resolve the dispute informally. We will try to resolve the issue within <strong>30 days</strong>.</p>
            <h3>15.2 Arbitration</h3>
            <p>If informal resolution fails, disputes shall be resolved by binding arbitration in accordance with the rules of the relevant arbitration body in India. The arbitration shall be conducted in English.</p>
            <h3>15.3 Class Action Waiver</h3>
            <p>You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.</p>
            <h3>15.4 EU Users</h3>
            <p>EU consumers may also use the European Commission's Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200">ec.europa.eu/consumers/odr</a>.</p>
          </Section>

          <Section id="changes" title="16. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by:</p>
            <ul>
              <li>Updating the "Last updated" date at the top of this page.</li>
              <li>Sending an email notification to registered users for material changes.</li>
              <li>Displaying a prominent banner on the website for 30 days.</li>
            </ul>
            <p>Your continued use of the Service after changes take effect constitutes your acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using the Service.</p>
          </Section>

          <Section id="contact" title="17. Contact Us">
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="not-prose mt-4 p-5 rounded-xl bg-white/4 border border-white/10 space-y-2 text-sm">
              <p><span className="text-zinc-400">Email:</span> <a href="mailto:devopspraharaj25@gmail.com" className="text-purple-300 hover:text-purple-200">devopspraharaj25@gmail.com</a></p>
              <p><span className="text-zinc-400">Contact form:</span> <Link href="/contact" className="text-purple-300 hover:text-purple-200">metamart.vercel.app/contact</Link></p>
              <p><span className="text-zinc-400">Response time:</span> <span className="text-zinc-300">Within 30 days</span></p>
            </div>
          </Section>

          <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-sm text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-purple-300 transition-colors">Privacy Policy →</Link>
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

function Callout({ children, type = 'note' }: { children: React.ReactNode; type?: 'note' | 'info' | 'warning' }) {
  const styles = {
    note:    'bg-white/4 border-white/10 text-zinc-300',
    info:    'bg-purple-500/8 border-purple-400/25 text-purple-200',
    warning: 'bg-amber-500/8 border-amber-400/25 text-amber-200',
  };
  return (
    <div className={`my-4 p-4 rounded-xl border text-sm leading-relaxed ${styles[type]}`}>
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
