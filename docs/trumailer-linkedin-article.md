# Stop Wasting Send Credits: Meet TruMailer (Email Validation That Actually Ships)

If you’re onboarding users, running campaigns, or fighting fake signups, bad emails quietly burn cash and wreck deliverability. TruMailer fixes that with a fast, privacy‑first email validation API your team can plug in within minutes.

---

## Why this matters now

- Protect deliverability: Keep your sender reputation clean and your emails out of spam.
- Cut fraud and noise: Catch throwaways and role-based aliases at the gate.
- Save money: Stop paying to send to bad addresses and clean lists before campaigns.
- Move faster: Simple REST API, clear JSON, real-time results.

## What TruMailer checks

- Syntax validity (RFC-style checks)
- Disposable/temporary domain detection (tempmail, 10minutemail, etc.)
- Role-based aliases (admin@, info@, support@)
- MX records presence (can the domain receive mail?)
- Risk scoring with confidence
- Allowlist signals (trusted domains)
- Personal overrides (block/allow per team)

## Who it’s for

- Growth, Marketing, Ops: Fewer bounces, better segment performance, cleaner analytics, happier CRM.
- Product & Platform Teams: Prevent junk accounts, keep marketplace supply/demand high-signal, reduce moderation load.
- Developers: A single POST with an API key returns everything you need to decide “let in or challenge”.

---

## How developers integrate (5 minutes)

- Endpoint: `POST https://truemailer.strivio.world/api/v2/validate`
- Headers: `Content-Type: application/json`, `X-API-Key: tm_your_api_key_here`
- Body:

```json
{"email":"test@example.com"}
```

### cURL

```bash
curl -X POST https://truemailer.strivio.world/api/v2/validate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tm_your_api_key_here" \
  -d '{"email": "test@example.com"}'
```

### JavaScript (fetch)

```js
const res = await fetch('https://truemailer.strivio.world/api/v2/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'tm_your_api_key_here'
  },
  body: JSON.stringify({ email: 'test@example.com' })
});
const result = await res.json();
console.log(result);
```

### Python (requests)

```python
import requests

res = requests.post(
  'https://truemailer.strivio.world/api/v2/validate',
  headers={
    'Content-Type': 'application/json',
    'X-API-Key': 'tm_your_api_key_here'
  },
  json={'email': 'test@example.com'}
)
print(res.json())
```

### Sample response

```json
{
  "email": "test@example.com",
  "domain": "example.com",
  "valid": true,
  "syntax_valid": true,
  "disposable": false,
  "role_based": false,
  "mx_records": true,
  "confidence_score": 0.95,
  "risk_level": "low",
  "reason": "Valid email"
}
```

---

## Bonus: quick tests and batch

- Quick GET (no key, great for previews): `GET https://truemailer.strivio.world/api/validate?email=hello@example.com`
- Batch cleanup: `POST https://truemailer.strivio.world/api/validate-batch` with `{"emails":["a@x.com","b@y.com"]}`

## Business results you can expect

- Fewer failed signups and support tickets
- Lower bounce rates and higher inbox placement
- Cleaner audiences for smarter targeting
- Real-time protection against temp emails and spammy domains
- Visibility and control: usage analytics and API key management

## Privacy-first and developer-friendly

- No data hoarding. Just validation, scored.
- Clear JSON fields, predictable schema, and stable endpoints.
- Works at the edge, built for speed under load.

## High‑impact use cases

- Signup and onboarding gates (score + allow/challenge/deny)
- Newsletter and lifecycle email hygiene
- B2B form enrichment (filter role-based, prioritize personal)
- Marketplace and fintech trust layers (reduce burner accounts)
- Bulk list cleanup before big sends

## How to get started today

- Generate your API key in the dashboard
- Test in Playground with live responses
- Drop the POST call in your signup flow or queue processor
- Add batch cleanup to your CRM or data pipelines

## Pro tip for teams

- Set thresholds by funnel stage. Example: auto‑deny disposables at signup; queue “medium risk” for double opt‑in; fast‑track allowlisted domains for enterprise.
- Use personal overrides to align with your go‑to‑market (whitelist strategic accounts, block known abusers).

---

If you care about deliverability, growth efficiency, or platform trust, TruMailer pays for itself the moment you stop emailing a bad list.

Want the code or a live demo? Comment “validate” or DM and I’ll share the docs link and a quick-start snippet.

#email #deliverability #saas #growth #devtools #api #engineering #product #privacy

