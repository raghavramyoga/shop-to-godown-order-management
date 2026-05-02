# Questions

**Date:** 2026-05-01
**Reference:** Inventory Management System — Project Plan v1.1 + Cost Quotation v1.0

Below are the open questions that need client confirmation before scope and pricing can be finalised. Please review and respond to each.

---

## Question 1 — Meaning of "Places"

In the requirement *"one godown with multiple places"*, are these "places":

- **(a)** Different **customer locations / shops** that place orders to the central godown, OR
- **(b)** **Zones / racks / sections inside** the godown where stock is physically stored?

> **Why this matters:** Drives the entire data model. The current plan assumes (a). If (b), the schema and UI change significantly.

**Client response:** _________________________________________

---

## Question 2 — System Users

Who will log in and use the system? Tick all that apply:

- [ ] Godown admin (full control)
- [ ] Godown staff (stock receive / dispatch)
- [ ] Customer / shop owner (places orders)
- [ ] Delivery agent (updates dispatch status)
- [ ] Other: _________________________________________

> **Why this matters:** Drives authentication roles, permissions, and number of UI screens.

**Client response:** _________________________________________

---

## Question 3 — Expected Scale

Approximate numbers at launch and after 1 year:

| Metric | At launch | After 1 year |
|--------|----------:|-------------:|
| Number of customer locations | | |
| Number of products (SKUs) | | |
| Orders per day | | |
| Concurrent users | | |

> **Why this matters:** Drives infrastructure sizing and cost. Free tiers cover small scale; larger scale needs paid plans (see Quotation Section 5).

**Client response:** _________________________________________

---

## Question 4 — Database Choice

Two database options are available. Both work equally well with the .NET backend — the choice mainly affects hosting cost and operations.

| Option | Monthly cost | Pros | Cons |
|--------|-------------:|------|------|
| **PostgreSQL** *(recommended)* | ₹ 1,250 / mo (managed, with backups) | Many managed providers, low cost, India region available, daily backups included | None significant for this use case |
| **SQL Server Express** (self-hosted) | ₹ 500 - 1,000 / mo (VPS only) | Free license | 10 GB DB limit, manual backups, manual patching |
| **SQL Server Standard** (self-hosted) | ₹ 24,000+ / mo | Full features, no DB size limit | Expensive license, manual ops |

> **Why this matters:** PostgreSQL keeps total cost low and operations simple. SQL Server only makes sense if the client already has SQL Server licenses, an in-house DBA, or specific integration needs with other SQL Server systems.

**Client response (pick one):** _____ PostgreSQL / _____ SQL Server Express / _____ SQL Server Standard

---

## Question 5 — Hosting Plan

Three hosting combinations are proposed (full details in Quotation Appendix A):

| Option | Monthly cost | Best for |
|--------|-------------:|----------|
| **A — DigitalOcean + Clerk** *(recommended)* | ₹ 2,250 / mo | Balanced cost, managed services, India-friendly |
| **B — Render + Supabase** | ₹ 2,650 / mo | Simplest setup, fastest go-live |
| **C — Hetzner self-hosted** | ₹ 500 / mo | Lowest cost, but needs ongoing ops/maintenance work |

**Client response (pick one):** _____ Option A / _____ Option B / _____ Option C

---

## Question 6 — Cloud Account Ownership

Who will own the cloud / SaaS accounts (DigitalOcean, Clerk, GitHub, Apple Developer, Google Play)?

- [ ] **Client** owns all accounts; development team is added as collaborator. *(Recommended — full ownership remains with client.)*
- [ ] **Development team** sets up and operates accounts; bills passed through with management fee.
- [ ] **Mixed** — describe: _________________________________________

> **Why this matters:** Determines billing flow and long-term ownership of infrastructure.

**Client response:** _________________________________________

---

## Question 7 — Optional Add-Ons of Interest

From Quotation Section 6, which add-ons are likely needed at launch vs. later? Tick what's needed at launch:

- [ ] Payment gateway (Razorpay / Stripe)
- [ ] SMS / WhatsApp order notifications
- [ ] Barcode scanning in mobile app
- [ ] Advanced analytics dashboard
- [ ] Multi-language (Tamil, Hindi, English)
- [ ] Multi-godown / multi-warehouse support
- [ ] GST invoicing & e-invoice integration

> **Why this matters:** Confirmed add-ons get folded into the main plan and dev cost; the rest can stay as future phases.

**Client response:** _________________________________________

---

## Question 8 — Timeline & Team Size

Preferred delivery approach:

- [ ] **Single developer** — 11-12 weeks, lower cost
- [ ] **Two-developer team** — 6-7 weeks, faster delivery, slightly higher cost
- [ ] **Flexible** — recommend whichever works best

**Client response:** _________________________________________

---

## Question 9 — Branding & Design

- [ ] Use **functional / clean default UI** (included in dev cost)
- [ ] Need **custom branded UI design** in Figma first (additional cost — quoted separately)
- [ ] Logo, colour palette, brand guidelines available? **Yes / No** — if yes, please share.

**Client response:** _________________________________________

---

## Question 10 — Hosting Region & Compliance

- Preferred data hosting region: _____ India / _____ Singapore / _____ EU / _____ US / _____ No preference
- Any regulatory requirements? (GST, data residency, GDPR, etc.) — _________________________________________

> **Why this matters:** Some providers have India regions (DigitalOcean — Bangalore); others don't. Affects latency and compliance.

**Client response:** _________________________________________

---

## Next Steps

Once the responses to the above questions are received, the following will be finalised:

1. **`Project_Plan.md`** — scope locked, phases adjusted if needed
2. **`Cost_Quotation.md`** — final numbers, including any selected add-ons
3. Project agreement / SOW prepared for signature
4. **Phase 1 — Discovery & Design** kicks off

---

*Document version 1.0 — please return this with responses to proceed.*
