# Deploy Weggo to DigitalOcean Droplet

## Prerequisites
- ✅ Droplet created (Ubuntu 22.04, 4GB RAM)
- ✅ Droplet IP address saved
- ✅ Root password from email

## Step 1: Connect to Droplet

Click **Console** button in DigitalOcean dashboard, or use SSH:

```bash
ssh root@YOUR_DROPLET_IP
```

Login with root password from email (you'll be prompted to change it on first login).

## Step 2: Run Initial Setup Script

Copy and paste this entire block:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install nginx
apt install -y nginx

# Install PM2 globally
npm install -g pm2

# Install Git
apt install -y git

echo "✅ System setup complete!"
node --version
mongod --version | head -n 1
nginx -v
pm2 --version
```

**This will take 5-10 minutes.** Wait for "✅ System setup complete!"

## Step 3: Clone Your Repository

```bash
cd /var/www
git clone https://github.com/Karim1105/weggo-4.0.git weggo
cd weggo
```

## Step 4: Create Production Environment File

Create `.env.production` file:

```bash
nano .env.production
```

Paste this (update JWT_SECRET with value from next section):

```env
MONGODB_URI=mongodb://localhost:27017/weggo
JWT_SECRET=REPLACE_WITH_GENERATED_SECRET
NODE_ENV=production
SEED_FEATURED_SECRET=test-seed-secret
SEED_ADMIN_SECRET=admin-seed-secret-2024
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

## Step 5: Install Dependencies and Build

```bash
npm install
npm run build
```

**This takes 3-5 minutes.**

## Step 6: Start Application with PM2

```bash
pm2 start npm --name "weggo" -- start
pm2 save
pm2 startup
```

Copy the command PM2 outputs and run it (it will look like `sudo env PATH=...`).

Verify it's running:
```bash
pm2 status
curl http://localhost:3000
```

You should see HTML output.

## Step 7: Configure Nginx

Create nginx config:

```bash
nano /etc/nginx/sites-available/weggo
```

Paste this (replace YOUR_DROPLET_IP with actual IP):

```nginx
server {
    listen 80;
    server_name weggo.me www.weggo.me YOUR_DROPLET_IP;

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
```

**Save:** `Ctrl+X`, `Y`, `Enter`

Enable the site:

```bash
ln -s /etc/nginx/sites-available/weggo /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 8: Configure Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

## Step 9: Test Deployment

Visit in browser: `http://YOUR_DROPLET_IP`

You should see Weggo running!

## Step 10: Point Domain (Namecheap)

In Namecheap dashboard:
1. Go to Domain List → weggo.me → Manage
2. Advanced DNS → Add New Record
3. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | YOUR_DROPLET_IP | Automatic |
| A Record | www | YOUR_DROPLET_IP | Automatic |

**DNS takes 5-60 minutes to propagate.**

## Step 11: Setup SSL (After DNS works)

Once `http://weggo.me` works:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d weggo.me -d www.weggo.me
```

Follow prompts, enter your email.

Done! Visit: `https://weggo.me` 🎉

## Troubleshooting

**App not starting:**
```bash
pm2 logs weggo
```

**Check MongoDB:**
```bash
systemctl status mongod
```

**Check nginx:**
```bash
systemctl status nginx
nginx -t
```

**Restart everything:**
```bash
pm2 restart weggo
systemctl restart nginx
systemctl restart mongod
```

## Future Updates

When you push to GitHub:

```bash
cd /var/www/weggo
git pull origin main
npm install
npm run build
pm2 restart weggo
```

## Monitoring

```bash
# Check app status
pm2 status

# View logs
pm2 logs weggo

# Monitor resources
htop

# Check disk space
df -h

# Check MongoDB
mongo
> show dbs
> exit
```
