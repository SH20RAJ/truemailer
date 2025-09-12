"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";

export function QuickIntegration() {
  const [activeTab, setActiveTab] = useState<"nodejs" | "python" | "php">("nodejs");

  const codeExamples = {
    nodejs: {
      code: `// Single email validation using fetch
const validateEmail = async (email) => {
  try {
    const response = await fetch(\`https://truemailer.vercel.app/api/validate?email=\${encodeURIComponent(email)}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Validation failed:', error);
    return null;
  }
};

// Usage
const result = await validateEmail('test@temp-mail.org');
console.log(\`Email: \${result.email}\`);
console.log(\`Valid: \${result.valid}\`);
console.log(\`Disposable: \${result.disposable}\`);
console.log(\`Risk Level: \${result.risk_level}\`);

// Batch validation
const validateBatch = async (emails) => {
  try {
    const response = await fetch('https://truemailer.vercel.app/api/validate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails })
    });
    return await response.json();
  } catch (error) {
    console.error('Batch validation failed:', error);
    return null;
  }
};

// Validate multiple emails at once
const batchResult = await validateBatch([
  'user@gmail.com', 
  'spam@temp-mail.org', 
  'admin@company.com'
]);
console.log(\`Valid emails: \${batchResult.summary.valid}/\${batchResult.summary.total}\`);`,
      filename: 'validate-email.js'
    },

    python: {
      code: `# Install: pip install requests
import requests
import json

def validate_email(email):
    try:
        response = requests.get(
            f"https://truemailer.vercel.app/api/validate?email={email}"
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Validation failed: {e}")
        return None

# Usage
result = validate_email("user@example.com")
if result and result.get("valid"):
    print("✅ Valid email address")
    print(json.dumps(result, indent=2))
else:
    print("❌ Invalid email address")

# Batch validation function
def validate_batch(emails):
    try:
        response = requests.post(
            "https://truemailer.vercel.app/api/validate-batch",
            json={"emails": emails}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Batch validation failed: {e}")
        return None

# Validate multiple emails at once
emails = ['user@gmail.com', 'spam@temp-mail.org', 'admin@company.com']
batch_result = validate_batch(emails)
if batch_result and batch_result['success']:
    print(f"Valid: {batch_result['summary']['valid']}/{batch_result['summary']['total']}")
    for result in batch_result['results']:
        status = "✅" if result['valid'] else "❌"
        print(f"{status} {result['email']} - {result['risk_level'].upper()}")`,
      filename: 'validate_email.py'
    },

    php: {
      code: `<?php
// No additional installation required for basic cURL

function validateEmail($email) {
    $url = "https://truemailer.vercel.app/api/validate?email=" . urlencode($email);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'TrueMailer-PHP-Client/1.0');
    
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
    echo "✅ Valid email address\\n";
    echo json_encode($result, JSON_PRETTY_PRINT);
} else {
    echo "❌ Invalid email address\\n";
}

// Batch validation
$emails = ['user1@example.com', 'spam@temp-mail.org', 'admin@company.com'];
foreach ($emails as $email) {
    $result = validateEmail($email);
    $status = ($result && $result["valid"]) ? "✅ Valid" : "❌ Invalid";
    echo "$email: $status\\n";
}
?>`,
      filename: 'validate-email.php'
    }
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
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={codeExamples[activeTab].code}
                language={activeTab === 'nodejs' ? 'javascript' : activeTab}
                filename={codeExamples[activeTab].filename}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}