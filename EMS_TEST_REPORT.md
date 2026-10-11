# EMS staging validation report

Date: 2026-10-11

## Verified through connected tools
- Supabase schema inspected; `forecast_eligible` exists as a non-null boolean defaulting to false.
- Purchase and usage tables were cleared for a fresh start; post-reset counts were verified as zero.
- Family-member and shop preference lists were preserved.
- The latest previously completed GitHub Actions static-check run passed manifest validation, service-worker syntax, forecast tests, inline application JavaScript syntax, and required PWA file checks.
- Added searchable purchase history with edit/delete actions scoped by both purchase ID and signed-in user ID.
- Added a dedicated app-contract test and included it in the free GitHub Actions workflow.
- Purchase-pattern screen now describes estimates from purchase history rather than implying physical stock can be known without usage logs.

## Release checks still outstanding
- The latest UI changes need a fresh successful CI run confirming the app-contract test and current JavaScript.
- A real-browser smoke test is not yet confirmed. Authentication, create/edit/delete, reports, CSV export and password recovery must be tested on the hosted app before calling the release complete.
- Android Chrome installation and app launch have not been verified on a device.
- No automated browser testing is claimed.

## Known product scope gaps
Receipt-total reconciliation, return/refund linkage, recycle-bin/restore, saved delivery locations, verified retailer comparisons, and distinct brand/variant/pack-size product identity are not complete yet. Basic print-to-PDF for the current report is present; polished multi-report PDF exports remain outstanding. This report is intentionally honest about what remains.

## Release decision
Keep the PR in staging until current CI is green and basic browser smoke tests pass. No paid infrastructure, paid branch or paid service has been used.
