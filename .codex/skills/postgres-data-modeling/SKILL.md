---
name: postgres-data-modeling
description: Evaluate FESTRONIX relational persistence models and migrations during authorized data architecture work.
---

# Persistence modeling methodology

Read `docs/AI_HANDOFF.md` first. Apply this skill only when persistence work is authorized. This skill defines no final FESTRONIX tables and does not authorize database configuration.

- Start with business workflows, invariants, ownership, lifecycle, and required queries. Separate confirmed requirements from assumptions.
- Model relationships and cardinalities before choosing tables. Normalize authoritative facts; justify denormalization with a measured query need and a consistency strategy.
- Choose primary and foreign keys deliberately. Define nullability, uniqueness scope, checks, and deletion behavior from business rules.
- Evaluate yearly edition isolation and prevent cross-edition relationships where invalid. Preserve history required for faculty operation of future editions.
- Clarify event revisions, publication/approval history, and what registrations must retain when event information changes.
- Resolve registration/team membership cardinality, duplicate participation rules, team lifecycle, and concurrent updates before proposing structures.
- Enforce business invariants server/database-side where appropriate; client validation is only complementary.
- Identify transaction boundaries, competing writes, idempotency needs, and suitable locking or isolation behavior.
- Derive indexes from query/filter/order patterns and review execution plans and write cost. Do not index every field by default.
- Plan migrations, backfills, compatibility, recovery, and audit/history retention before changing persisted data.

Present alternatives and unresolved tradeoffs for review. Do not turn tentative examples into an approved schema or select authentication architecture here.
