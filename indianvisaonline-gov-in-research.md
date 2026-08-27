# indianvisaonline.gov.in — Research Dossier

**Compiled:** 28 August 2026  
**Subject:** [https://indianvisaonline.gov.in/](https://indianvisaonline.gov.in/)  
**Scope:** Public complaints, official documentation and system architecture, tech-oriented social-media criticism, and statistics on time/opportunity loss.

This file is a full write-up of the research conversation: the original brief, the official record, user and engineer criticism, numbers that can be sourced, and the gaps that remain unpublished.

---

## 0. Original brief

Research the Indian government visa portal and return:

1. Flaws and issues raised by the general public / ordinary citizens
2. Official documentation, system architecture, and technical background published by the government
3. Niche / tech-oriented criticism on social media
4. Statistics on how many people lost time or opportunity because the site malfunctioned or was insufficient
5. Open-web scrape of official docs plus the rest of the above

**Method note:** There is no public system-architecture white paper for this website. What follows is everything official that exists, plus complaints, tech criticism, and numbers that can actually be sourced. Claims that cannot be sourced are marked as such.

---

## 1. What the site is

[indianvisaonline.gov.in](https://indianvisaonline.gov.in/) is the **only authorised Government of India portal** for visa application to India.

| Service | Who runs it | URL |
|---|---|---|
| Regular / paper visa | Indian Missions/Post (Ministry of External Affairs) | [https://indianvisaonline.gov.in/](https://indianvisaonline.gov.in/) |
| e-Visa | Bureau of Immigration, Ministry of Home Affairs | [https://indianvisaonline.gov.in/evisa/tvoa.html](https://indianvisaonline.gov.in/evisa/tvoa.html) |
| e-Arrival card (disembarkation, **not** a visa) | BOI / MHA | [https://indianvisaonline.gov.in/earrival/](https://indianvisaonline.gov.in/earrival/) |
| Afghan nationals portal | BOI | [https://indianvisaonline.gov.in/avisa](https://indianvisaonline.gov.in/avisa) |
| Bureau of Immigration | MHA | [https://boi.gov.in](https://boi.gov.in) |
| Self-declaration (civil aviation) | Ministry of Civil Aviation | [https://airsuvidha.civilaviation.gov.in/](https://airsuvidha.civilaviation.gov.in/) |

**Footer on the live e-visa page:**

> Content managed by Bureau of Immigration, Ministry of Home Affairs. Designed & Developed by NIC.  
> Updated as on May 16, 2019.

That 2019 stamp was still on the live page as of late August 2026.

### Official helpdesk (from Indian missions, not a public API doc)

| Channel | Contact |
|---|---|
| Phone | `+91-11-24300666`, `+91-8278087808` |
| Email | `indian-evisa@gov.in`, `indiatvoa@gov.in` |
| Payment helpdesk (SBI ePay) | `+91-022-65361671` |
| Paid number (listed on portal) | `1800 91-40-6717-4100` |

Missions and consulates repeatedly state: **they do not process e-visas.** Enquiries bounce back to this portal.

---

## 2. Official documentation and architecture

**The government has not published a public technical architecture document, API spec, or source-code description for this website.** What exists is policy plus the IVFRT programme that sits behind it.

### 2.1 The actual backend: IVFRT

The portal is the public face of **IVFRT — Immigration, Visa, Foreigners Registration & Tracking**.

| Fact | Official record |
|---|---|
| Type | Mission Mode Project under the National e-Governance Plan (NeGP) |
| Nodal ministry | Ministry of Home Affairs (MHA) |
| Implementing agency | **National Informatics Centre (NIC)**, with MHA |
| First Cabinet approval | 13 May 2010, CCEA, **₹1,011 crore**, originally till September 2014 |
| Revised (2015) | **₹638.90 crore**; actual spend **₹613.28 crore**; timeline extended to 31 March 2017, then 31 March 2021 |
| 2021–2026 continuation | Cabinet 19 January 2022, **₹1,365 crore** |
| 2026–2031 continuation | Cabinet 25 March 2026, **₹1,800 crore** |
| Coverage | **117** Immigration Check Posts, **15** FRROs, **854** FROs / SPs / DCPs |
| Stated next-phase work | “revamping core application architecture”, unified digital platforms, mobile, kiosks, data-centre upgrade |

**Primary official source:** [PIB PRID 2245088](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2245088) — *Cabinet approves Continuation of the Immigration, Visa, Foreigners Registration & Tracking (IVFRT) Scheme*, 25 March 2026.

**Official purpose** (Cabinet note): interlink visa issuance, immigration clearance, and foreigners’ registration into one database; facilitate genuine travellers; strengthen security after the **Immigration and Foreigners Act, 2025**.

**Official performance claims** (same PIB):

- **91.24% of e-Visa applications cleared within 72 hours** over the past five years
- “100% contactless and faceless visa process”
- Immigration clearance cut from 5–6 minutes to 2.5–3 minutes (including biometrics)
- Fast Track Immigration – Trusted Traveller Programme (FTI-TTP) e-gates at 13 major airports: ~30 seconds

Those 72-hour numbers **clash with 2025–26 traveller reports** of 7–10 day waits. Both can be true: a five-year average can hide a recent backlog.

**Next-phase focus (official, 2026–2031):**

1. Emerging technology innovations (mobile-based services, self-service kiosks)
2. Transformation of core infrastructure (Immigration Posts, FRROs, data centres)
3. Technology and service optimization (unified digital platforms, **revamp of core application architecture**, network and deployment frameworks)

The March 2026 Cabinet note is the closest official admission that the **current core application architecture is not fit**.

### 2.2 Budget history (IVFRT)

| Period | Outlay | Notes |
|---|---|---|
| 2010 – Sep 2014 (original) | ₹1,011 crore | CCEA 13 May 2010 |
| 2015 revision, till Mar 2021 | ₹638.90 crore | Spent ₹613.28 crore |
| 1 Apr 2021 – 31 Mar 2026 | ₹1,365 crore | Cabinet 19 Jan 2022 |
| 1 Apr 2026 – 31 Mar 2031 | ₹1,800 crore | Cabinet 25 Mar 2026 |

### 2.3 What the government actually publishes as “documentation”

There is no architecture PDF. The official corpus is:

1. **The portal itself**
   - e-Visa: [https://indianvisaonline.gov.in/evisa/tvoa.html](https://indianvisaonline.gov.in/evisa/tvoa.html)
   - Regular visa instructions: [https://indianvisaonline.gov.in/visa/instruction.html](https://indianvisaonline.gov.in/visa/instruction.html)
   - Regular visa hub: [https://indianvisaonline.gov.in/visa/](https://indianvisaonline.gov.in/visa/)
   - Sample e-Visa form: `images/SampleForm.pdf` (relative on the e-visa host)
   - Visa processing time (missions): [https://indianvisaonline.gov.in/visa/visa-processing.html](https://indianvisaonline.gov.in/visa/visa-processing.html)
2. **MHA e-Visa page** — [https://www.mha.gov.in/en/commoncontent/e-visa](https://www.mha.gov.in/en/commoncontent/e-visa) (links back to the portal: instructions, country list, airports, seaports)
3. **BOI** — [https://boi.gov.in](https://boi.gov.in)
4. **PIB / Cabinet notes** on IVFRT (closest thing to an architecture statement)
5. **Mission circulars** warning about fake sites
6. **Lok Sabha answers** (e.g. MoS Home Bandi Sanjay Kumar on e-visa volumes)
7. **MHA Annual Reports** — [https://www.mha.gov.in/en/documents/annual-reports](https://www.mha.gov.in/en/documents/annual-reports)

### 2.4 Official e-Visa process (as the government describes it)

Four steps on the portal:

1. Apply online — upload photo and passport page
2. Pay e-Visa fee online — credit / debit / payment wallet
3. Receive Electronic Travel Authorisation (ETA) by email
4. Print ETA and present it at a designated Immigration Check Post, where the e-Visa is stamped

**e-Visa categories (portal / missions):**

- e-Tourist Visa
- e-Business Visa
- e-Medical Visa
- e-Medical Attendant Visa
- e-Conference Visa
- e-Student Visa / e-Student-Dependent
- e-Family Visa
- e-Transit Visa
- e-Miscellaneous Visa
- e-Ayush / Attendant (later addition)
- Film, mountaineering, production-investment and other sub-categories added 2025

**Hard rules the site / missions state:**

- Apply **at least 4 days** before arrival (tourist/business). Fee paid later than that is not processed.
- e-Medical / attendant / conference: apply minimum 4 days ahead, with a 120-day arrival window.
- Photo: JPEG, typically **10 KB–300 KB / 1 MB**, square, plain light background, full face, no borders.
- Passport scan: PDF, tight size caps (often 10–300/500 KB).
- **No edits after submit.**
- Payment status can take **up to 2 hours** to update; wait before retrying.
- Bank transaction charge **2.5%** extra.
- Fees **non-refundable**, including on rejection.
- Passport must have at least **six months** validity from date of arrival.

**Published fee examples (Consulate General of India, San Francisco):**

| Product | Fee (USD) |
|---|---|
| 30-day e-Tourist (July–March) | 25 |
| 30-day e-Tourist (April–June) | 10 |
| One-year e-Tourist | 40 |
| Five-year e-Tourist | 80 (missions have also listed $200 in other years — check live portal) |

### 2.5 Official technical requirements (still on the live e-visa page, 2026)

> This site is best viewed in Mozilla Firefox, Google Chrome, Internet Explorer (Windows) version 9.0 and above.  
> The applicant must also have Adobe Acrobat Reader version 7.0 or higher installed on your PC in order to download and print the completed application form.  
> This website is compatible with Android and IOS devices.

That line is the government’s own technical spec:

- **Internet Explorer 9** shipped in 2011 and is dead
- **Adobe Acrobat Reader 7.0** shipped in 2005

It is the single most revealing official sentence on the stack.

### 2.6 Regular-visa system behaviour (official instructions)

From [instruction.html](https://indianvisaonline.gov.in/visa/instruction.html):

1. Applicant opens https://indianvisaonline.gov.in
2. Selects the Indian Mission
3. Fills the form standardised by the Ministry
4. On submit, the system **automatically generates an Application Id**
5. Applicant chooses whether to seek appointment and pay online
6. If yes: pick slot, fee calculated (visa + service charge + VAT), ePayment via service-provider gateway
7. If no, or if the Mission has no ePayment: print, visit Mission / IVAC with documents
8. Form is **one person only**; no modifications after submission
9. Save-without-submit is offered; Application Id is the handle for all later communication

### 2.7 What can be inferred technically (not officially documented)

From the live site, user reports, and Hacker News (June 2026 Economist thread):

- Classic **server-rendered Java/JSP-style government app** (NIC house style), session-cookie based
- **Bootstrap 5** on some pages (HN observation)
- **Text CAPTCHA** (Economist: “a bot-prevention tool that these days only thwarts humans”)
- **Marquee / scrolling text**, pop-ups, ministerial portraits
- Payment hop through **Indian bank aggregators** (SBI ePay, Axis Bank) plus a PayPal-labelled path that often lands on an Indian bank page, not PayPal
- Short server sessions → **“Session expired”** mid-form
- State lost if the app server recycles under load (HN: “crashes between page loads losing state when the server restarts”)

NIC has **not** published the language, database, or hosting diagram.

### 2.8 Related official systems

| System | Role |
|---|---|
| IVFRT | Core immigration/visa/registration platform |
| e-FRRO | Foreigners Regional Registration Office (extensions, registration) — separate from this portal, also widely criticised |
| Indian Visa Su-Swagatam app | Official mobile app; e-Arrival card |
| APIS | Advance Passenger Information (IVFRT-era module; not described on the public visa site) |
| Form C | Hosts of foreigners report arrivals via BOI |
| FTI-TTP | Trusted traveller e-gates at 13 airports |

### 2.9 e-Visa history (policy, not engineering)

Launch and expansion, condensed from public / Wikipedia / mission pages:

- **27 November 2014:** e-Tourist Visa (then “visa on arrival” / ETA) for ~28 countries, modelled on Australia’s ETA, sitting on IVFRT
- **2015:** renamed e-Tourist Visa after criticism of the “visa on arrival” label; rapid country expansion
- **April 2017:** split into tourist / business / medical
- **2019:** 1-year multiple-entry; 30-day $25 product
- **2020–22:** COVID suspensions and restorations (UK, Canada, several Asian nationalities)
- **January 2025:** student and dependent e-Visa categories
- **October 2025:** e-Arrival card (digital disembarkation) optional, then pushed as the replacement for the paper card; fill within 72 hours before arrival
- **2025–26:** more ports, more categories (transit, film, mountaineering, production-investment); 14 additional seaports notified April 2026

---

## 3. What ordinary users actually complain about

This is consistent across Reddit (`r/travel`, `r/visas`, `r/india`), TripAdvisor, Facebook travel groups, and Trustpilot — from 2018 through August 2026. The complaints have not changed; they have only gotten louder.

### 3.1 Recurring failures

| Failure | What users report |
|---|---|
| **Crashes / 500 / freeze** | Form dies mid-fill. “Please try after some time.” Whole site down for hours. |
| **Session expired** | Kick-out with no save. Restart from page 1. |
| **Payment failure** | Foreign Visa/Mastercard declined; PayPal path is actually Axis/SBI; money deducted, status not updated; 30-minute lockout after each fail; “nineteenth attempt” (Russell). |
| **Photo/passport upload** | Valid JPEG/PDF rejected for pixels, KB, “not square”, “not 350×350”. Hours of resizing. |
| **CAPTCHA** | Distorted text, 2–3 retries even when correct. |
| **No human support** | 24×7 numbers don’t pick up. Email replies days later, if at all. Missions say “we don’t handle e-visa.” |
| **Processing vs advertised 72 hours** | Late 2025–2026: **7–10 working days**, sometimes 2 weeks. Official rule is still “apply 4 days before.” |
| **Bizarre UI bugs** | Business-visa form showing **tallest mountain in each Indian state** (Nov 2025). |
| **Data model** | “List every country visited in 10 years” but **max 20 countries** — refuse-entry threat vs hard cap. |
| **Mobile** | “Mobile devices were a total waste of time.” |
| **Unnecessary fields** | Long form, “filled with unnecessary questions.” |
| **No refund** | Failed, late, or unused applications: fee is sunk. |

### 3.2 Trustpilot

- URL: [https://www.trustpilot.com/review/indianvisaonline.gov.in](https://www.trustpilot.com/review/indianvisaonline.gov.in)
- Score: **1.3 / 5**
- Volume: **72 reviews** (32 in the last 12 months as of late August 2026)
- AI summary of those reviews: crashes, data not saved, photo rejection, no human, hours-to-days to finish one form, “complete overhaul” requested

*(Do not confuse with `indianvisa.online` / other lookalike domains — those are third-party or clone sites, also poorly rated.)*

### 3.3 Representative public threads

| Date | Forum | gist |
|---|---|---|
| Feb 2018 | TripAdvisor | Site crashes; session expired; known device/OS/browser incompatibility |
| 2023–24 | `r/travel` | “worst portal in the world”; 2 hours; timeouts; unreadable CAPTCHA; Axis Bank + Visa eventually worked |
| Jan 2025 | `r/visas` | Site issue mid-apply; “resume” and re-enter payment; blamed on server traffic |
| Oct 2025 | Facebook travel group | “I am trying to apply for a visa but the site is not working. Is there another site?” — answer: no |
| Jan 2026 | `r/travel` | “Absolute terrible experience… almost took us **3 days** to lodge 2 applications” |
| 2025–26 | `r/visas` | Payment timeout then “payment must be done 4 days before arrival” lockout |
| Aug 2026 | Facebook | eVisa website not loading; advice: Chrome, clear cache, keep retrying |
| Dec 2025 | Universal Weather (bizav) | Processing now 8–10 days; **pilot unable to travel**, last-minute crew rotation |

### 3.4 Typical traveller quotes (public)

- “Worst portal in the world — 2 hours, timeouts, unreadable CAPTCHA.” (`r/travel`)
- “Almost took us 3 days to lodge 2 applications.” (Jan 2026)
- “Payment timed out… now the system says payment must be done 4 days before arrival.” (`r/visas`)
- “Support line rarely picks up.” (`r/travel`)
- “The website crashed twice when I tried to pay the $40 processing fee by credit card, third time worked using PayPal.” (`r/visas`)
- “I’ve been sitting here trying for the past two hours.” (`r/travel`, $25 fee)
- Facebook India-travel groups, Oct 2025 and Aug 2026: “site is not working / not loading” as a standing post type.

### 3.5 Workarounds the public has reverse-engineered

These are **not** official, but they are the folk knowledge:

1. Use **desktop Chrome**, not mobile, not Safari
2. Clear cookies/cache completely; try incognito
3. Pre-resize photo to exact pixel and KB caps before starting
4. Write down the **Application Id** the moment it appears
5. For payment: try **Axis Bank + Visa/Mastercard**, not the first PayPal-labelled option
6. After a failed charge, **wait 30–120 minutes** before retry (portal lockout + 2-hour status lag)
7. Do not hit Back on the bank page (infinite loop)
8. Apply **10–14 days** before travel, not the official 4
9. If the site is down, there is **no alternative official site** — agencies are either clones or overchargers who submit on this same portal

---

## 4. Niche / tech-oriented criticism

### 4.1 Raymond Russell — 25 November 2025

US investor [@raymondopolis](https://x.com/raymondopolis/status/1993378856200290392).

**Engagement (as fetched):** ~**1.73 million views**, 7,181 likes, 748 reposts, 379 quotes, 655 replies.

> (1) I love India  
> (2) Anybody who applies for an e-visa to India knows the website is always comically, profoundly, embarrassingly broken  
>  
> It looks like it was written in 2003, kicks you out randomly without saving your work, won't charge your credit card until your nineteenth attempt  
>  
> But this is a new one—halfway through the business visa application, it displays a list of the tallest peaks in each Indian state??  
>  
> Come on folks, I'm just trying to invest in your country!

Follow-up posts in the same thread:

- “You must tell us all countries you've visited in the last 10 years / Or we may refuse you entry / But you can only tell us max 20 countries”
- “Here is a list of payment options, but they don't really work that well for foreigners”
- “I've always thought of the Indian e-visa website as a filtering test: if you can survive it, you'll be fine in India.”

Covered by:

- [Hindustan Times](https://www.hindustantimes.com/trending/us/indians-hit-back-after-american-calls-india-s-e-visa-site-comically-broken-101764220190829.html)
- [Times of India](https://timesofindia.indiatimes.com/world/us/us-investor-slams-comically-broken-e-visa-application-process-in-india-if-you-can-survive-it-/articleshow/125613765.cms)
- [American Bazaar](https://americanbazaaronline.com/2025/11/27/looks-like-2003-american-investor-mocks-indias-e-visa-portal-comically-470699/)

Russell also said the web form typically takes him **~4 hours** each year; he prefers applying physically at a consulate.

### 4.2 The Economist — 28 June 2026

[“Why can’t India’s government build a decent website?”](https://www.economist.com/asia/2026/06/28/why-cant-indias-government-build-a-decent-website) (Ashoka column).

Opens by telling the reader to take paracetamol, sit at a **laptop** (not a phone), and try the Indian visa site. Describes government sites as a:

> “sadistic mix of pop-ups, moving text, flashing graphics, ministerial portraits and antique elements like text-based Captchas, a bot-prevention tool that these days only thwarts humans.”

Argument: India is an IT exporter whose own official web is a failure of **procurement and bureaucracy**, not talent.

Indian coverage of the column: [India Today, 2 July 2026](https://www.indiatoday.in/india/story/india-visa-website-critique-the-economist-ashoka-column-debate-government-digital-services-upi-aadhaar-2938245-2026-07-02).

### 4.3 Hacker News (same Economist article)

Thread: [https://news.ycombinator.com/item?id=48713332](https://news.ycombinator.com/item?id=48713332)

Engineers, not tourists:

- Forms lose state; payment must be retried many times
- Timeouts because “the extremely slow server somewhere in India” doesn’t answer before the page dies
- Scrolling marquee text “haven’t seen that in forever”
- Site “built with Bootstrap 5 fwiw”
- Root cause they name: **lowest-bidder NIC/TCS-style outsourcing**, not missing engineers
- “Under the tiniest load it crashes between page loads losing state when the server restarts”
- “Indian government tenders usually go to the cheapest bidder, not the most practical one”

### 4.4 Other tech / public voices

| Who | What they said |
|---|---|
| **Anish Gawande** (NCP-SP) | “a ninth-standard student with Claude Code would probably vibe code a better website than the e-visa website (and, honestly, most government websites).” |
| **Sabeer Bhatia** (Hotmail) | “a broken system.” “No wonder India is falling behind some African countries.” |
| **Steve SC** on X (1 Jan 2024) | “The Indian eVisa website is the worst website I have used in 20 years. It is an abomination of poor design, broken logic, and asks for the most unnecessary information. How can a country known for IT put out such garbage?” |
| **@sv_techie** (9 Jul 2025) | “India e-visa payment portal and status after paying is so broken.. Simple things even in year 2025, Indian govt can't get it right.” |
| **Badri Sridharan**, engineering lead (24 Aug 2026) | “The e-visa website is garbage. All they should need is to scan your passport and issue the visa. Instead they want to know a bunch of unnecessary details and the website is flaky.” |
| **@indiaemerges** quoting The Economist (29 Jun 2026) | Not just e-visa — many gov sites feel 20 years old; MoSPI shows it *is* possible when the process isn’t broken. |
| **Travel entrepreneur Ankit Sawant** | Industry has raised UX for years; the Economist piece was “inevitable.” |
| **SL Kanthan** | “How come The Economist notices this obvious problem in India, but millions of Indian software engineers don't complain or fix it?” |

### 4.5 Counter-argument that also exists

- UPI, Aadhaar, DigiLocker, Passport Seva are cited as proof India *can* ship; the visa portal is a specific IVFRT/NIC failure, not a national-capability failure.
- Others note US visa scheduling (`usvisascheduling.com`) is also bad.
- One founder claimed he applied “>10 times in 10 mins flat” and blamed user literacy.
- Indian replies to Russell often redirected to how painful the **US/Schengen** visa is for Indians.

That doesn’t make this site good. It does mean the social-media fight is partly nationalist, not purely technical.

---

## 5. Statistics — what exists, and what does not

### 5.1 Volume (official or official-cited)

| Figure | Source |
|---|---|
| **9,644,567** e-visas issued, 2020 – 20 July 2025 | MoS Home (Bandi Sanjay Kumar), Lok Sabha / PIB-cited |
| **31.74 lakh** (~3.174 million) e-visas to tourists, 1 Nov 2024 – 30 Nov 2025 | [PIB PRID 2202210](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202210), Bureau of Immigration |
| **1,697,175** e-visas in 2017 alone | Official tables (UK 18%, US 12%, France 5.5%, China 5.4%, Russia 5.2%) |
| **174** eligible nationalities / territories | same Lok Sabha answer |
| **91.24%** cleared in 72 hours (5-year average) | Cabinet/PIB 25 Mar 2026 |
| FTAs **9.51 million (2023)**, **9.95 million (2024)** vs **10.93 million (2019)** | Ministry of Tourism / India Tourism Data Compendium 2025 |
| **₹1,800 crore** IVFRT 2026–31 | Cabinet 25 Mar 2026 |
| **32 airports + growing seaport list** for e-Visa entry | MHA / The Hindu Apr 2026 (32 airports and 33 seaports cited in that report) |

e-Visa is now the default path for most leisure/business visitors. One government-adjacent claim circulating in 2025 was that e-visas are **~78% of visas issued** and **~95% processed within 72 hours**. Treat the 78% figure as **unverified** unless it appears in an MHA annual report; the 91.24% / 72-hour figure *is* in the Cabinet note.

### 5.2 2017 nationality split (historical, official table)

| Nationality | e-Visas 2017 | Share |
|---|---|---|
| United Kingdom | 305,954 | 18% |
| United States | 202,508 | 11.9% |
| France | 93,964 | 5.5% |
| China | 91,509 | 5.4% |
| Russia | 88,604 | 5.2% |
| Germany | 76,295 | 4.5% |
| Australia | 72,647 | 4.3% |
| Others | 448,798 | 26.4% |
| **Total** | **1,697,175** | **100%** |

### 5.3 Time and opportunity loss — the honest answer

**There is no official or independent count of “how many people lost time or missed trips because this website failed.”** MHA, NIC, CAG, and Lok Sabha have not published downtime hours, failed-payment counts, abandoned applications, or missed-flight numbers for this portal.

What can be said without inventing a number:

1. **Scale of exposure.** ~3.2 million tourist e-visas in 13 months (Nov 2024–Nov 2025). Even a 1% serious-failure rate would be tens of thousands of people. That 1% is **not measured**; it is only a way to see the size of the pipe.
2. **Trustpilot 1.3/5** is not a sample of all users, but it is uniformly about crashes, lost data, and hours-to-days of retry.
3. **Reddit / TripAdvisor / Facebook** show the same failure modes continuously from 2018 to August 2026 — not a one-week outage.
4. **Documented trip damage:**
   - Business-aviation: crew visa late, **pilot could not fly**, aircraft repositioned (Universal Weather, December 2025)
   - Facebook groups explicitly titled “did anyone miss their flight due to e-visa delays”
   - `r/travel` November 2025: applicants with flights in days, site crashing, still “under process”
   - Fees are **non-refundable**; a failed or late application is sunk cost plus rebooked hotels/flights
5. **Fake-site tax.** Government itself lists **140 fraudulent URLs** that clone this portal. Missions say complaints of fraud have been rising. Those sites overcharge (often 2–5×) or steal card data. That is loss caused by the official site being unusable *and* unfindable in Google vs SEO farms.
6. **Opportunity cost of UX.** Russell: ~4 hours per annual application if you “survive” it. Travellers routinely report **2–3 days** to submit. Multiply by millions of applications and the wasted-hours figure is large — and still unpublished.

**So: loss is real, repeated, and economically non-trivial. A national statistic does not exist.** Anyone quoting “X million people lost Y crore” is guessing.

### 5.4 Processing-time contradiction (2025–26)

| Source | Claim |
|---|---|
| Official (missions / portal FAQ) | ~72 hours; apply 4 days before arrival |
| Cabinet/PIB Mar 2026 | 91.24% cleared in 72 hours over **five years** |
| Universal Weather, Dec 2025 | **8–10 days** minimum in practice; 72-hour era is over |
| Travel blogs / Facebook groups, 2026 | 7–10 working days “the new normal”; some 2 weeks |
| `r/travel` | “thousands of travellers… 7–10 days or more” despite 24–72 hour expectation |

A five-year average of 91% in 72 hours is compatible with a **2025–26 spike**. The portal copy was not updated to match the spike. The 4-day-advance rule plus 8–10 day reality is a structural trap for anyone who believed the official FAQ.

---

## 6. The fake-website problem (official)

Missions (San Francisco, London, Pretoria, Bern, Auckland, Perth, New York, etc.) have been issuing the same advisory for years.

**Only** [https://indianvisaonline.gov.in](https://indianvisaonline.gov.in) is official.

Clones copy the homepage, Ashoka emblem, and `.gov.in`-looking names. Government-circulated list: **140 fake / fraudulent URLs**.

Examples named in the San Francisco consulate advisory:

- globalvisacorp.com/destination/india
- e-touristvisaindia.com
- e-visaindia.com
- indiavisa.org.in
- evisaindia.com
- online-visaindia.com
- evisaindia.org
- visatoindia.org
- india-visa-gov.in
- indianevisaservice.org
- evisa-india-online.com

GoI statement (portal + missions):

> The Government of India does not authorize any agent or intermediaries to charge fees for emergency, express visa, eVisas and eArrival card.

Consulates **do not process e-visas**. They bounce the applicant to a portal that often does not work.

This is a product of (a) a monopoly government form, (b) a site that fails under load, (c) Google ads for lookalikes. It is the most expensive second-order failure of the official UX.

Reddit consensus on many “helpers”: not always a pure steal — they overcharge, take the data, and submit on the real portal. Still a tax on a broken official flow.

---

## 7. What is missing from the public record

If you wanted a real technical audit, these documents are **not** public:

- NIC detailed project report / SRS / HLD–LLD for IVFRT or the e-visa web app
- Hosting diagram (NIC data centre vs cloud, HA, WAF, session store)
- Uptime / SLA / incident log
- Payment-gateway failure rates by card scheme and country
- Abandoned-application and double-charge counts
- CAG performance audit of this specific portal (none found in public CAG reports)
- Accessibility audit (WCAG)
- Security assessment (the IE 9 / Acrobat 7 banner is itself a security smell)
- Count of missed flights, cancelled hotels, or hours lost

---

## 8. Source list

### Official / government

- [https://indianvisaonline.gov.in/](https://indianvisaonline.gov.in/)
- [https://indianvisaonline.gov.in/evisa/tvoa.html](https://indianvisaonline.gov.in/evisa/tvoa.html)
- [https://indianvisaonline.gov.in/visa/instruction.html](https://indianvisaonline.gov.in/visa/instruction.html)
- [https://indianvisaonline.gov.in/visa/visa-processing.html](https://indianvisaonline.gov.in/visa/visa-processing.html)
- [https://indianvisaonline.gov.in/earrival/](https://indianvisaonline.gov.in/earrival/)
- [https://boi.gov.in](https://boi.gov.in)
- [https://www.mha.gov.in/en/commoncontent/e-visa](https://www.mha.gov.in/en/commoncontent/e-visa)
- [https://www.mha.gov.in/en/documents/annual-reports](https://www.mha.gov.in/en/documents/annual-reports)
- [PIB — IVFRT continuation, 25 Mar 2026, PRID 2245088](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2245088)
- [PIB — 31.74 lakh tourist e-visas, PRID 2202210](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202210)
- [PM India — IVFRT Cabinet note](https://www.pmindia.gov.in/en/news_updates/cabinet-approves-continuation-of-the-immigration-visa-foreigners-registration-tracking-lvfrt-scheme/)
- CGI San Francisco e-Visa + fake-site advisory
- Embassy of India, Washington e-Visa page
- HCI London / Pretoria / Bern fake-URL advisories

### Media and analysis

- [The Economist, 28 Jun 2026](https://www.economist.com/asia/2026/06/28/why-cant-indias-government-build-a-decent-website)
- [India Today on the Economist column, 2 Jul 2026](https://www.indiatoday.in/india/story/india-visa-website-critique-the-economist-ashoka-column-debate-government-digital-services-upi-aadhaar-2938245-2026-07-02)
- [Hindustan Times on Russell, 27 Nov 2025](https://www.hindustantimes.com/trending/us/indians-hit-back-after-american-calls-india-s-e-visa-site-comically-broken-101764220190829.html)
- [Times of India on Russell, 28 Nov 2025](https://timesofindia.indiatimes.com/world/us/us-investor-slams-comically-broken-e-visa-application-process-in-india-if-you-can-survive-it-/articleshow/125613765.cms)
- [Universal Weather, 11 Dec 2025](https://www.universalweather.com/blog/india-e-visa-processing-times-now-require-8-10-days-for-approval/)
- [VisasNews on 9.6 million e-visas](https://visasnews.com/en/india-over-9-6-million-e-visa-applications-approved-since-2020-and-a-constantly-evolving-system/)
- [The Hindu, 22 Apr 2026 — more seaports](https://www.thehindu.com/news/national/home-ministry-notifies-14-more-seaports-for-e%E2%80%90visa-entry/article70893825.ece)
- Wikipedia: [Visa policy of India](https://en.wikipedia.org/wiki/Visa_policy_of_India)

### Public complaint corpora

- [Trustpilot — indianvisaonline.gov.in](https://www.trustpilot.com/review/indianvisaonline.gov.in)
- Reddit: `r/travel` (`1plnlwh`, `1nf9lhc`, `18u648g`, `yg7xzq`, `1ou3q1t`, `1pe6hzr`); `r/visas` (`1i7kte9`, `1lkaov6`, `1g3w20f`, `1nnuy8b`, `1ozhclx`, `1pbcbmt`); `r/india` (`19d7hs0`)
- TripAdvisor India forum (crash / session-expired threads from 2018 onward)
- Facebook groups: India travel / e-visa (ongoing “site not working” posts, 2025–2026)
- Hacker News: [item 48713332](https://news.ycombinator.com/item?id=48713332)
- X: [@raymondopolis 1993378856200290392](https://x.com/raymondopolis/status/1993378856200290392); @sv_techie; @BadriSridharan; @steve_usc1; @indiaemerges quoting @TheEconomist

---

## 9. Bottom line

[indianvisaonline.gov.in](https://indianvisaonline.gov.in/) is a **NIC-built, MHA/BOI-owned front end to IVFRT**, launched as e-Tourist Visa in **November 2014**, now serving **~3 million tourist e-visas a year** and **9.6 million+ since 2020**.

Officially it is a success (91% in 72 hours, ₹1,800 crore more to modernise). On the public internet it is one of the most hated government websites in the world: session death, payment roulette, 2003 UI, IE 9 in the spec, a 2019 footer, unreadable CAPTCHAs, and a cottage industry of 140 fake clones.

Tech people (Russell, The Economist, HN, Indian engineers) do not treat this as a traffic spike. They treat it as **procurement and product failure** — lowest-bidder NIC/MMP software that was never redesigned for a global, card-paying, mobile audience.

**No agency has counted the missed flights.** The evidence that they happen is anecdotal but dense, and it has been dense for a decade.

---

## 10. Chat log (this research session)

**User (turn 1):**  
Go on the internet. Check https://indianvisaonline.gov.in/. Find flaws and issues the public has raised; official documentation, architecture, and technical background the government provided; niche tech-oriented social-media criticism; and statistics on time and opportunity lost to malfunction or insufficiency. Scrape everything. Deliver official documentation plus the rest.

**Assistant (turn 1):**  
Classified as a research ask, not a product build. Scraped the live portal, MHA/BOI/PIB/Cabinet IVFRT record, Trustpilot, Reddit, TripAdvisor, Facebook, X, The Economist, Hacker News, and mission advisories. Delivered the report that occupies sections 1–9 of this file.

**User (turn 2):**  
Create a markdown file of this entire chat and the information given.

**Assistant (turn 2):**  
This file.

---

*End of dossier. Compiled 28 August 2026. Figures are as cited on that date; live portal copy and Cabinet numbers may change.*
