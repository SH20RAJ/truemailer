"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  const [copied, setCopied] = useState(false);

  const steps = [
    {
      title: "Make API Request",
      description: "Send an HTTP GET request with the email parameter",
      icon: "1"
    },
    {
      title: "Validation Process",
      description: "TrueMailer performs comprehensive validation checks",
      icon: "2"
    },
    {
      title: "Receive Response",
      description: "Get detailed validation results in JSON format",
      icon: "3"
    }
  ];

  const apiExample = {
    request: `GET https://api.truemailer.com/validate?email=user@example.com`,
    response: `{
  "email": "user@example.com",
  "valid_syntax": true,
  "mx_found": true,
  "disposable": false,
  "role_based": false,
 "spammy": false,
  "valid": true
}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiExample.request);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How TrueMailer Works
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Integrating TrueMailer into your application is simple and straightforward.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 border-primary/20 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                      {step.icon}
                    </div>
                    <CardTitle className="ml-3 text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* API Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">API Request & Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Request</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    {apiExample.request}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Response</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    {apiExample.response}
                  </pre>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Response Fields</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                      <code className="bg-muted px-2 py-1 rounded mr-2">valid_syntax</code> - Email format validity
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-purple-40 mr-2"></span>
                      <code className="bg-muted px-2 py-1 rounded mr-2">mx_found</code> - Domain mail server exists
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-40 mr-2"></span>
                      <code className="bg-muted px-2 py-1 rounded mr-2">disposable</code> - Temporary email service
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-purple-40 mr-2"></span>
                      <code className="bg-muted px-2 py-1 rounded mr-2">role_based</code> - Generic email address
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                      <code className="bg-muted px-2 py-1 rounded mr-2">spammy</code> - Known spam email pattern
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                      <code className="bg-muted px-2 py-1 rounded mr-2">valid</code> - Overall validation result
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}