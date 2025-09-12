"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "Integration", href: "#quick-integration" },
        { name: "Test API", href: "/test-api" },
        { name: "Help Improve", href: "/help-improve" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-gradient">
                        TrueMailer
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" asChild>
                            <Link href="https://github.com/sh20raj/truemailer" target="_blank">
                                GitHub
                            </Link>
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                            <Link href="#get-started">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-6 w-6 text-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden py-4 border-t border-primary/20"
                    >
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex flex-col space-y-2 pt-4">
                                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" asChild>
                                    <Link href="https://github.com/sh20raj/truemailer" target="_blank">
                                        GitHub
                                    </Link>
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                                    <Link href="#get-started">Get Started</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
}