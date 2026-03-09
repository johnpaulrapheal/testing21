# Project Analysis (Hosting Readiness)

## Current Stack

- Backend: Django REST API (`rest_api/loan_app`)
- Frontend: Expo Router app (`loanapp`) with web export
- Runtime target: single Ubuntu EC2 instance (Nginx + Gunicorn + SQLite)

## Backend Analysis

- API routes are exposed under `/api/`.
- Data model has two entities: `Customer` and `Payment`.
- Configuration is now environment-driven for deployment safety:
  - `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, hosts/CORS settings
  - `DB_ENGINE=sqlite` and `SQLITE_PATH`
- Added test coverage for key API flows:
  - health endpoint
  - customers list
  - payment create
  - payments list

## Frontend Analysis

- API client now supports environment-based base URL.
- Default frontend API path is `/api` for same-domain hosting via Nginx reverse proxy.
- Web build supported via `npx expo export -p web`.

## Issues Found and Handled

1. `GET /api/payments/` mismatch:
- Frontend helper expected GET, backend supported only POST.
- Fixed by updating backend to support both GET and POST on `/api/payments/`.

2. Deployment coupling to local DB credentials:
- Backend previously used hardcoded DB details.
- Replaced with environment configuration and SQLite default.

3. No CI/CD automation:
- Added GitHub Actions workflows for CI and EC2 deployment.

## Deployment Model

- Nginx serves frontend static files from `/var/www/loanapp`.
- Nginx proxies `/api/` to Gunicorn at `127.0.0.1:8000`.
- Gunicorn runs Django via systemd service `loanapp-backend`.
- SQLite DB file stored at backend path (configurable via env).

## CI/CD Summary

- CI (`.github/workflows/ci.yml`):
  - Backend tests
  - Frontend web build
- CD (`.github/workflows/deploy-ec2.yml`):
  - rsync to EC2
  - run `deploy/ec2/deploy.sh`
  - restart services

## Remaining Risks

- SQLite is fine for low traffic and single-instance operation; not ideal for high write concurrency.
- EC2 instance is single point of failure (no HA).
- No TLS by default until domain + SSL is configured.

## Recommendation

Current setup is suitable for interview/demo/small production workloads on one EC2 Ubuntu instance with automated GitHub deployment.
