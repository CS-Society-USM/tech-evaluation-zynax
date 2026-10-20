# USM CSS submission — Stillnote

- Author: Tiun Chin Fa (`TiunChinFa`)
- Evaluation: Full-stack Notes App, Levels 1–5
- Public fork: https://github.com/TiunChinFa/tech-evaluation-zynax
- Upstream: https://github.com/CS-Society-USM/tech-evaluation-zynax

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
- Desktop and mobile live registration → create → edit → search → reload → delete → logout → login flows passed.
- 18 public HTTP API authorization/constraint checks passed using two independent users.
- Transactional SQL RLS checks passed, with fixtures rolled back.
- Supabase Security Advisor returned no findings.

The deployed URL, final commit identity and upstream PR will be added after publication.
