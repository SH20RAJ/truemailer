import { useState } from 'react';
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from "lucide-react";
import { ActionIcon } from "rizzui";

export function HowItWorks() {
  const [copied, setCopied] = useState(false);

  const steps = [
    {
      title: "Make API Request",
      description: "Send an HTTP GET request with the email parameter",
      icon: "1"
    },
    {
      title: "Multi-Layer Validation",
      description: "Our system performs comprehensive checks using multiple data sources",
      icon: "2",
      details: [
        "Syntax validation using RFC standards",
        "MX record DNS lookup verification",
        "Real-time disposable email detection",
        "Role-based email identification",
        "Community-reported spam database",
        "Daily indexed spam patterns",
        "GitHub disposable-emails-list integration",
        "Live temp email provider monitoring"
      ]
    },
    {
      title: "Receive Response",
      description: "Get detailed validation results in JSON format with confidence scores",
      icon: "3"
    }
  ];

  const codeExample = `// Example API Request
const response = await fetch('https://truemailer.strivio.world/v1/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});

const data = await response.json();
console.log(data.isValid); // true or false`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExample);
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
              <div className="h-full bg-card/50 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 rounded-xl">
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <p className="text-muted-foreground">{step.description}</p>
                  {step.details && (
                    <ul className="space-y-2 mt-4">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2 mt-2 flex-shrink-0"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Validation Sources */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card/50 border border-primary/20 rounded-xl">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center mb-2">Our Validation Data Sources</h3>
              <p className="text-muted-foreground text-center">
                We continuously update our validation database from multiple reliable sources
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 0 014 0zM7 10a2 2 0 11-4 0 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Community Reports</h3>
                  <p className="text-sm text-muted-foreground">User-submitted spam reports verified by our team</p>
                </div>

                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">GitHub Integration</h3>
                  <p className="text-sm text-muted-foreground">Open-source disposable email lists from GitHub repos</p>
                </div>

                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Live monitoring of temp email providers like 10minutemail</p>
                </div>

                <div className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Daily Indexing</h3>
                  <p className="text-sm text-muted-foreground">Automated daily scans for new spam patterns and domains</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-card/50 border border-primary/20 max-w-4xl mx-auto overflow-hidden rounded-xl">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 text-center">Simple Integration</h3>
              <p className="text-center text-muted-foreground mb-6">
                Start validating emails in minutes with our easy-to-use API.
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.75rem',
                    fontSize: '0.9rem',
                    padding: '1.5rem',
                    background: '#1e1e1e',
                  }}
                  showLineNumbers={true}
                >
                  {codeExample}
                </SyntaxHighlighter>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ActionIcon
                    size="sm"
                    variant="solid"
                    onClick={copyToClipboard}
                    className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 backdrop-blur-sm"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </ActionIcon>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="pt-4 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Response Fields</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
              <code className="bg-muted px-2 py-1 rounded mr-2">valid_syntax</code> - Email format validity
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
              <code className="bg-muted px-2 py-1 rounded mr-2">mx_found</code> - Domain mail server exists
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
              <code className="bg-muted px-2 py-1 rounded mr-2">disposable</code> - Temporary email service
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
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
    </section>
  );
}