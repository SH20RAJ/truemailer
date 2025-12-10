"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface Review {
    id: number;
    content: string;
    author: string;
    role: string;
}

const reviews: Review[] = [
    {
        id: 1,
        content:
            "Cleaned my email list with TrueMailer and suddenly my campaigns started performing. Now my boss thinks I’m a miracle worker and doubled my targets. Zero stars for increasing stress.",
        author: "@coldemailrookie",
        role: "self-proclaimed outreach ninja",
    },
    {
        id: 2,
        content:
            "TrueMailer removed 7,412 fake emails from my list. Now I have to accept that my ‘huge audience’ was mostly bots. Very disrespectful tool.",
        author: "@newsletter_dreamer",
        role: "hustler with imaginary followers",
    },
    {
        id: 3,
        content:
            "My bounce rate went from 28% to 0.8% overnight. Now clients expect results every week. Please bring the old chaos back.",
        author: "@agencybro",
        role: "professional excuse generator",
    },
    {
        id: 4,
        content:
            "Thanks to TrueMailer, my cold emails actually land in inboxes. Now strangers reply and want meetings. I miss the days when nobody responded.",
        author: "@freelancerlife",
        role: "certified introvert",
    },
    {
        id: 5,
        content:
            "Verified my entire list and TrueMailer exposed every disposable email I collected. My self-esteem has not recovered.",
        author: "@startupFounder",
        role: "guy who thought quantity > quality",
    },
    {
        id: 6,
        content:
            "TrueMailer improved my sender reputation so much that Gmail suddenly likes me. Now I can’t blame the algorithm for my low conversions.",
        author: "@marketer_max",
        role: "growth bro in denial",
    },
    {
        id: 7,
        content:
            "I used TrueMailer and now my outreach software calls me a ‘super sender.’ This kind of pressure should be illegal.",
        author: "@B2Bwarrior",
        role: "cold email philosopher",
    },
    {
        id: 8,
        content:
            "Your tool removed all risky emails and now my campaigns don’t get throttled. My boss saw the new numbers and made me lead the next project. Terrible career move.",
        author: "@workload_increase",
        role: "accidental high performer",
    },
    {
        id: 9,
        content:
            "I verified a client’s list and instantly made their deliverability jump. Now they think I’m some email wizard and keep texting me at 2am.",
        author: "@agency_guy",
        role: "did one good job, regrets everything",
    },
    {
        id: 10,
        content:
            "TrueMailer told me exactly which emails were trash. I felt judged. Also my conversion rate went up but that’s beside the point.",
        author: "@wannabe_creator",
        role: "emotionally attached to bad leads",
    },
];

export function OneStarReviews({ className }: { className?: string }) {
    return (
        <section className={cn("py-24 bg-background flex items-center justify-center flex-col", className)}>
            <div className="container px-4 md:px-6 mb-16">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
                        Unanimous Feedback
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                        1-Star Reviews
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        See what actual users are complaining about.
                    </p>
                </div>
            </div>

            <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-screen-xl mx-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="w-full md:w-[350px] lg:w-[380px]">
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const ReviewCard = ({ review }: { review: Review }) => {
    return (
        <div
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card p-6 border border-border h-full hover:border-primary/20",
                "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            )}
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800/50">
                        <span className="text-xl">😠</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-muted text-muted" />
                        <Star className="h-4 w-4 fill-muted text-muted" />
                        <Star className="h-4 w-4 fill-muted text-muted" />
                        <Star className="h-4 w-4 fill-muted text-muted" />
                    </div>
                </div>

                <blockquote className="text-base text-muted-foreground leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                </blockquote>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex flex-col">
                <span className="font-semibold text-foreground">{review.author}</span>
                <span className="text-sm text-muted-foreground">{review.role}</span>
            </div>
        </div>
    );
};
