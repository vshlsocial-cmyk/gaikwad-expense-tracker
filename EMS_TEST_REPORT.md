# EMS staging validation report

Date: 2026-10-12

Latest automated run: [38208728975](https://github.com/vshlsocial-cmyk/gaikwad-expense-tracker/actions/runs/38208728975) passed all configured static and unit checks, including CSV backup serialization and report-contract checks. This remains automated validation only; it does not replace authenticated browser or Android device testing.

Latest staging changes: added saved delivery locations (name, address, optional city/PIN) under a dedicated table with row-level security, and manual retailer search links that use optional city/PIN context. These are planning aids, not live price or serviceability verification. The location-aware planner, CSV preference export, and date-filtered PDF refresh contracts passed in GitHub Actions run 38205886980.

## Verified through connected tools
- Supabase schema inspected; `forecast_eligible` exists as a non-null boolean defaulting to false.
- Purchase and usage tables were cleared for a fresh start; post-reset counts were verified as zero.
- Family-member and shop preference lists were preserved.
- GitHub Actions run 38205886980 completed successfully after the saved-location UI, location-aware retailer search links, preference-inclusive CSV export, date-filtered PDF refresh, and corresponding contract tests were added, including manifest validation, service-worker syntax, forecast-engine tests, adjustment-engine tests, receipt-engine tests, app-contract checks, inline application JavaScript syntax, PWA-file checks, and job cleanup.
- Added searchable purchase history with edit/delete actions scoped by both purchase ID and signed-in user ID.
- Added a dedicated app-contract test and included it in the free GitHub Actions workflow.
- Purchase-pattern screen now describes estimates from purchase history rather than implying physical stock can be known without usage logs.
- Product entry, edit, history, CSV, and forecast grouping now carry optional brand, variant, and descriptive pack-size identity. Forecast tests cover distinct product identities; `phase14_product_identity.sql` is additive and has not been applied to the connected database.

## Release checks still outstanding
- GitHub Actions run 38208728975 completed successfully after CSV backup parser tests and report refund-bucket changes. CSV tests parse quoted records and validate commas, embedded quotes, embedded newlines, empty cells, and consistent columns. Refunds now appear in a separate negative “Refunds” bucket for the selected adjustment-date range.
- A real-browser smoke test is not yet confirmed. Static CI validates syntax and contracts, not the complete authenticated user journey. Authentication, create/edit/delete, reports, CSV export and password recovery must be tested on the hosted app before calling the release complete.
- Android Chrome installation and app launch have not been verified on a device.
- No automated browser testing is claimed.

## Known product scope gaps
Receipt reconciliation is implemented on staging with a dedicated tested allocation engine: the entered receipt total, pre-adjustment item subtotal, receipt item total, allocated difference, and adjustment type are persisted on each basket line. Discounts/fees are allocated proportionally with a rounding remainder on the final line; this is line-level allocation, not a separate receipt ledger. Return/refund linkage and recycle-bin/restore are implemented on staging and covered by static contract tests. Forecasting now reduces estimated consumption quantity and cost proportionally for physical returns, excludes fully returned purchase events, and leaves consumption cost unchanged for refund-only adjustments; dedicated regression tests cover these cases. Database triggers are applied in the connected Supabase project to enforce purchase ownership and cumulative return/refund limits; trigger existence was verified through PostgreSQL metadata. Configurable 7/30/90-day recycle retention and explicit expired-entry cleanup are present, but cleanup has not been exercised against live data. The live website could not be reached from this runtime for browser verification, so authenticated end-to-end behavior remains unverified. The shopping planner compares historical purchase records only. It normalizes text spelling/case/punctuation, warns about ambiguous product identities, and displays recorded brand/variant/pack details where available rather than merging those identities automatically. Live retailer prices, verified stock, delivery fees/ETAs, basket splitting, and saved delivery locations remain outstanding. Brand/variant/pack-size fields and forecasting separation are implemented. Basic print-to-PDF for the current report is present; polished multi-report PDF exports remain outstanding. This report is intentionally honest about what remains.

## Release decision
Keep the PR in staging until current CI is green and basic browser smoke tests pass. No paid infrastructure, paid branch or paid service has been used.
