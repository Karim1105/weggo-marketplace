# Quick Deployment Command Reference

## 🚀 Initial Setup (Run once)

### Connect to Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

### System Setup (Copy entire block)
```bash
apt update && apt upgrade -y && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt install -y nodejs && \
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor && \
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
apt update && apt install -y mongodb-org nginx git && \
systemctl start mongod && systemctl enable mongod && \
npm install -g pm2 && \
echo "✅ Done! Node: $(node -v) | MongoDB: $(mongod --version | head -n1)"
```

### Clone and Setup App
```bash
cd /var/www && \
git clone https://github.com/Karim1105/weggo-4.0.git weggo && \
cd weggo
```

### Create Environment File
```bash
cat > .env.production << 'EOF'
MONGODB_URI=mongodb://localhost:27017/weggo
JWT_SECRET=e3b1bf27384a5dccbfb86cc3c0fb6ad4952cc3cc42accb399d103c27c3c41fa3fd3d7c590294909fa992d7acf4553a53eace1b00e5812b07a7c70d996db8f0ae
NODE_ENV=production
SEED_FEATURED_SECRET=test-seed-secret
SEED_ADMIN_SECRET=admin-seed-secret-2024
EOF
```

### Build and Start
```bash
npm install && \
npm run build && \
pm2 start npm --name "weggo" -- start && \
pm2 save && \
pm2 startup
```

**IMPORTANT:** Copy and run the command that PM2 outputs!

### Configure Nginx
```bash
cat > /etc/nginx/sites-available/weggo << 'EOF'
server {
    listen 80;
    server_name weggo.me www.weggo.me;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/weggo /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

### Setup Firewall
```bash
ufw allow 22/tcp && \
ufw allow 80/tcp && \
ufw allow 443/tcp && \
ufw --force enable && \
ufw status
```

### Test
```bash
curl http://localhost:3000
```

---

## 🔒 SSL Setup (After DNS works)

```bash
apt install -y certbot python3-certbot-nginx && \
certbot --nginx -d weggo.me -d www.weggo.me
```

---

## 📊 Monitoring Commands

```bash
# App status
pm2 status

# View logs
pm2 logs weggo --lines 50

# Resource usage
htop              # Press 'q' to exit

# Disk space
df -h

# MongoDB status
systemctl status mongod

# Nginx status  
systemctl status nginx

# Check who's using the app
pm2 monit
```

---

## 🔄 Update App (Future deployments)

```bash
cd /var/www/weggo && \
git pull origin main && \
npm install && \
npm run build && \
pm2 restart weggo && \
pm2 logs weggo
```

---

## 🆘 Troubleshooting

### App crashes
```bash
pm2 logs weggo --err --lines 100
pm2 restart weggo
```

### MongoDB issues
```bash
systemctl status mongod
journalctl -u mongod -n 50
systemctl restart mongod
```

### Nginx errors
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

### Out of memory
```bash
free -h
pm2 restart weggo
```

### Restart everything
```bash
systemctl restart mongod && \
systemctl restart nginx && \
pm2 restart weggo && \
pm2 status
```

---

## 📝 Your Droplet Info

**IP Address:** _________________

**Root Password:** _________________

**Domain:** weggo.me

**App Port:** 3000 (internal)

**Web Port:** 80 (HTTP), 443 (HTTPS)

---

## ✅ Deployment Checklist

- [ ] Connect to Droplet via Console
- [ ] Run system setup script  
- [ ] Clone repository
- [ ] Create .env.production
- [ ] Install dependencies
- [ ] Build app
- [ ] Start with PM2
- [ ] Configure nginx
- [ ] Setup firewall
- [ ] Test with IP address
- [ ] Point domain in Namecheap
- [ ] Wait for DNS propagation
- [ ] Setup SSL certificate
- [ ] Test https://weggo.me
- [ ] Celebrate! 🎉
