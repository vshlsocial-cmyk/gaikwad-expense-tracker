# EMS staging PWA hardening

This branch adds the first safe, reviewable PWA layer to the existing EMS site.

## Changes
- Added `manifest.webmanifest` with standalone display settings and app identity.
- Added a scalable SVG app icon at `icons/ems.svg`.
- Updated the existing `index.html` metadata and registered the service worker.
- Added `sw.js` for a small same-origin app shell cache and stale-shell cleanup.
- Added a purchase-history forecast engine with unit tests, using median repeat-purchase intervals and compatible kg/g and litre/ml normalization.
- Removed visible manual usage-recording controls from the main workflow. Legacy usage records were cleared from the connected database for a fresh start.
- Added `phase13_forecast_eligibility.sql`; applied the additive migration to the connected database. Existing purchase history was cleared; future purchases are explicitly marked eligible for forecasting.
- Added `install.html` with Android installation instructions.

## Test plan before merge
1. Confirm GitHub Pages preview serves `manifest.webmanifest`, `sw.js`, `icons/ems.svg`, and `install.html` with status 200.
2. Open the app and verify login, purchase save, reports, CSV export, and password reset still work.
3. On Android Chrome, check whether Install app is offered and launch the installed app.
4. Verify that sign-in and data sync still require a network connection; the service worker does not cache Supabase API responses.
5. Test an update to the app and confirm the new shell cache replaces the old one.

## Explicit limitations
This branch does not replace the production database schema and does not add unverified SQL migrations. It does not implement live retailer price/stock/delivery comparison, automatic checkout, native APK packaging, JSON restore, or fully normalized product/brand/pack identity. The forecast-eligibility migration has been applied to the connected Supabase project. Database row counts were verified as zero for purchases and usage after cleanup. Family-member and shop lists were retained as preferences. Those features need separate implementation and test work.

**Deployment safety:** This branch is still not the live `main` branch. Static CI passes, but live browser tests remain outstanding; do not claim full completion until those checks pass.