"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
        <section className={cn("py-24 overflow-hidden bg-background", className)}>
            <div className="container px-4 md:px-6 mb-12">
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

            <div className="relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg bg-background md:shadow-none">
                <AnimatedList>
                    {reviews.map((item) => (
                        <ReviewCard key={item.id} review={item} />
                    ))}
                </AnimatedList>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
            </div>
        </section>
    );
}

const ReviewCard = ({ review }: { review: Review }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[500px] cursor-pointer overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 ease-in-out hover:scale-[1.03]",
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                    <span className="text-lg">😠</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
                        <span className="text-sm sm:text-lg">{review.author}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{review.role}</span>
                    </figcaption>
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <Star className="h-3 w-3 fill-muted text-muted" />
                        <Star className="h-3 w-3 fill-muted text-muted" />
                        <Star className="h-3 w-3 fill-muted text-muted" />
                        <Star className="h-3 w-3 fill-muted text-muted" />
                        <span className="ml-1 text-xs text-muted-foreground">1/5</span>
                    </div>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {review.content}
            </blockquote>
        </figure>
    );
};

// Animated List Implementation
export const AnimatedList = React.memo(
    ({
        className,
        children,
        delay = 2000, // Speed control
    }: {
        className?: string;
        children: React.ReactNode;
        delay?: number;
    }) => {
        const [index, setIndex] = useState(0);
        const childrenArray = React.Children.toArray(children);

        useEffect(() => {
            const interval = setInterval(() => {
                setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
            }, delay);

            return () => clearInterval(interval);
        }, [childrenArray.length, delay]);

        const itemsToShow = useMemo(() => {
            const result = childrenArray.slice(0, index + 1).reverse();
            return result;
        }, [index, childrenArray]);

        return (
            <div className={cn("flex flex-col items-center gap-4", className)}>
                <AnimatePresence>
                    {itemsToShow.map((item) => (
                        <AnimatedListItem key={(item as React.ReactElement).key}>
                            {item}
                        </AnimatedListItem>
                    ))}
                </AnimatePresence>
            </div>
        );
    },
);

AnimatedList.displayName = "AnimatedList";
import React from "react";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
    const animations = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, originY: 0 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 350, damping: 40 },
    };

    return (
        <motion.div {...animations} layout className="mx-auto w-full">
            {children}
        </motion.div>
    );
}
