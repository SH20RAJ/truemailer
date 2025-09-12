"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function QuickIntegration() {
  const [activeTab, setActiveTab] = useState("nodejs");
  const [copied, setCopied] = useState(false);

  const codeExamples = {
    nodejs: `// Install: npm install axios

const axios = require('axios');

async function validateEmail(email) {
  try {
    const response = await axios.get(
      \`https://api.truemailer.com/validate?email=\${email}\`
    );
    return response.data;
  } catch (error) {
    console.error('Validation failed:', error.message);
    return null;
  }
}

// Usage
validateEmail('user@example.com')
  .then(result => {
    if (result && result.valid) {
      console.log('Valid email address');
    } else {
      console.log('Invalid email address');
    }
  });`,

    python: `# Install: pip install requests

import requests

def validate_email(email):
    try:
        response = requests.get(
            f"https://api.truemailer.com/validate?email={email}"
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Validation failed: {e}")
        return None

# Usage
result = validate_email("user@example.com")
if result and result.get("valid"):
    print("Valid email address")
else:
    print("Invalid email address")`,

    php: `<?php
// No additional installation required for basic cURL

function validateEmail($email) {
    $url = "https://api.truemailer.com/validate?email=" . urlencode($email);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        return null;
    }
}

// Usage
$result = validateEmail("user@example.com");
if ($result && $result["valid"]) {
    echo "Valid email address";
} else {
    echo "Invalid email address";
}
?>`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quick-integration" className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Quick Integration
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started with TrueMailer in just a few lines of code. Choose your preferred language below.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTab === "nodejs" ? "default" : "outline"}
                  onClick={() => setActiveTab("nodejs")}
                  className={activeTab === "nodejs" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}
                >
                  Node.js
                </Button>
                <Button
                  variant={activeTab === "python" ? "default" : "outline"}
                  onClick={() => setActiveTab("python")}
                  className={activeTab === "python" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}
                >
                  Python
                </Button>
                <Button
                  variant={activeTab === "php" ? "default" : "outline"}
                  onClick={() => setActiveTab("php")}
                  className={activeTab === "php" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}
                >
                  PHP
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-auto border-primary/50 text-primary hover:bg-primary/10"
                >
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-6 rounded-lg overflow-x-auto text-sm">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}