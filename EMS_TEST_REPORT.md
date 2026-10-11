# EMS staging validation report

Date: 2026-10-11

## Automated checks
- Manifest JSON parses successfully in GitHub Actions.
- Service worker passes `node --check`.
- Inline JavaScript extracted from `index.html` passes `node --check`.
- Required PWA files exist in the branch.
- GitHub Actions run: 38125200355 — static-checks job completed successfully.

## Not yet verified
- No real-browser end-to-end test has passed.
- The GitHub Pages URL has not been confirmed to serve this branch; the pull request is not merged.
- Android Chrome installation and app launch have not been tested on a device.
- Authentication, password reset, purchase saving, reports and CSV export have not been exercised against the live Supabase project in this change.
- No Supabase SQL migration was run and no database records were changed.

## Release decision
Do not merge or call this a production release until the manual smoke tests are completed. This branch only adds PWA metadata, shell caching, installation guidance, and static checks; it does not complete the larger EMS roadmap.
