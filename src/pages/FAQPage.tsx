import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQPage() {
  const faqs = [
    {
      category: 'Ordering',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Simply browse our products, select your options and quantity, upload your artwork if you have it, and proceed to checkout. You can also request design services if you need help with your artwork.',
        },
        {
          q: 'What file formats do you accept?',
          a: 'We accept PDF, PNG, JPEG, SVG, AI, and EPS files. For best results, we recommend PDF files with embedded fonts and 300 DPI resolution.',
        },
        {
          q: 'Can I order samples before placing a large order?',
          a: 'Yes! We offer sample packs for most of our products. Contact our team to request samples of paper stocks, finishes, or printed samples.',
        },
        {
          q: 'How do I reorder a previous order?',
          a: 'If you have an account, you can view your order history and click "Reorder" on any previous order. The same specifications and artwork will be used.',
        },
      ],
    },
    {
      category: 'Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard UK shipping takes 3-5 business days after production. Express shipping (1-2 business days) is available at checkout. International shipping times vary by destination.',
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on all UK orders over £50.',
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely. Once your order ships, you\'ll receive an email with a tracking number that you can use to monitor your delivery.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times are calculated at checkout.',
        },
      ],
    },
    {
      category: 'Production',
      questions: [
        {
          q: 'What is your turnaround time?',
          a: 'Turnaround times vary by product. Most items ship within 3-5 business days after artwork approval. Some products like business cards can be ready in as little as 24 hours with express service.',
        },
        {
          q: 'Will I see a proof before printing?',
          a: 'Yes, we provide digital proofs for all orders. You\'ll need to approve the proof before we start production. This ensures everything looks exactly as you expect.',
        },
        {
          q: 'What if there\'s a problem with my order?',
          a: 'We stand behind our work. If there\'s a defect or error on our part, we\'ll reprint your order at no charge. Contact our support team within 7 days of receiving your order.',
        },
      ],
    },
    {
      category: 'Design',
      questions: [
        {
          q: 'Do you offer design services?',
          a: 'Yes! Our in-house design team can help with logo design, layout assistance, and complete brand systems. Submit a design request and we\'ll get back to you within 24 hours.',
        },
        {
          q: 'What are your design rates?',
          a: 'Design rates vary based on project complexity. Simple layout help starts at £75, while full brand systems are quoted on a project basis. Contact us for a custom quote.',
        },
        {
          q: 'How many revisions are included?',
          a: 'Most design projects include up to 3 rounds of revisions. Additional revisions can be arranged at an hourly rate.',
        },
      ],
    },
    {
      category: 'Payment',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for large orders.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely. We use industry-standard SSL encryption and never store your full credit card details. All payments are processed through secure, PCI-compliant providers.',
        },
        {
          q: 'Do you offer credit accounts for businesses?',
          a: 'Yes, we offer credit accounts for established businesses. Contact our sales team to apply for a business account.',
        },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="rp-micro-label block mb-4">SUPPORT</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            Find answers to common questions about our products, ordering process, and shipping.
          </p>
        </motion.div>
        
        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-12"
        >
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-xl font-semibold text-[#F6F8FF] mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="rp-card border-0 px-6"
                  >
                    <AccordionTrigger className="text-left text-[#F6F8FF] hover:text-[#3B6CFF] transition-colors py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#A6B0C5] pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </motion.div>
        
        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[#A6B0C5] mb-4">Can't find what you're looking for?</p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 text-[#3B6CFF] hover:underline"
          >
            Contact our support team
          </a>
        </motion.div>
      </div>
    </div>
  );
}
