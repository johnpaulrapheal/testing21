# EC2 Ubuntu Hosting (Django + Frontend on One Instance)

This repository is set up to run on **one Ubuntu EC2 instance** with:
- Django API (`rest_api/loan_app`) using **SQLite**
- Expo frontend (`loanapp`) exported as static web
- Nginx serving frontend and proxying `/api` to Gunicorn
- GitHub Actions CI/CD for automatic deploys to EC2

## Architecture

- Browser -> `Nginx:80`
- `Nginx /` -> static frontend from `/var/www/loanapp`
- `Nginx /api/` -> `Gunicorn 127.0.0.1:8000`
- Django -> SQLite file (`db.sqlite3`)

## 1) Launch EC2

- AMI: Ubuntu 24.04 LTS
- Instance: `t3.small` or above
- Security Group inbound:
  - `22` (SSH) from your IP
  - `80` (HTTP) from `0.0.0.0/0`
  - `443` (HTTPS) optional (recommended when domain + SSL is added)

## 2) First-time EC2 setup

Pick one folder name to match your GitHub repo (example: `loanapp-ec2`) and use it everywhere.

SSH into EC2 and run:

```bash
sudo apt update && sudo apt install -y git
mkdir -p /home/ubuntu/loanapp-ec2
```

From local machine, sync this repo once:

```powershell
scp -i "C:\path\to\your-key.pem" -r "E:\interview1\*" ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/loanapp-ec2/
```

Then on EC2:

```bash
cd /home/ubuntu/loanapp-ec2
bash deploy/ec2/bootstrap.sh
```

## 3) Configure GitHub Actions secrets

In GitHub repo -> Settings -> Secrets and variables -> Actions, add:

- `EC2_HOST`: your EC2 public IP or DNS
- `EC2_USER`: `ubuntu`
- `EC2_SSH_KEY`: private key content (`.pem`)
- Repository variable `EC2_APP_DIR`: `/home/ubuntu/loanapp-ec2` (optional, defaults to `/home/ubuntu/interview1`)

## 4) CI/CD behavior

### CI workflow

File: `.github/workflows/ci.yml`

Runs on PR/push:
- Backend tests (`python manage.py test loanapp1`)
- Frontend web export build (`npx expo export -p web`)

### Deploy workflow

File: `.github/workflows/deploy-ec2.yml`

Runs on push to `main` (or manual dispatch):
- rsync code to `EC2_APP_DIR` on EC2 (or default `/home/ubuntu/interview1`)
- execute `deploy/ec2/deploy.sh`

`deploy.sh` does:
- create backend `.env` from template if missing
- install Python dependencies in venv
- run migrations + collectstatic
- build Expo web output
- sync frontend build to `/var/www/loanapp`
- install/update systemd and Nginx config
- restart backend and reload Nginx

## 5) Verify deployment

```bash
curl http://127.0.0.1:8000/api/test/
```

Open in browser:

- `http://YOUR_EC2_PUBLIC_IP`

## Important files

- Backend settings: `rest_api/loan_app/loan_app/settings.py`
- Backend env template: `rest_api/loan_app/.env.example`
- Frontend API env template: `loanapp/.env.example`
- Deploy script: `deploy/ec2/deploy.sh`
- Bootstrap script: `deploy/ec2/bootstrap.sh`
- Nginx config template: `deploy/ec2/nginx-loanapp.conf`
- Systemd service template: `deploy/ec2/loanapp-backend.service`

## Notes

- Current database is SQLite (`DB_ENGINE=sqlite`).
- For local frontend-only development, set `EXPO_PUBLIC_API_BASE_URL` to your Django URL (example: `http://127.0.0.1:8000/api`).
- Add HTTPS later with Certbot once domain is attached.
