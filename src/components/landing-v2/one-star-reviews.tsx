"use client";

import { motion } from "framer-motion";
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

export function OneStarReviews() {
    return (
        <section className="py-24 bg-red-50 dark:bg-red-950/20 overflow-hidden">
            <div className="container px-4 md:px-6 mb-12">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                        ⚠️ Warning: Highly Effective
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-red-900 dark:text-red-100">
                        1-Star Reviews
                    </h2>
                    <p className="max-w-[700px] text-red-700/80 dark:text-red-300/70 md:text-xl">
                        See what actual users are complaining about.
                    </p>
                </div>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                <Marquee direction="left" speed={40}>
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </Marquee>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-red-50 dark:from-black to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-red-50 dark:from-black to-transparent"></div>
            </div>
        </section>
    );
}

function Marquee({
    children,
    direction = "left",
    speed = 50,
}: {
    children: React.ReactNode;
    direction?: "left" | "right";
    speed?: number;
}) {
    return (
        <div className="flex w-full overflow-hidden whitespace-nowrap mask-image-linear-to-r">
            <motion.div
                className="flex min-w-full shrink-0 items-stretch gap-4 px-2"
                animate={{
                    x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 1000 / speed,
                }}
            >
                {children}
            </motion.div>
            <motion.div
                className="flex min-w-full shrink-0 items-stretch gap-4 px-2"
                animate={{
                    x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 1000 / speed,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="relative h-full w-[350px] md:w-[400px] flex-none rounded-xl border border-red-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-red-900 dark:bg-red-950/40">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-red-500 text-red-500" />
                    <Star className="h-5 w-5 fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800" />
                    <Star className="h-5 w-5 fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800" />
                    <Star className="h-5 w-5 fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800" />
                    <Star className="h-5 w-5 fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800" />
                </div>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 font-medium whitespace-normal">
                    &ldquo;{review.content}&rdquo;
                </p>
                <div className="mt-auto">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {review.author}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {review.role}
                    </p>
                </div>
            </div>
        </div>
    );
}
