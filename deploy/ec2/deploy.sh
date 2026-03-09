#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
BACKEND_DIR="$APP_ROOT/rest_api/loan_app"
FRONTEND_DIR="$APP_ROOT/loanapp"

cd "$APP_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Run deploy/ec2/bootstrap.sh once on EC2."
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "Nginx is not installed. Run deploy/ec2/bootstrap.sh once on EC2."
  exit 1
fi

if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  DJANGO_SECRET_KEY="$(python3 - <<'PY'
import secrets
import string

alphabet = string.ascii_letters + string.digits + "!@#$%^&*(-_=+)"
print("".join(secrets.choice(alphabet) for _ in range(64)))
PY
)"
  sed -i "s|^DJANGO_SECRET_KEY=.*|DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}|" "$BACKEND_DIR/.env"

  if [[ -n "${EC2_PUBLIC_HOST:-}" ]]; then
    sed -i "s|YOUR_EC2_PUBLIC_IP|${EC2_PUBLIC_HOST}|g" "$BACKEND_DIR/.env"
  fi
fi

python3 -m venv "$BACKEND_DIR/.venv"
source "$BACKEND_DIR/.venv/bin/activate"
pip install --upgrade pip
pip install -r "$BACKEND_DIR/requirements.txt"

cd "$BACKEND_DIR"
python manage.py migrate
python manage.py collectstatic --noinput

cd "$FRONTEND_DIR"
npm ci

if [[ ! -f "$FRONTEND_DIR/.env.production" ]]; then
  cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.production"
fi

npx expo export -p web

sed "s|__APP_ROOT__|$APP_ROOT|g" "$APP_ROOT/deploy/ec2/loanapp-backend.service" | sudo tee /etc/systemd/system/loanapp-backend.service >/dev/null
sed "s|__APP_ROOT__|$APP_ROOT|g" "$APP_ROOT/deploy/ec2/nginx-loanapp.conf" | sudo tee /etc/nginx/sites-available/loanapp >/dev/null
sudo ln -sf /etc/nginx/sites-available/loanapp /etc/nginx/sites-enabled/loanapp
sudo rm -f /etc/nginx/sites-enabled/default

sudo mkdir -p /var/www/loanapp
sudo rsync -a --delete "$FRONTEND_DIR/dist/" /var/www/loanapp/

sudo systemctl daemon-reload
sudo systemctl enable loanapp-backend nginx
sudo systemctl restart loanapp-backend
sudo nginx -t
sudo systemctl reload nginx

echo "Deploy completed successfully."
