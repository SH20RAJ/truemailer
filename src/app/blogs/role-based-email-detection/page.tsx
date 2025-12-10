import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

import { BlogSchema } from '@/components/blog/json-ld'

export const metadata: Metadata = {
    title: 'Role-Based Email Detection: Identifying Generic Mailboxes | TruMailer',
    description: 'Learn to identify role-based emails (info@, support@, sales@), understand their impact on email campaigns, and implement smart detection.',
}

export default function Article() {
    const articleData = {
        title: 'Role-Based Email Detection: Identifying Generic and Shared Mailboxes',
        description: 'Learn to identify role-based emails like info@, support@, and sales@, understand their impact, and implement detection strategies.',
        date: '2024-01-11',
        slug: 'role-based-email-detection',
        image: 'https://truemailer.strivio.world/og-image.png'
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <BlogSchema article={articleData} />
            <div className="max-w-3xl mx-auto">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Link>
                <article className="prose prose-lg prose-invert max-w-none">
                    <div className="mb-8">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />January 11, 2024</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />7 min read</span>
                            <span className="text-primary bg-primary/10 px-2 py-1 rounded-full font-medium">Best Practices</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Role-Based Email Detection: Identifying Generic and Shared Mailboxes</h1>
                    </div>

                    <h2>What Are Role-Based Emails?</h2>
                    <p>Role-based emails are generic addresses assigned to a function rather than a person (info@, support@, sales@). These shared mailboxes typically:</p>
                    <ul>
                        <li>Are monitored by multiple people</li>
                        <li>Have 40-60% lower engagement rates</li>
                        <li>Generate more spam complaints</li>
                        <li>Don't represent individual user behavior</li>
                    </ul>

                    <h2>Common Role-Based Prefixes</h2>
                    <div className="grid grid-cols-3 gap-2 my-4">
                        {['info', 'admin', 'support', 'sales', 'contact', 'help', 'service', 'billing', 'accounts', 'office', 'team', 'general'].map(role => (
                            <code key={role} className="bg-muted/50 px-3 py-2 rounded text-sm text-center">{role}@</code>
                        ))}
                    </div>

                    <h2>Why They Impact Email Marketing</h2>
                    <ul>
                        <li><strong>Lower engagement:</strong> 30-50% less opens/clicks vs personal emails</li>
                        <li><strong>Higher complaints:</strong> Shared inboxes more likely to mark as spam</li>
                        <li><strong>Reduced personalization:</strong> Can't target individual interests</li>
                        <li><strong>Skewed analytics:</strong> Multiple people accessing same address</li>
                    </ul>

                    <h2>Detection Strategy</h2>
                    <p>Implement multi-layered role-based detection:</p>
                    <ol>
                        <li><strong>Prefix matching:</strong> Check against known role-based prefixes</li>
                        <li><strong>Pattern recognition:</strong> dept@, group@, team@ formats</li>
                        <li><strong>Domain context:</strong> admin@ legit for tech companies, suspicious for individuals</li>
                        <li><strong>Allow exceptions:</strong> Some businesses legitimately use these</li>
                    </ol>

                    <h2>When to Accept Role-Based Emails</h2>
                    <p>Don't blindly reject all role-based addresses. Accept when:</p>
                    <ul>
                        <li>B2B context where decision-makers use these</li>
                        <li>Enterprise customers with specific team addresses</li>
                        <li>Partnership or integration contacts</li>
                        <li>Support/service-related signups</li>
                    </ul>

                    <h2>Best Practices</h2>
                    <ul>
                        <li><strong>Segment separately:</strong> Track role-based emails in distinct lists</li>
                        <li><strong>Adjust expectations:</strong> Lower engagement is normal</li>
                        <li><strong>Different content:</strong> Send business-focused vs personal content</li>
                        <li><strong>Request personal email:</strong> Offer incentives for individual addresses</li>
                    </ul>

                    <p>TruMailer automatically detects role-based emails and provides confidence scores to help you make informed decisions.</p>

                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 my-8">
                        <h3 className="text-xl font-bold mb-2">Improve Your Email Quality</h3>
                        <p className="mb-4">Detect role-based emails and segment your lists for better engagement.</p>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Start Free
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    )
}
