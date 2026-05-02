# Inventory Management System — Cost Quotation

**Date:** 2026-05-01
**Quotation valid for:** 30 days from issue date
**Reference:** Inventory Management System — Project Plan v1.1

---

## 1. Quotation Summary

| Item | Cost |
|------|-----:|
| One-time project cost | ₹ *[Project Cost]* |
| One-time setup (Google Play, etc.) | ₹ 2,100 |
| Infrastructure & services | ₹ 2,250 / month *(₹ 27,000 annual)* |
| Annual subscriptions (domain + Apple Developer) | ₹ 9,300 / year |
| **Total upfront** | **₹ [Project Cost] + 11,400** |
| **Recurring** | **₹ 2,250 / month + ₹ 9,300 / year** |

> Infrastructure costs are indicative; actual amounts may vary slightly with exchange rate fluctuations on cloud / SaaS billing.

---

## 2. Scope Reference

This quotation covers the scope defined in **`Project_Plan.md`**:

- Web application — Admin module (godown management) + Customer module (order placement)
- Mobile monitoring app — Android + iOS
- Backend API + PostgreSQL database
- Authentication, role-based authorization, audit trail
- Production deployment, CI/CD pipeline, error monitoring
- API documentation + user manual
- 30 days post-launch warranty for bug fixes

---

## 3. One-Time Project Cost

| Item | Cost |
|------|-----:|
| Complete project — design, build, test, deploy, handover | ₹ *[Project Cost]* |

### Includes
- All work to deliver the scope listed in Section 2
- Code repository setup and handover (GitHub)
- API documentation (Swagger / OpenAPI)
- User manual (admin + customer)
- 30 days post-launch warranty for bug fixes
- 2 training sessions (admin + end user)

### Excludes
- Hardware (laptops, mobile devices for testing)
- Third-party paid integrations (payment gateway, SMS gateway) — quoted separately if needed
- Content creation (product photos, descriptions, marketing copy)
- Custom branding / logo design

---

## 4. Infrastructure & Third-Party Services

### Monthly recurring

| Service | Purpose | Monthly (₹) |
|---------|---------|------------:|
| DigitalOcean App Platform — Basic | Hosts .NET API | 1,000 |
| DigitalOcean App Platform — Static Site | Hosts React web (free tier) | 0 |
| DigitalOcean Managed PostgreSQL — Basic 1GB | Production database + backups | 1,250 |
| Clerk — Free tier | Authentication (up to 10,000 MAU) | 0 |
| Sentry — Free tier | Error monitoring | 0 |
| GitHub — Free | Private repo + CI/CD | 0 |
| Expo EAS — Free tier | Mobile builds | 0 |
| **Total** | | **₹ 2,250 / month** |

### Annual recurring

| Item | Cost (₹) |
|------|---------:|
| Domain name (.com / .in) | 1,000 |
| Apple Developer Program | 8,300 |
| **Total** | **₹ 9,300 / year** |

### One-time setup

| Item | Cost (₹) |
|------|---------:|
| Google Play Console | 2,100 |
| SSL certificate | 0 *(included free)* |
| **Total** | **₹ 2,100** |

---

## 5. Scaling Costs (When Business Grows)

These kick in only when usage crosses the free tiers — **not part of initial quote**.

| Trigger | Add-on | Approx cost |
|---------|--------|------------:|
| > 10,000 monthly active users | Clerk Pro | ₹ 2,100 / mo |
| Multiple parallel mobile builds | Expo EAS Production | ₹ 1,600 / mo |
| > 5 GB DB storage | DO Postgres upgrade (4 GB RAM) | ₹ 5,000 / mo |
| Higher API traffic | DO App Platform Pro | ₹ 2,000 / mo |
| Higher error tracking volume | Sentry Team | ₹ 2,200 / mo |

---

## 6. Assumptions

1. Single godown, multiple customer locations (per project plan).
2. Client provides product master data (names, SKUs, prices) in Excel/CSV format for initial seed.
3. Single language (English) at launch.
4. Default functional / clean UI is used; bespoke UI design (Figma) is not included.
5. Cloud accounts (DigitalOcean, Clerk, GitHub) created in client's name; development team gets collaborator access.
6. Apple / Google developer accounts created in client's name for app store ownership.
7. UAT feedback consolidated within the UAT window; out-of-scope changes after sign-off are billed separately.

---

## 7. Out of Scope

- Hardware procurement
- Network setup at godown / customer locations
- Inventory data entry / cleanup
- Training beyond 2 sessions
- Marketing / SEO
- Compliance certifications (ISO, GDPR audits)

---

## 8. Why This Stack & Hosting Choice

| Layer | Choice | Why over Azure/AWS |
|-------|--------|-------------------|
| Hosting | DigitalOcean App Platform | ~40% cheaper for equivalent compute, simpler pricing model |
| Database | DO Managed PostgreSQL | Daily backups included, ~50% cheaper than Azure SQL |
| Auth | Clerk | Generous free tier, drop-in React UI |
| CI/CD | GitHub Actions | Free with private repo, no separate DevOps cost |

---

## Appendix A — Alternative Hosting Options

If the client prefers a different combination:

### Option B — Render + Supabase (simplest)
| Service | Monthly (₹) |
|---------|------------:|
| Render Web Service (.NET) | 580 |
| Render Static (React) | 0 |
| Supabase Pro (Postgres + Auth + Storage) | 2,075 |
| **Total** | **₹ 2,650 / mo** |

### Option C — Hetzner self-hosted (lowest cost, highest ops effort)
| Service | Monthly (₹) |
|---------|------------:|
| Hetzner CX22 VPS | 415 |
| Self-hosted Postgres + Keycloak | 0 (on same VPS) |
| Backup storage | 85 |
| **Total** | **₹ 500 / mo** |

> Option C requires additional ongoing operations work; not recommended unless cost is the dominant constraint.

---

## Sign-Off

| | Name | Signature | Date |
|--|------|-----------|------|
| For Client | | | |
| For Vendor | | | |

*Quotation reference v1.0 — open for revision based on client discussion.*
