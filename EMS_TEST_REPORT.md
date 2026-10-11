# EMS staging validation report

Date: 2026-10-11

## Verified through connected tools
- Supabase schema inspected; `forecast_eligible` exists as a non-null boolean defaulting to false.
- Purchase and usage tables were cleared for a fresh start; post-reset counts were verified as zero.
- Family-member and shop preference lists were preserved.
- The latest previously completed GitHub Actions static-check run passed manifest validation, service-worker syntax, forecast tests, inline application JavaScript syntax, and required PWA file checks. New product-identity changes also passed direct runtime checks for inline JS syntax, service-worker syntax, manifest JSON, DOM ID references, forecast tests, and app-contract tests; a fresh CI run is pending.
- Added searchable purchase history with edit/delete actions scoped by both purchase ID and signed-in user ID.
- Added a dedicated app-contract test and included it in the free GitHub Actions workflow.
- Purchase-pattern screen now describes estimates from purchase history rather than implying physical stock can be known without usage logs.
- Product entry, edit, history, CSV, and forecast grouping now carry optional brand, variant, and descriptive pack-size identity. Forecast tests cover distinct product identities; `phase14_product_identity.sql` is additive and has not been applied to the connected database.

## Release checks still outstanding
- GitHub Actions run 38126393058 completed successfully after the receipt-total warning and app-contract updates. Manifest, service-worker syntax, forecast tests, app-contract checks, inline JavaScript syntax, and required-file checks all passed.
- A real-browser smoke test is not yet confirmed. Static CI validates syntax and contracts, not the complete authenticated user journey. Authentication, create/edit/delete, reports, CSV export and password recovery must be tested on the hosted app before calling the release complete.
- Android Chrome installation and app launch have not been verified on a device.
- No automated browser testing is claimed.

## Known product scope gaps
A basic receipt-total mismatch warning is present, but discount/fee allocation and a persisted receipt-level total are not complete. Return/refund linkage and recycle-bin/restore are implemented on staging and covered by static contract tests. Database triggers are applied in the connected Supabase project to enforce purchase ownership and cumulative return/refund limits; trigger existence was verified through PostgreSQL metadata. Configurable 7/30/90-day recycle retention and explicit expired-entry cleanup are present, but cleanup has not been exercised against live data. The live website could not be reached from this runtime for browser verification, so authenticated end-to-end behavior remains unverified. Saved delivery locations and verified retailer comparisons remain outstanding. Brand/variant/pack-size fields and forecasting separation are implemented. Basic print-to-PDF for the current report is present; polished multi-report PDF exports remain outstanding. This report is intentionally honest about what remains.

## Release decision
Keep the PR in staging until current CI is green and basic browser smoke tests pass. No paid infrastructure, paid branch or paid service has been used.
