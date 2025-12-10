import { Metadata } from "next";
import PlaygroundClient from "@/components/dashboard/playground/playground-client";

export const metadata: Metadata = {
    title: "Playground - TrueMailer",
    description: "Test email validation in real-time.",
};

export default function Page() {
    return <PlaygroundClient />;
}
