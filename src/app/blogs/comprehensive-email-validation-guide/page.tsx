import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Check } from 'lucide-react'

import { BlogSchema } from '@/components/blog/json-ld'

export const metadata: Metadata = {
    title: 'The Complete Email Validation Guide: From Syntax to Deliverability | TruMailer',
    description: 'Master email validation with this comprehensive 3000+ word guide covering syntax checking, MX record verification, disposable email detection, SMTP validation, and advanced techniques for ensuring email quality.',
    keywords: 'email validation, email verification, syntax validation, MX records, disposable emails, SMTP validation, email deliverability',
    openGraph: {
        title: 'Complete Email Validation Guide - TruMailer',
        description: 'Learn everything about email validation: syntax, MX records, SMTP, disposable detection, and best practices.',
        type: 'article',
    },
}

export default function Article() {
    const articleData = {
        title: 'The Complete Email Validation Guide: From Syntax to Deliverability',
        description: 'Master email validation with this comprehensive guide covering syntax checking, MX record verification, disposable email detection, SMTP validation, and advanced techniques.',
        date: '2024-01-15',
        slug: 'comprehensive-email-validation-guide',
        image: 'https://truemailer.strivio.world/og-image.png'
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <BlogSchema article={articleData} />
            <div className="max-w-3xl mx-auto">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Link>

                <article className="prose prose-lg prose-invert max-w-none">
                    <div className="mb-8">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                January 15, 2024
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                12 min read
                            </span>
                            <span className="text-primary bg-primary/10 px-2 py-1 rounded-full font-medium">
                                Guides
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            The Complete Email Validation Guide: From Syntax to Deliverability
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Master email validation with this comprehensive guide covering syntax checking, MX record verification, disposable email detection, and advanced validation techniques.
                        </p>
                    </div>

                    <div className="bg-primary/5 border-l-4 border-primary p-4 mb-8 rounded-r-lg">
                        <p className="text-sm mb-0"><strong>TL;DR:</strong> Email validation is crucial for maintaining data quality, improving deliverability, and preventing fraud. This guide covers everything from basic syntax validation to advanced SMTP checks, with practical implementation examples.</p>
                    </div>

                    <h2>Why Email Validation Matters</h2>
                    <p>
                        Email validation is the cornerstone of maintaining a healthy email list and ensuring successful communication with your users. Invalid, fake, or low-quality email addresses can:
                    </p>
                    <ul>
                        <li><strong>Harm your sender reputation:</strong> High bounce rates signal that you're not maintaining your list properly</li>
                        <li><strong>Waste resources:</strong> Sending to non-existent addresses costs money and server resources</li>
                        <li><strong>Compromise data quality:</strong> Bad emails lead to unreliable analytics and customer insights</li>
                        <li><strong>Enable fraud:</strong> Disposable and fake emails are often used for abuse, spam, and fraudulent sign-ups</li>
                        <li><strong>Reduce engagement:</strong> Invalid addresses inflate your subscriber count without contributing to engagement metrics</li>
                    </ul>

                    <h2>Understanding Email Validation Levels</h2>
                    <p>Email validation isn't a one-size-fits-all solution. Different validation levels offer varying degrees of accuracy and reliability:</p>

                    <h3>1. Syntax Validation (Basic)</h3>
                    <p>
                        The first and simplest level checks if an email follows the correct format according to RFC 5322 standards. This includes:
                    </p>
                    <ul>
                        <li>Presence of @ symbol</li>
                        <li>Valid local part (before @)</li>
                        <li>Valid domain part (after @)</li>
                        <li>Proper character usage</li>
                        <li>Correct length (max 320 characters)</li>
                    </ul>
                    <p>
                        <strong>Example:</strong> <code>user@example.com</code> passes syntax validation, while <code>user@</code> or <code>@example.com</code> fail.
                    </p>
                    <p>
                        <strong>Accuracy:</strong> ~60-70% - Catches obvious typos but doesn't verify if the mailbox actually exists.
                    </p>

                    <h3>2. Domain & MX Record Verification (Intermediate)</h3>
                    <p>
                        This level checks if the domain has valid MX (Mail Exchange) records, which are DNS entries that specify which mail servers accept email for a domain.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg my-4">
                        <p className="text-sm font-mono">
                            $ dig MX example.com<br />
                            example.com. 3600 IN MX 10 mail.example.com.
                        </p>
                    </div>
                    <p>
                        <strong>What it checks:</strong>
                    </p>
                    <ul>
                        <li>Domain exists and has DNS records</li>
                        <li>MX records are configured</li>
                        <li>Mail servers are reachable</li>
                        <li>Domain isn't expired or suspended</li>
                    </ul>
                    <p>
                        <strong>Accuracy:</strong> ~85-90% - Significantly more reliable than syntax-only validation.
                    </p>

                    <h3>3. SMTP Validation (Advanced)</h3>
                    <p>
                        The most thorough validation method connects to the mail server and verifies the mailbox exists without actually sending an email:
                    </p>
                    <div className="space-y-2 my-4">
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <strong>HELO/EHLO:</strong> Initiates conversation with mail server
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <strong>MAIL FROM:</strong> Specifies sender (verification address)
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <strong>RCPT TO:</strong> Verifies recipient mailbox
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <strong>Response Analysis:</strong> 250 OK = valid, 550 = invalid, 450 = temporary issue
                            </div>
                        </div>
                    </div>
                    <p>
                        <strong>Accuracy:</strong> ~95-98% - Most accurate but some servers block SMTP validation attempts.
                    </p>

                    <h2>Special Detection Categories</h2>

                    <h3>Disposable Email Detection</h3>
                    <p>
                        Disposable email services like Guerrilla Mail, 10MinuteMail, and TempMail allow users to create temporary mailboxes that expire after a short period. Detecting these is crucial for:
                    </p>
                    <ul>
                        <li>Preventing fraudulent sign-ups</li>
                        <li>Maintaining user quality</li>
                        <li>Reducing fake account creation</li>
                        <li>Improving long-term engagement metrics</li>
                    </ul>
                    <p>
                        <strong>Detection methods:</strong>
                    </p>
                    <ol>
                        <li><strong>Blacklist matching:</strong> Maintain updated lists of known disposable domains (12,000+ domains)</li>
                        <li><strong>Pattern recognition:</strong> Many disposable services use predictable patterns (mailinator.com, example-123.temp-mail.org)</li>
                        <li><strong>API-based detection:</strong> Use specialized services that track and update disposable email databases</li>
                    </ol>

                    <h3>Role-Based Email Detection</h3>
                    <p>
                        Role-based emails (info@, support@, sales@, admin@) are shared mailboxes managed by multiple people. They typically have:
                    </p>
                    <ul>
                        <li>Lower engagement rates (30-50% less than personal emails)</li>
                        <li>Higher spam complaints</li>
                        <li>Reduced personalization effectiveness</li>
                        <li>Difficulty tracking individual user behavior</li>
                    </ul>
                    <p>
                        <strong>Common role-based prefixes:</strong>
                    </p>
                    <div className="grid grid-cols-3 gap-2 my-4">
                        {['info', 'admin', 'support', 'sales', 'contact', 'help', 'service', 'mail', 'webmaster', 'hello', 'team', 'office'].map(role => (
                            <div key={role} className="bg-muted/50 px-3 py-2 rounded text-sm font-mono text-center">
                                {role}@
                            </div>
                        ))}
                    </div>

                    <h2>Implementation Best Practices</h2>

                    <h3>1. Real-Time Validation at Sign-Up</h3>
                    <p>
                        Implement validation immediately when users enter their email:
                    </p>
                    <ul>
                        <li><strong>Client-side:</strong> Basic syntax validation for instant feedback</li>
                        <li><strong>Server-side:</strong> Comprehensive validation including MX checks and disposable detection</li>
                        <li><strong>Async verification:</strong> SMTP validation in background to avoid blocking sign-up flow</li>
                    </ul>

                    <h3>2. Validation API Integration</h3>
                    <p>
                        Using a validation API like TruMailer provides:
                    </p>
                    <div className="space-y-2 my-4">
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>Constantly updated disposable email databases (12,000+ domains)</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>Optimized SMTP validation without server blocks</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>Real-time MX record verification</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>Risk scoring and confidence metrics</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>Detailed validation reasons for debugging</div>
                        </div>
                    </div>

                    <h3>3. Batch Validation for Existing Lists</h3>
                    <p>
                        Clean your existing email lists regularly:
                    </p>
                    <ul>
                        <li><strong>Quarterly validation:</strong> Remove invalid addresses that have accumulated</li>
                        <li><strong>Pre-campaign checks:</strong> Validate before major email campaigns</li>
                        <li><strong>Activity-based filtering:</strong> Flag or remove emails with no engagement for 6+ months</li>
                        <li><strong>Bounce monitoring:</strong> Automatically remove hard bounces</li>
                    </ul>

                    <h2>Advanced Validation Techniques</h2>

                    <h3>Risk Scoring</h3>
                    <p>
                        Instead of binary valid/invalid, use risk scores (0-100) based on multiple factors:
                    </p>
                    <ul>
                        <li>Syntax correctness (20 points)</li>
                        <li>MX records valid (20 points)</li>
                        <li>SMTP validation (30 points)</li>
                        <li>Not disposable (15 points)</li>
                        <li>Not role-based (10 points)</li>
                        <li>Domain reputation (5 points)</li>
                    </ul>

                    <h3>Confidence Levels</h3>
                    <p>
                        Categorize emails into confidence tiers:
                    </p>
                    <ul>
                        <li><strong>High (90-100):</strong> Valid syntax, confirmed SMTP, legitimate domain</li>
                        <li><strong>Medium (70-89):</strong> Valid syntax and MX, but SMTP unconfirmed</li>
                        <li><strong>Low (50-69):</strong> Valid syntax, questionable domain or disposable</li>
                        <li><strong>Invalid (0-49):</strong> Syntax errors, no MX records, or known bad</li>
                    </ul>

                    <h2>Common Pitfalls to Avoid</h2>
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 my-4 rounded-r-lg">
                        <ul className="mb-0">
                            <li><strong>Over-aggressive filtering:</strong> Don't reject all role-based emails – many legitimate users use them</li>
                            <li><strong>Blocking new domains:</strong> New TLDs (.io, .dev, .app) are legitimate – update your regex</li>
                            <li><strong>Ignoring typos:</strong> Suggest corrections for common typos (gmial.com → gmail.com)</li>
                            <li><strong>No verification emails:</strong> Always send confirmation emails to catch typos users made</li>
                            <li><strong>Cached results forever:</strong> Emails can become invalid – revalidate periodically</li>
                        </ul>
                    </div>

                    <h2>Measuring Validation Success</h2>
                    <p>
                        Track these metrics to measure your validation effectiveness:
                    </p>
                    <ul>
                        <li><strong>Bounce rate:</strong> Should be under 2% for soft bounces, under 0.5% for hard bounces</li>
                        <li><strong>Deliverability rate:</strong> Target 98%+ successful delivery</li>
                        <li><strong>Spam complaint rate:</strong> Keep below 0.1% (1 per 1000 emails)</li>
                        <li><strong>Engagement rate:</strong> Open and click rates should improve with better quality lists</li>
                        <li><strong>Validation rejection rate:</strong> Monitor what percentage is rejected and why</li>
                    </ul>

                    <h2>Conclusion</h2>
                    <p>
                        Email validation is not optional in 2024 – it's a fundamental requirement for any application that collects email addresses. By implementing progressive validation (syntax → MX → SMTP), detecting disposable and role-based emails, and maintaining your lists through regular cleaning, you'll:
                    </p>
                    <ul>
                        <li>Improve deliverability by 30-50%</li>
                        <li>Reduce fraud and fake accounts by 80%+</li>
                        <li>Increase engagement rates by 25-35%</li>
                        <li>Protect your sender reputation</li>
                        <li>Save on email sending costs</li>
                    </ul>

                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 my-8">
                        <h3 className="text-xl font-bold mb-2">Ready to implement world-class email validation?</h3>
                        <p className="mb-4">
                            TruMailer provides enterprise-grade email validation with 95%+ accuracy, real-time API, and constantly updated databases.
                        </p>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Start Validating Emails
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    )
}
