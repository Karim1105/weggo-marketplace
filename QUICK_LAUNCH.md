# 🚀 Quick Launch Guide - Weggo

## Step 1: Install MongoDB (if not installed)

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a Windows service

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Or Use MongoDB Atlas (Cloud - No Installation):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Use that in `.env.local` instead

## Step 2: Create Environment File

Create a file named `.env.local` in the root directory (`c:\Users\kekom\weggo\.env.local`):

```env
MONGODB_URI=mongodb://localhost:27017/weggo
JWT_SECRET=weggo-secret-key-2024-change-in-production
NODE_ENV=development
```

**If using MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string.

## Step 3: Create Upload Directory

The app will create this automatically, but you can create it manually:

```bash
mkdir public\uploads
```

## Step 4: Start MongoDB (if local)

### Windows:
- MongoDB should start automatically as a service
- Check: Open Services (Win+R, type `services.msc`), look for "MongoDB"

### Mac/Linux:
```bash
# Check if running
mongosh

# If not running, start it:
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

## Step 5: Launch the Application

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

## Step 6: Test It Out

1. **Register a user**: Go to http://localhost:3000/register
2. **Login**: Go to http://localhost:3000/login
3. **Create a listing**: Go to http://localhost:3000/sell
4. **Browse listings**: Go to http://localhost:3000/browse
5. **Admin dashboard**: Go to http://localhost:3000/admin
   - Username: `not your average admin`
   - Password: `not your average admin`

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check `.env.local` has correct `MONGODB_URI`
- Try: `mongosh` to test connection

### "Module not found" errors
- Run: `npm install` again

### Port 3000 already in use
- Kill the process using port 3000
- Or change port in `package.json`: `"dev": "next dev -p 3001"`

### Image upload fails
- Make sure `public/uploads` directory exists
- Check write permissions

## ✅ Success Checklist

- [ ] MongoDB installed and running
- [ ] `.env.local` file created with correct values
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login
- [ ] Can create a product listing

## 🎉 You're Ready!

Once you see "Ready on http://localhost:3000", you're all set!


