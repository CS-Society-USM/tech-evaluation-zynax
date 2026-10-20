# USM CSS submission — Stillnote

- Author: Tiun Chin Fa (`TiunChinFa`)
- Evaluation: Full-stack Notes App, Levels 1–5
- Public fork: https://github.com/TiunChinFa/tech-evaluation-zynax
- Upstream: https://github.com/CS-Society-USM/tech-evaluation-zynax
- Live website: https://stillnote-usm.vercel.app/
- Submitted PR: https://github.com/CS-Society-USM/tech-evaluation-zynax/pull/9
- Form answer for “Have you made a pull request?”: **Yes**

The PR is open for the society's review. It has not been merged.

## Configuration

- Vercel Hobby frontend; dedicated Supabase Free backend in Singapore.
- Email/password signup enabled, minimum password length 8.
- Email confirmation disabled with the owner's explicit approval for this evaluation.
- Anonymous sign-in disabled. Notes require an authenticated owner.
- Public email delivery and password recovery are not enabled. No SMTP credentials are present.

## Verified locally

- Production build and TypeScript checks passed.
- 10 unit tests passed.
- 6 desktop/mobile public browser tests passed, including automated WCAG A/AA checks.
- On 21 October 2026, corrected the mobile landing illustration's grid sizing and verified that the page stays within the actual device viewport after fonts load. All 6 public browser tests passed again; the landing screenshots were refreshed.
- Desktop and mobile live registration → create → edit → search → reload → delete → logout → login flows passed.
- 18 public HTTP API authorization/constraint checks passed using two independent users.
- Transactional SQL RLS checks passed, with fixtures rolled back.
- The initial database Security Advisor returned no findings. The final Auth-inclusive check reports one Free-plan limitation: leaked-password detection is disabled (requires Pro). No table/RLS security findings were returned. [Remediation reference](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Verified on the public deployment

On 20 October 2026, all **8 desktop/mobile browser tests passed against https://stillnote-usm.vercel.app/** using real independent accounts and the real backend. No mocked successful database responses were used.

The production build identity at [`/version.json`](https://stillnote-usm.vercel.app/version.json) was compared with GitHub's `main` commit and matched. Vercel imports and deploys this repository's main branch; documentation updates also trigger a fresh matching deployment. Compare the current branch and endpoint for the latest full SHA.

Production deep links return HTTP 200. CSP, frame denial, content-type protection, and referrer headers were verified. Supabase Site URL and four explicit callback URLs (production and local development) were saved and checked.

Test notes were cleaned up. Uniquely named synthetic accounts remain in this dedicated evaluation project for audit and do not belong to real people. The screenshots in `docs/screenshots/` show synthetic test data.

## Submission description

Stillnote is a full-stack notes application built with React, TypeScript, Vite, and Supabase. It implements all five evaluation levels with a responsive promotional landing page, email/password authentication, and a dashboard for creating, reading, editing, and deleting private notes. PostgreSQL row-level security enforces ownership independently of the frontend. Extra features include search, pinned notes, color collections, sorting, accessible dialogs, and concurrent-edit protection. The public Vercel deployment is built directly from the public GitHub repository.
