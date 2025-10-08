# TruMailer

[![CI](https://github.com/sh20raj/trumailer/actions/workflows/ci.yml/badge.svg)](https://github.com/sh20raj/trumailer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

TruMailer is a lightweight and fast **email validation API** built to help developers check whether an email address is valid, disposable, role-based, or spammy.  
It’s simple to use, easy to deploy, and designed for speed.

---
## 📋 Data Sources

TruMailer leverages community-maintained datasets to provide accurate email validation:

- **[Allowlist Domains](https://github.com/disposable-email-domains/disposable-email-domains/blob/main/allowlist.conf)** - Trusted email providers that should not be blocked
- **[Disposable Email Blocklist](https://github.com/disposable-email-domains/disposable-email-domains/blob/main/disposable_email_blocklist.conf)** - Comprehensive list of temporary email providers

These datasets are regularly updated to ensure optimal detection accuracy.

## 🚀 Features
- ✅ Syntax validation (RFC compliant)
- 📨 MX record lookup (checks if domain can receive mail)
- 🛑 Disposable email detection (tempmail, 10minutemail, etc.)
- 👥 Role-based email detection (admin@, support@, info@, etc.)
- ⚡ REST API with JSON responses
- 🔒 Lightweight and privacy-first (no data stored)

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/sh20raj/trumailer.git
cd trumailer
````

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm run dev
```

By default, it runs at `http://localhost:3000`.

---

## 🔌 API Usage

### Validate an email

```http
GET /validate?email=example@gmail.com
```

### Response

```json
{
  "email": "example@gmail.com",
  "valid_syntax": true,
  "mx_found": true,
  "disposable": false,
  "role_based": false
}
```

---

## 🛠 Tech Stack

* [Hono](https://hono.dev/) (fast edge framework)
* Cloudflare Workers / Node.js
* DNS lookups for MX records

---

## 📌 Roadmap

* [ ] Add spam score detection
* [ ] Add SMTP handshake check
* [ ] Dashboard & analytics
* [ ] NPM package wrapper

---

## 🤝 Contributing

We welcome contributions of all kinds! Please read CONTRIBUTING.md for how to set up your dev environment, coding guidelines, and the PR process. By participating, you agree to abide by the CODE_OF_CONDUCT.md.

---

## 📄 License

This project is licensed under the MIT License — see LICENSE for details.
