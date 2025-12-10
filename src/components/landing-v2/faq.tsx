"use client";

import { motion } from "framer-motion";


// Actually, I'll implement a simple custom accordion to avoid dependency issues if the shadcn one isn't nearby or configured exactly.
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
    const faqs = [
        {
            question: "How accurate is TrueMailer?",
            answer: "TrueMailer provides 99.9% accuracy by combining syntax checks, DNS/MX verification, and real-time SMTP connection tests without sending actual emails."
        },
        {
            question: "Do you detect disposable emails?",
            answer: "Yes, we maintain a real-time database of temporary and disposable email providers (like 10minutemail, guerrilla mail) and block them instantly."
        },
        {
            question: "Does this improve deliverability?",
            answer: "Absolutely. By removing invalid and risky emails before you send, you reduce bounce rates, which protects your sender reputation and ensures more emails land in the primary inbox."
        },
        {
            question: "Is my data safe?",
            answer: "Yes. We operate on a strict privacy-first policy. We do not store, sell, or log the emails you verify. Your data is processed in memory and discarded immediately."
        },
        {
            question: "Is there a free plan?",
            answer: "Yes! You can verify up to 100 emails per month for free, with full access to our API and dashboard."
        },
        {
            question: "How fast is the API?",
            answer: "Our globally distributed infrastructure ensures response times under 50ms for most requests, making it suitable for real-time user verification in sign-up forms."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <p className="text-muted-foreground text-lg">Everything you need to know about TrueMailer.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="border border-border bg-card rounded-xl overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left hover:bg-muted/50 transition-colors"
            >
                <span className="text-lg font-semibold pr-8">{question}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {answer}
                </div>
            </div>
        </motion.div>
    );
}
