# Sahaj Visa

Independent prototype of a resumable Indian e-Tourist Visa journey. Not a government website. No real visa is issued.

Designed and built with ChatGPT. Runtime validation and payment behavior remain deterministic.

```bash
cp .env.example .env.local   # optional Redis persistence settings
npm install
npm run dev
```

Open [https://sahaj-visa.vercel.app](https://sahaj-visa.vercel.app) or run locally at [http://localhost:3000](http://localhost:3000).

**Demo login:** `demo@visa.test` / `sahaj-demo`

Working: form autosave, status timeline, audit log, deterministic rules pre-check, field help, and queue-based ETA messaging.
Mocked: payment gateway, biometrics, IVFRT, immigration clearance.
