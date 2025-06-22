
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, Phone } from 'lucide-react';

export const GiftCardFAQ: React.FC = () => {
  const faqs = [
    {
      question: "How do I redeem my gift card?",
      answer: "Simply enter the gift card code at checkout on the partner website or app. For physical stores, show the code to the cashier or scan the QR code if available."
    },
    {
      question: "Do gift cards expire?",
      answer: "Most of our gift cards come with extended validity (1-3 years) or no expiry date. Check the specific terms for each brand during purchase."
    },
    {
      question: "Can I use multiple gift cards for one purchase?",
      answer: "Yes! You can combine multiple gift cards and also pay the remaining amount using other payment methods like bKash, cards, or cash."
    },
    {
      question: "What if I lose my digital gift card?",
      answer: "Don't worry! All digital gift cards are stored in your account. You can always re-download them from your purchase history or contact support for assistance."
    },
    {
      question: "Can I get a refund on gift cards?",
      answer: "Gift cards are generally non-refundable once purchased. However, unused gift cards may be eligible for refund within 7 days of purchase in special circumstances."
    },
    {
      question: "Are there any fees for using gift cards?",
      answer: "No! There are no additional fees for purchasing or using gift cards. The amount you pay is the exact value you'll receive on the card."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">❓ Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers! Find everything you need to know about our gift cards.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" variant="default">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat Support
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call: 16247
                </Button>
                <Button className="w-full" variant="outline">
                  📧 Email Support
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-bold mb-2">Gift Card Guide</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete tutorial on how to buy, send, and redeem gift cards
                </p>
                <Button variant="outline" className="w-full">
                  Watch Tutorial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
