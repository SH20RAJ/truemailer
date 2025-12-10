import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Email Validation Guides & Best Practices | TruMailer Blog',
    description: 'Comprehensive guides on email validation, deliverability, spam prevention, and security. Learn how to improve your email quality and protect your business.',
    openGraph: {
        title: 'TruMailer Blog - Email Validation & Deliverability Insights',
        description: 'Expert guides on email validation, verification, spam prevention, and deliverability best practices.',
        type: 'website',
    },
}

const articles = [
    {
        slug: 'comprehensive-email-validation-guide',
        title: 'The Complete Email Validation Guide: From Syntax to Deliverability',
        description: 'Master email validation with this comprehensive guide covering syntax checking, MX record verification, disposable email detection, and advanced validation techniques.',
        date: '2024-01-15',
        readTime: '12 min read',
        category: 'Guides',
    },
    {
        slug: 'disposable-email-detection',
        title: 'Disposable Email Detection: Protecting Your Platform from Temporary Emails',
        description: 'Learn how to detect and prevent disposable emails, understand why users use them, and implement effective blocking strategies to maintain data quality.',
        date: '2024-01-14',
        readTime: '10 min read',
        category: 'Security',
    },
    {
        slug: 'email-deliverability-best-practices',
        title: 'Email Deliverability Best Practices: Ensuring Your Emails Reach the Inbox',
        description: 'Maximize email deliverability with proven strategies for sender reputation, authentication protocols (SPF, DKIM, DMARC), and inbox placement optimization.',
        date: '2024-01-13',
        readTime: '15 min read',
        category: 'Deliverability',
    },
    {
        slug: 'smtp-vs-syntax-validation',
        title: 'SMTP Validation vs Syntax Validation: Understanding the Differences',
        description: 'Deep dive into email validation methods comparing SMTP-level verification with syntax checking, including pros, cons, and when to use each approach.',
        date: '2024-01-12',
        readTime: '8 min read',
        category: 'Technical',
    },
    {
        slug: 'role-based-email-detection',
        title: 'Role-Based Email Detection: Identifying Generic and Shared Mailboxes',
        description: 'Learn to identify role-based emails like info@, support@, and sales@, understand their impact on campaigns, and implement smart detection strategies.',
        date: '2024-01-11',
        readTime: '7 min read',
        category: 'Best Practices',
    },
    {
        slug: 'email-security-spam-prevention',
        title: 'Email Security & Spam Prevention: Advanced Techniques for 2024',
        description: 'Protect your email infrastructure with advanced security measures, spam prevention techniques, and fraud detection strategies for modern applications.',
        date: '2024-01-10',
        readTime: '11 min read',
        category: 'Security',
    },
]

export default function BlogsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Email Validation Insights
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Expert guides, best practices, and technical insights to help you master email validation and improve deliverability.
                    </p>
                </div>

                <div className="grid gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/blogs/${article.slug}`}
                            className="group bg-card/50 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    {article.category}
                                </span>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {article.readTime}
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {article.title}
                            </h2>
                            <p className="text-muted-foreground">
                                {article.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
