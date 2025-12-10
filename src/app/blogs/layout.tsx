import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Blog - TruMailer Email Validation Insights',
    description: 'Expert guides and articles on email validation, verification, deliverability, and best practices for preventing spam and fraud.',
}

export default function BlogLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <div className="h-4 w-px bg-border" />
                        <Link href="/blogs" className="text-lg font-bold">
                            TruMailer Blog
                        </Link>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    )
}
