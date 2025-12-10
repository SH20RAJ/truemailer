import { Metadata } from "next";
import { HelpImproveClient } from "@/components/landing/help-improve-client";

export const metadata: Metadata = {
    title: "Contribute to TrueMailer Database | Help Improve Email Validation",
    description:
        "Help improve TrueMailer's accuracy by submitting new disposable domains or reporting false positives. Join the open-source community.",
    keywords:
        "email validation connection, report spam domain, open source contribution",
};

export default function HelpImprovePage() {
    return <HelpImproveClient />;
}
