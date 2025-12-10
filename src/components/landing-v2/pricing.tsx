"use client";

import { motion } from "framer-motion";
import { Button } from "rizzui";
import Link from "next/link";
import { Check } from "lucide-react";

export function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for testing and small projects",
            features: [
                "100 verifications / month",
                "Real-time API access",
                "Disposable email detection",
                "Community support"
            ],
            cta: "Start for Free",
            popular: false,
            href: "/dashboard"
        },
        {
            name: "Pro",
            price: "$29",
            period: "/month",
            description: "For growing apps and businesses",
            features: [
                "10,000 verifications / month",
                "Bulk CSV verification",
                "Priority API access",
                "Advanced risk scoring",
                "Email support"
            ],
            cta: "Get Started",
            popular: true,
            href: "/dashboard"
        },
        {
            name: "Business",
            price: "$99",
            period: "/month",
            description: "For high-volume senders",
            features: [
                "50,000 verifications / month",
                "Everything in Pro",
                "99.9% Uptime SLA",
                "Dedicated account manager",
                "Phone support"
            ],
            cta: "Get Started",
            popular: false,
            href: "/dashboard"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Unlimited scale and custom needs",
            features: [
                "Unlimited verifications",
                "Custom contracts",
                "On-premise deployment",
                "Custom integration support",
                "24/7 Priority support"
            ],
            cta: "Contact Sales",
            popular: false,
            href: "mailto:support@truemailer.strivio.world"
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl md:text-5xl font-bold mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Simple, Transparent Pricing
                    </motion.h2>
                    <motion.p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Start for free, upgrade as you grow. No credit card required to start.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex flex-col p-6 rounded-2xl border ${plan.popular
                                    ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
                                    : "border-border bg-card hover:border-primary/30 transition-colors"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                            </div>

                            <div className="flex-1 mb-6">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start text-sm">
                                            <Check className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                size="lg"
                                variant={plan.popular ? "solid" : "outline"}
                                className={`w-full rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "border-border"}`}
                                as={Link}
                                href={plan.href}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full text-sm text-muted-foreground">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Start for free — no credit card required
                    </div>
                </div>
            </div>
        </section>
    );
}
