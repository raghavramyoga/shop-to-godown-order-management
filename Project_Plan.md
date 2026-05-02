# Inventory Management System — Project Plan

**Prepared:** 2026-05-01
**Status:** Draft for client review

---

## 1. Project Overview

A web-based inventory management system with a companion mobile monitoring app, designed around a **central godown (warehouse)** that fulfills orders from **multiple customer locations**.

### Core scenario
When a customer at Location A places an order for 10 packets of Lays, the system records the order against Location A. The godown can see, in real time, what each location has ordered, current stock levels, and order fulfillment status.

---

## 2. Key Requirements (to be confirmed with client)

Before final scope lock-in, we need the client to confirm:

| # | Question | Why it matters |
|---|----------|----------------|
| 1 | Are "places" **customer locations/shops** placing orders, or **zones/racks inside the godown**? | Drives the entire data model |
| 2 | Who are the system users? (Godown admin, godown staff, customers, delivery agents) | Drives auth, roles, and UI design |
| 3 | Expected scale: number of locations, SKUs, orders/day | Drives infrastructure sizing |

> **Working assumption for this plan:** "places" = different customer locations placing orders to a single central godown.

---

## 3. Technology Stack (Locked)

| Layer | Technology | Reason |
|-------|-----------|--------|
| Web frontend | **React + TypeScript + Vite** | Fast, modern, large ecosystem |
| Backend API | **ASP.NET Core 8 Web API (C#)** | Enterprise-grade, mature, strong typing |
| Database | **PostgreSQL** | Reliable, transactional, cost-effective |
| ORM | **Entity Framework Core** | Native to .NET, productive, migrations built-in |
| Mobile app | **React Native (Expo)** | Reuses React skills, single codebase for Android + iOS |
| Source control | **GitHub (private repo)** | Industry standard, integrated CI/CD via Actions |
| CI/CD | **GitHub Actions** | Free tier covers our needs, native to GitHub |
| Web hosting | **DigitalOcean App Platform** | Managed PaaS, supports .NET + React, predictable pricing |
| DB hosting | **DigitalOcean Managed PostgreSQL** | Daily backups, one-click scaling, same provider as app |
| Authentication | **Clerk** | Best-in-class React integration, social login + MFA + RBAC out of the box |
| Mobile builds | **Expo EAS** | Cloud builds for Play Store + App Store |
| Domain & SSL | **GoDaddy / Namecheap** + Let's Encrypt (auto via host) | Standard |
| Error monitoring | **Sentry** (free tier) | Real-time error tracking |

### Why this combo
- **React + .NET** — leverages existing team expertise, mature stack.
- **GitHub + Actions** — single platform for code + CI/CD, no extra cost.
- **DigitalOcean** — alternative to Azure/AWS, ~40% cheaper for similar workloads, India-friendly pricing in USD.
- **Clerk** — drop-in React components save 2+ weeks vs. building auth ourselves.
- **PostgreSQL** — same DB engine across cloud providers (no lock-in), excellent for inventory.

---

## 4. Core Data Model (Initial Design)

```
Location        (id, name, address, contact, active)
Product         (id, name, sku, unit, unit_price, category)
Stock           (product_id, location_id, quantity, last_updated)
Order           (id, location_id, customer_id, status, created_at, total)
OrderItem       (id, order_id, product_id, qty, price)
StockMovement   (id, product_id, from_loc, to_loc, qty, type, timestamp)
User            (id, name, email, role, location_id)
AuditLog        (id, user_id, action, entity, timestamp)
```

This model directly satisfies the core scenario:
> *"Show 10 Lays ordered from Location A"* → `SELECT FROM OrderItem JOIN Order WHERE location_id = A AND product = Lays`.

---

## 5. Feature Scope

### Web Application — Admin / Godown
- Dashboard: stock-by-location, low-stock alerts, today's orders
- Product master (CRUD)
- Location master (CRUD)
- Stock management: receive stock, adjust, transfer
- Order management: view, approve, fulfill, dispatch, complete
- Reports: per-location sales, top products, stock movement history
- User management with role-based access (Admin / Staff / Customer)

### Web Application — Customer
- Browse product catalog
- Place order linked to their location
- View order history and status
- Reorder previous orders

### Mobile App — Monitoring
- Live dashboard (stock + orders summary)
- Order status tracking
- Push notifications: new order, low stock, dispatch confirmation
- Quick stock-in / stock-out for godown staff (barcode scan optional)
- Offline-first read access for poor-connectivity locations

---

## 6. Phased Delivery Plan

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1 — Discovery & Design** | 1 week | Finalized requirements, DB schema, wireframes, API contract |
| **Phase 2 — Backend MVP** | 2 weeks | Auth, Product/Location/Order/Stock APIs, seed data, Postman collection |
| **Phase 3 — Web Admin Module** | 2 weeks | Admin dashboard, product/location/stock/order management screens |
| **Phase 4 — Web Customer Module** | 1-2 weeks | Customer browse, cart, place order, order history |
| **Phase 5 — Mobile App** | 3 weeks | React Native app: dashboard, order tracking, push notifications |
| **Phase 6 — Testing & UAT** | 1 week | Unit + E2E tests, client UAT, bug fixes |
| **Phase 7 — Deployment & Production Hardening** | 1 week | CI/CD, production hosting, monitoring, backup, SSL, go-live |

**Total estimated duration:** **10-12 weeks** (solo developer) | **6-8 weeks** (2-developer team)

---

## 7. Production Readiness Checklist

- [ ] Authentication & role-based authorization
- [ ] Input validation on all forms and APIs
- [ ] Protection against SQL injection, XSS, CSRF
- [ ] HTTPS / SSL certificate
- [ ] Database backup & restore tested
- [ ] Logging and error tracking (Sentry / similar)
- [ ] Performance: page load < 2s, API < 300ms
- [ ] Responsive UI (mobile / tablet / desktop)
- [ ] Accessibility (WCAG basic compliance)
- [ ] Audit trail for stock and order changes
- [ ] Rate limiting on public endpoints
- [ ] Automated CI/CD pipeline
- [ ] Staging environment separate from production
- [ ] Documentation: API docs, user manual, admin guide

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Unclear requirements late in build | High | Lock scope after Phase 1 sign-off |
| Stock count race conditions (concurrent orders) | High | Use DB transactions + optimistic locking |
| Poor connectivity at customer locations | Medium | Mobile offline mode + sync queue |
| Scope creep during build | Medium | Change requests handled separately, post-MVP |
| Data loss | High | Daily automated backups + point-in-time recovery |

---

## 9. Next Steps

1. Client confirms answers to the 4 clarifying questions in Section 2.
2. Client picks technology stack option (A or B).
3. Sign-off on scope and timeline.
4. Begin **Phase 1 — Discovery & Design**.

---

*Document version 1.0 — open for revision based on client feedback.*
