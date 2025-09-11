# TruMailer

TruMailer is a lightweight and fast **email validation API** built to help developers check whether an email address is valid, disposable, role-based, or spammy.  
It’s simple to use, easy to deploy, and designed for speed.

---

https://github.com/disposable-email-domains/disposable-email-domains/blob/main/allowlist.conf

https://github.com/disposable-email-domains/disposable-email-domains/blob/main/disposable_email_blocklist.conf


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

Pull requests are welcome!
For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License

MIT © 2025 TruMailer
