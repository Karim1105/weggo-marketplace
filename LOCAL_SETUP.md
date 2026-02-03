# Run Weggo locally and check everything

## 1. Start MongoDB

- **Windows:** Open "Services" or run MongoDB Compass / the MongoDB shell. Or from a terminal (if MongoDB is in PATH): `mongod`
- **Mac:** `brew services start mongodb-community` (or `mongod` if installed manually)
- **Linux:** `sudo systemctl start mongod` (or `mongod`)

Make sure it's running on **localhost:27017** (default).

---

## 2. Environment file

In the project root (`weggo`), create a file named **`.env`** (copy from `.env.example`):

```
MONGODB_URI=mongodb://localhost:27017/weggo
JWT_SECRET=any-secret-for-local-dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

You can leave the rest empty for now.

---

## 3. Install and run

```bash
cd weggo
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## 4. Quick test flow

1. **Register** – Click Sign up, create an account (name, email, password).
2. **Browse** – Go to Browse; you’ll see no listings at first (empty DB).
3. **Sell** – Go to Sell, add a listing (title, description, category, condition, price, location, at least one image). Submit.
4. **Home** – Go back to Home; your listing should appear in the feed.
5. **Listing page** – Click the listing; you should see the detail page with “Contact seller”.
6. **Profile** – Profile should show your user and “My Active Listings”.
7. **Favorites** – Add something to favorites (from browse or listing page); check Favorites page.
8. **Admin** – To test admin:
   - Create an admin user in MongoDB (see below), or
   - In MongoDB Compass or `mongosh`, find your user and set `role: "admin"`, then go to `/admin` and log in with that email and password.

---

## 5. Create an admin user (optional)

Using **MongoDB Compass** or **mongosh**:

1. Connect to `mongodb://localhost:27017`
2. Open database **weggo**, collection **users**
3. Find your user (by email) and edit: set **`role`** to **`"admin"**
4. Save

Or add a new document (password will be hashed on first login via the app; for a new admin you’d normally register in the app first, then change `role` to `admin` in the DB).

Then go to **http://localhost:3000/admin** and log in with that user’s email and password.

---

## 6. Health check

- **http://localhost:3000/api/health** – Should return `{"success":true,"status":"ok","database":"connected"}` if MongoDB is connected.

---

## Troubleshooting

- **“MongoServerError” or “connect ECONNREFUSED”** – MongoDB is not running. Start it (step 1).
- **Blank page or 500** – Check the terminal where `npm run dev` is running for errors. Ensure `.env` exists and has `MONGODB_URI`.
- **Images not showing** – Uploaded images are stored in `public/uploads`. If the folder is missing, it’s created when you create your first listing with a photo.
