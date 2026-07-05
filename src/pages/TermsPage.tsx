import { Shield, FileText, RefreshCw, AlertTriangle, Mail } from 'lucide-react';
import { AGENCY_EMAIL } from '../lib/data';

const sections = [
  {
    icon: FileText,
    title: 'Terms of Service',
    content: [
      'By engaging SHOPIJAVID for any project, you agree to the terms outlined in this document. These terms apply to all services provided including but not limited to branding, web development, marketing, content creation, and consultation.',
      'All projects begin with a discovery phase where scope, deliverables, timeline, and pricing are agreed upon in writing. Any changes to scope after the project begins may result in adjusted pricing and timeline.',
      'Clients are expected to provide necessary materials, access, and feedback in a timely manner. Delays caused by client side factors may extend project timelines accordingly.',
      'SHOPIJAVID reserves the right to decline projects that conflict with our values, involve illegal activities, or fall outside our area of expertise.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Refund Policy',
    content: [
      'We are committed to your satisfaction. If you are not satisfied with the initial concepts or direction of your project, we will work with you to make it right through revisions.',
      'Refunds are evaluated on a case by case basis. If work has not yet begun on your project, a full refund is available. If work has begun, refunds are prorated based on completed deliverables.',
      'No refunds are available for projects that have been completed and delivered. However, we offer revision rounds as part of every package to ensure you are happy with the final result.',
      'Monthly retainer services can be cancelled at any time with 30 days notice. No refunds are provided for partial months of retainer service.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Breach of Contract',
    content: [
      'A breach of contract occurs when either party fails to fulfill their obligations as agreed. The following outlines responsibilities and consequences.',
      'Client Responsibilities: Provide timely feedback, necessary access to platforms and accounts, payment according to agreed schedule, and clear communication of expectations.',
      'Agency Responsibilities: Deliver work according to agreed scope and timeline, maintain professional communication, protect client confidentiality, and provide quality work that meets professional standards.',
      'Service Limitations: We do not guarantee specific revenue results, search engine rankings, or conversion rates. We guarantee professional execution and best practice implementation. Results depend on many factors outside our control including market conditions, product quality, and pricing.',
      'Violation Penalties: If a client breaches contract by failing to pay or provide necessary cooperation, work may be paused until resolved. If SHOPIJAVID breaches contract by failing to deliver agreed work, the client is entitled to a prorated refund for undelivered portions.',
    ],
  },
  {
    icon: Shield,
    title: 'Intellectual Property',
    content: [
      'Every project created for a client remains the personal property of the client. SHOPIJAVID and its providers will not publicly display, reuse, or showcase any client work unless permission is explicitly granted by the client.',
      'Upon final payment, all deliverables including designs, code, content, and brand assets are transferred to the client in full.',
      'SHOPIJAVID retains the right to use the project in our portfolio only with explicit written permission from the client. We respect your privacy and competitive advantage.',
      'Third party assets used in projects (fonts, stock images, plugins) are subject to their respective licenses. We ensure all third party assets used are properly licensed for commercial use.',
    ],
  },
  {
    icon: FileText,
    title: 'Payment Terms',
    content: [
      'We offer flexible payment arrangements depending on the client region, accessibility, and available payment systems within their area. Our goal is to make collaboration smooth and accessible for every client regardless of location.',
      'Standard projects require a 50% deposit before work begins, with the remaining 50% due upon completion and before final file delivery.',
      'Monthly retainer services are billed at the beginning of each month for that month of service.',
      'These payment terms apply to Standard Plan and above. For flexible pricing structures and personalized service consultation, contact us directly for a proactive discussion.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Contract & Terms</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Our commitment to transparency. Everything you need to know about working with us, our policies, and your protections as a client.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page max-w-3xl space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="card-dark p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900/60 text-forest-400 ring-1 ring-forest-700/30">
                  <s.icon size={20} />
                </span>
                <h2 className="font-serif text-2xl font-semibold text-white">{s.title}</h2>
              </div>
              <div className="mt-5 space-y-4">
                {s.content.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-carbon-400">{p}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-forest-900 p-8 text-center ring-1 ring-forest-700/40">
            <h3 className="font-serif text-2xl font-semibold text-white">Questions about our terms?</h3>
            <p className="mt-2 text-carbon-300">We believe in clear, fair agreements. Reach out anytime.</p>
            <a href={`mailto:${AGENCY_EMAIL}?subject=Terms Inquiry`} className="btn-amber mt-5"><Mail size={16} /> Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
