import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { ActionIcon } from "rizzui";

declare global {
  interface Window {
    hljs: any;
  }
}

export function HowItWorks() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.hljs) {
      window.hljs.highlightAll();
    }
  }, []);



  const codeExample = `// Example API Request
const email = 'elon@tesla.com';
const response = await fetch(\`https://truemailer.strivio.world/api/v2/validate?email=\${email}\`, {
  method: 'GET',
  headers: {
    'x-api-key': 'tm_mvp_...'
  }
});

const data = await response.json();
console.log(data); 
// { is_valid: true, score: 0.95, ... }`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="how-it-works" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple integration for developers, instant results for marketers.
          </motion.p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10"></div>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-card p-6 rounded-xl border border-border shadow-sm"
          >
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md">1</div>
            <h3 className="text-xl font-bold mb-3">Upload or Connect API</h3>
            <p className="text-muted-foreground">
              Paste your API key into your code or upload a CSV file directly to the dashboard.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center bg-card p-6 rounded-xl border border-border shadow-sm"
          >
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md">2</div>
            <h3 className="text-xl font-bold mb-3">TrueMailer Verifies</h3>
            <p className="text-muted-foreground">
              Our engine instantly checks syntax, MX records, and detects disposable domains in real-time.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center bg-card p-6 rounded-xl border border-border shadow-sm"
          >
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md">3</div>
            <h3 className="text-xl font-bold mb-3">Send with Confidence</h3>
            <p className="text-muted-foreground">
              Download your clean list or let your app process valid emails only. Zero bounces.
            </p>
          </motion.div>
        </div>

        {/* API Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-800">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-xs font-mono">verify-email.ts</div>
              <ActionIcon
                size="sm"
                variant="text"
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </ActionIcon>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Works with Node.js, Python, PHP, Go, and Ruby. <a href="#" className="underline hover:text-primary">Read the docs →</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}