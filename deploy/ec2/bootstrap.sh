#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -eq 0 ]]; then
  echo "Run this script as ubuntu user, not root."
  exit 1
fi

sudo apt update
sudo apt install -y python3 python3-venv python3-pip nginx curl git rsync

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

sudo mkdir -p /var/www/loanapp
sudo chown -R "$USER":"$USER" /var/www/loanapp

sudo systemctl enable nginx

echo "Bootstrap complete."
echo "Next steps:"
echo "1) Push code to GitHub main branch"
echo "2) Configure GitHub Actions secrets"
echo "3) Trigger Deploy EC2 workflow"
