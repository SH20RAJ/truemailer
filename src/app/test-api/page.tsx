import { Metadata } from "next";
import { TestAPIClient } from "@/components/landing/test-api-client";

export const metadata: Metadata = {
    title: "Test Email Validation API Online | TrueMailer",
    description:
        "Try TrueMailer's free email validation API. Check email deliverability, detect disposable emails, and verify MX records in real-time.",
    keywords: "email validation demo, check email validity, free email verifier, API sandbox",
};

export default function TestAPIPage() {
    return <TestAPIClient />;
}
