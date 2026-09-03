# Atlas Gym Partner: First Production Release Readiness

Date: 2026-09-03

## Executive summary

The project produces a deployable Firebase Hosting bundle, but it is not ready
for a first production release. The highest-risk issues are registration
authorization, security tests that are currently skipped, incomplete deployment
of Firebase configuration, tenant-isolation consistency, and a failing
dependency audit.

## Release blockers

### 1. Registration is likely incompatible with the current Firestore rules

Registration checks the `users` collection before creating the Firebase Auth
user. Unauthenticated reads of `users` are denied by the Firestore rules, so
first-time email and Google registration may fail with `permission-denied`.

Recommended resolution:

- Move uniqueness checks to a trusted backend or Cloud Function; or
- Redesign registration so it does not require unauthenticated reads of user
  profiles.

### 2. Firestore security tests are skipped

`npm test` completes with all eight Firestore rule tests skipped because the
Firestore emulator is not running. The CI workflows also do not start the
emulator, so security regressions can pass CI unnoticed.

Recommended resolution:

- Run the tests through `firebase emulators:exec`.
- Make the CI job fail if the rules tests cannot initialize.
- Expand coverage for every protected collection and cross-gym access.

### 3. CI does not deploy Firebase rules and indexes

The merge workflow deploys Hosting only. Firestore rules, Firestore indexes,
and Storage rules are not deployed as part of the production workflow.

Recommended resolution:

- Deploy Hosting, Firestore rules, Firestore indexes, and Storage rules
  together, preferably after staging validation.

### 4. The dependency audit is failing but non-blocking

The production dependency audit reports one moderate `dompurify` vulnerability.
The CI workflow uses `continue-on-error: true`, so the release remains
deployable despite the finding.

Recommended resolution:

- Update the affected dependency using the available fix.
- Re-run the audit and make the audit step blocking unless an explicitly
  documented exception exists.

### 5. Multi-tenant configuration is inconsistent

The application supports `VITE_DEFAULT_GYM_ID`, but the Firestore rules
hard-code `default-gym` for user creation. Several services also use the
configured default gym directly instead of consistently resolving the
authenticated user's gym.

Recommended resolution:

- Complete the migration documented in `docs/multi-tenant-migration.md`.
- Remove hard-coded tenant assumptions from rules and services.
- Verify that users and business documents cannot cross gym boundaries.

## Important pre-release work

- Create a staging Firebase project and document promotion and rollback.
- Use `npm ci` in CI instead of `npm install`.
- Standardize the Node.js version between local development and CI.
- Add end-to-end smoke tests for login, registration, password reset, member
  access, admin access, finance, training, and public cycles.
- Add production monitoring, error reporting, uptime checks, and alerting.
- Verify Firebase Auth providers, authorized domains, quotas, billing limits,
  FCM/VAPID configuration, HTTPS, and any custom domain.
- Configure automated Firestore and Storage backups and test restoration.
- Add privacy policy, terms, data-retention guidance, support contacts, and
  preferably `LICENSE`, `SECURITY.md`, and `CHANGELOG.md`.
- Add a tracked `.env.example` describing required build variables.
- Reduce the large JavaScript bundle; the production build reports a minified
  chunk larger than 1.3 MB.
- Resolve lint warnings before release.

## Validation observed

| Check | Result |
|---|---|
| Production build | Passes, with large-chunk warnings |
| Lint | Passes with warnings |
| Automated tests | Passes, but all eight security tests are skipped |
| Production dependency audit | Fails with one moderate vulnerability |

## Recommended release sequence

1. Fix registration authorization and verify both registration paths.
2. Make Firestore emulator tests execute in CI and expand their coverage. (Completed)
3. Complete and verify the gym-data migration. (Completed for `atlas-gym-partner` with `GYM_ID=default-gym`)
4. Deploy and validate rules, indexes, and Storage rules in staging.
5. Fix the dependency audit and make it a meaningful release gate.
6. Add smoke tests, monitoring, backups, and rollback procedures.
7. Perform a production canary release and verify the critical user journeys.
