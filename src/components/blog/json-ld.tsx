import Head from 'next/head';

export function BlogSchema({ article }: { article: any }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.description,
        "image": article.image || "https://truemailer.strivio.world/og-image.png",
        "author": {
            "@type": "Organization",
            "name": "TruMailer Team",
            "url": "https://truemailer.strivio.world"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TruMailer",
            "logo": {
                "@type": "ImageObject",
                "url": "https://truemailer.strivio.world/logo.png"
            }
        },
        "datePublished": article.date,
        "dateModified": article.date,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://truemailer.strivio.world/blogs/${article.slug}`
        }
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </section>
    );
}
