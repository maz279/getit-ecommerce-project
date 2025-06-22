
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const GroupBuyFAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How does group buying work?",
      answer: "Group buying allows multiple people to purchase the same product together to get volume discounts. The more people join the group, the lower the price becomes for everyone."
    },
    {
      question: "What happens if a group doesn't reach its target?",
      answer: "If a group doesn't reach the minimum number of participants within the time limit, all payments are automatically refunded to participants within 3-5 business days."
    },
    {
      question: "How long do I have to wait for my order?",
      answer: "Once a group reaches its target, we process the bulk order immediately. Delivery typically takes 3-7 days depending on the product and your location."
    },
    {
      question: "Can I cancel my participation in a group?",
      answer: "Yes, you can cancel your participation anytime before the group reaches its target. Your payment will be refunded within 2-3 business days."
    },
    {
      question: "Are the products authentic?",
      answer: "Absolutely! We only work with verified suppliers and authorized dealers. All products come with manufacturer warranties and authenticity guarantees."
    },
    {
      question: "How do I invite friends to join my group?",
      answer: "You can share your group link via social media, WhatsApp, email, or SMS. We also provide promotional materials to help you reach the target faster."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">❓ Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about group buying</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Group Buy FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
