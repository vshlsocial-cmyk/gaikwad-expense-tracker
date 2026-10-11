# Gaikwad Expense Tracker (EMS)

A mobile-first, personal household purchase and expense tracker. The project is intended to remain **₹0 to run** using GitHub Pages, GitHub Actions, and the Supabase Free plan.

## Current deployment model

- Static web app/PWA hosted on GitHub Pages.
- Supabase Auth + Postgres for cross-device sign-in and data sync.
- Browser uses only the Supabase project URL and public anon/publishable key. Never use a service-role or secret key in the browser or commit secrets to this repository.
- The app needs an internet connection to sign in and sync. PWA installation does not make the cloud database offline.
- Supabase Free has usage limits and may pause inactive projects. Do not upgrade to a paid tier without an explicit user decision.

## First-time setup

1. Create a Supabase project on the Free plan, or use the existing project.
2. In Supabase SQL Editor, run `setup.sql` only when preparing a fresh database. The script is idempotent and does not delete rows.
3. In Supabase Auth, configure the allowed site URL and email sign-in/password-reset settings for the GitHub Pages URL.
4. Open the app, paste the Supabase project URL and public anon/publishable key into the one-time setup screen, then sign in or create an account.
5. On Android, open the hosted app in Chrome and use **Install app** or **Add to Home screen** if available.

## Data reset and forecasting

- The connected project was reset for a fresh start: purchase and usage rows were verified at zero. Family-member and shop lists were retained as preferences.
- `forecast_eligible` is a non-null boolean. New purchase records set it to true; older rows default to false and are not used to train new predictions.
- The forecast engine aggregates same-day lines, uses median repeat intervals, and normalizes only known compatible units (kg/g and litre/ml). It does not convert packages such as bottle, pack, or piece into mass/volume.
- Forecasts need at least two different purchase dates for an item and become more reliable with more history.
- Purchase history can be searched, edited, and deleted. Deleting is permanent in this build; a recycle bin/restore flow is still on the roadmap.

## Development and checks

Run the free GitHub Actions workflow on the staging branch. It checks:
- manifest JSON and service-worker syntax
- forecast-engine unit tests
- app-contract checks for key UI and user-scoped edit/delete behavior
- inline app JavaScript syntax
- required PWA assets

Useful files:
- `index.html` — application UI and browser logic
- `forecast-engine.js` — purchase-history forecasting
- `tests/forecast-engine.test.cjs` — forecast unit tests
- `tests/app-contract.test.cjs` — basic UI/data-safety contract checks
- `setup.sql` — idempotent schema/RLS setup for a fresh Supabase project
- `phase13_forecast_eligibility.sql` — additive migration for an existing database
- `EMS_STAGING.md` and `EMS_TEST_REPORT.md` — current scope and validation status
- `manifest.webmanifest`, `sw.js`, `icons/ems.svg`, `install.html` — PWA files

## Not yet complete

This is an active staging build, not a claim that the full EMS roadmap is finished. Receipt-total reconciliation and discount allocation, linked returns/refunds, normalized brand/variant/pack identity, recycle bin/restore, saved delivery locations, and retailer price/stock/ETA comparisons still need implementation and testing. A basic print-ready report can be saved as PDF; polished multi-report PDF exports remain future work. Do not treat estimates as verified live retailer prices. Keep the staging PR unmerged until CI and browser smoke tests pass.
