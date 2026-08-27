# Sahaj Visa

Independent prototype of a resumable Indian e-Tourist Visa journey. Not a government website. No real visa is issued.

```bash
cp .env.example .env.local   # add OPENAI_API_KEY for the vision pre-check
npm install
npm run dev
```

Open [https://sahaj-visa.vercel.app](https://sahaj-visa.vercel.app) or run locally at [http://localhost:3000](http://localhost:3000).

**Demo login:** `demo@visa.test` / `sahaj-demo`

Working: form autosave, status timeline, audit log, rules + OpenAI vision pre-check, field co-pilot, honest ETA phrasing.  
Mocked: payment gateway, biometrics, IVFRT, immigration clearance.
