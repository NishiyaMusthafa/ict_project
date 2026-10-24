# 🎓 LostLoop — Modern Campus Lost & Found Platform

> *"Lost something? Let's bring it back."*

LostLoop is a full-stack modern web application built specifically for college campuses. It empowers students, faculty, and campus security to report misplaced items, browse found belongings, file claims with verified proof, and safely reunite belongings with their rightful owners.

---

## 🌟 Key Features

1. **Modern SaaS UI/UX**
   - Clean, friendly aesthetic styled in **Deep Midnight Navy**, **Vibrant Violet**, and **Warm Off-White**.
   - Accessible badges, loading skeleton cards, responsive desktop/tablet/mobile layouts, and smooth animations using Lucide icons & Framer Motion.
2. **Interactive Landing Page**
   - Hero banner with quick action CTAs ("Explore Items", "Report an Item").
   - Live campus statistics counters (Total Lost, Found Belongings, Reunited Count, Success Rate).
   - 3-step "How It Works" visual guide and interactive category browser.
3. **Comprehensive Browse & Filtering**
   - Search by title and keywords.
   - Filter by Type (*Lost*, *Found*), Category, Campus Location (Library, SAC, Sports Arena, Cafeteria, etc.), and Status (*Open*, *Reunited*).
   - Sort by Newest or Date Occurred with working pagination.
4. **Item Details & Claim Workflow**
   - Detailed view with photo display and elegant category fallbacks.
   - **Privacy Guarded:** Protects student phone and email from unauthenticated public visitors.
   - **Submit Claim:** Authenticated students can file claims for found items with detailed ownership proof (scratches, stickers, serial numbers, wallpapers).
   - **Ownership Protection:** Prevents students from claiming their own posts and blocks duplicate claims.
5. **Student Dashboard**
   - Personal statistics (My Posts, Active Listings, Reunited Items, Pending Claims).
   - **My Reported Items:** Manage, edit, and delete your listings.
   - **Incoming Claims:** Review claims filed on your found items; Approve or Reject with personalized return notes.
   - **My Submitted Claims:** Real-time tracking of claims you submitted for other items.
6. **Administrative Moderation Console (`/admin`)**
   - Admin-only protected route & backend middleware.
   - Platform-wide statistics (registered students, lost vs. found ratios, resolution rate).
   - One-click spam and inappropriate listing moderation/deletion.
   - Full claim audit and registered campus user directory.
7. **Robust Security**
   - Bcrypt password hashing (never plaintext).
   - JWT authentication with Bearer token header interceptor.
   - Helmet protection, CORS configuration, centralized error handling, and express rate limiting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React, Framer Motion |
| **Backend** | Node.js, Express.js, Helmet, CORS, Express Rate Limit, Multer |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS |
| **Notifications** | React Hot Toast |
| **API Client** | Axios with request & response interceptors |

---

## 📁 Project Structure

```text
lostloop/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/client.js       # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── common/         # ItemCard, StatusBadge, LoadingSkeleton, EmptyState, Modal
│   │   │   └── layout/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext (login, register, logout, session)
│   │   ├── pages/              # Home, Browse, Details, Report, Edit, Dashboard, Admin, Auth
│   │   ├── styles/index.css    # Tailwind directives & design system
│   │   ├── App.jsx             # Route definitions & Toast container
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express.js Backend REST API
│   ├── src/
│   │   ├── config/db.js        # Mongoose connection & health diagnostics
│   │   ├── controllers/        # Auth, Item, Claim, Dashboard, Admin controllers
│   │   ├── middleware/         # protect (JWT), requireAdmin, errorHandler, upload
│   │   ├── models/             # User, Item, Claim Mongoose schemas & indexes
│   │   ├── routes/             # auth, items, claims, dashboard, admin, upload
│   │   ├── scripts/            # seedAdmin.js, seedDemoData.js
│   │   └── server.js           # Express app initialization
│   ├── .env.example            # Environment variables template
│   ├── .env                    # Active local environment variables
│   └── package.json
│
├── .gitignore
├── package.json                # Root monorepo runner scripts
└── README.md                   # Complete documentation & viva guide
```

---

## 🚀 Quick Setup & Run Instructions

### Step 1: Open the Project in VS Code
Open VS Code, click **File > Open Folder**, and select the `lostloop` directory.

### Step 2: Configure MongoDB Atlas

LostLoop uses MongoDB for storing users, items, and claims. You can use a free **MongoDB Atlas** cloud database:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Security > Database Access**, create a database user (e.g., username `lostloop_admin` and a strong password).
4. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your local app can connect.
5. In your Cluster dashboard, click **Connect > Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lostloop?retryWrites=true&w=majority
   ```
6. Open `server/.env` in VS Code and replace the placeholder with your actual connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://lostloop_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lostloop?retryWrites=true&w=majority
   JWT_SECRET=lostloop_super_secret_jwt_key_2026_campus
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

*(Note: If you have MongoDB installed locally on your computer, you can simply keep `mongodb://127.0.0.1:27017/lostloop`)*

---

### Step 3: Seed Demo Data (Admin & Student Accounts)

Open your terminal in VS Code and run the database seeder:

```powershell
cd server
npm run seed:demo
```

This will automatically create:
- **Campus Admin Account:** `admin@campus.edu` / `Admin@LostLoop123`
- **Student Account (Alex):** `alex@campus.edu` / `StudentPass123!`
- **Student Account (Priya):** `priya@campus.edu` / `StudentPass123!`
- **Realistic Campus Listings:** AirPods Pro in Main Library, Hydro Flask in SAC, Casio Calculator in Engineering Block, Honda Key Fob at Football Track, Student ID cards, etc.
- **Sample Claim & Resolution:** Demonstrates a completed claim cycle.

*(Or to only create the Admin account without demo listings, run: `npm run seed:admin`)*

---

### Step 4: Start the Servers

You will run the backend and frontend in two separate VS Code terminal tabs:

#### Terminal 1 — Start the Backend Server:
```powershell
cd server
npm run dev
```
> The server will start at `http://localhost:5000` (or `http://localhost:5001` if port 5000 is occupied).  
> You will see `✅ MongoDB Connected successfully`.

#### Terminal 2 — Start the Frontend:
Click the `+` button in your VS Code terminal to open a second tab:
```powershell
cd client
npm run dev
```
> The frontend will start at `http://localhost:5173`.

---

### Step 5: Open in Your Browser

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🧪 Complete Test Walkthrough (For Evaluation / Presentation)

Here is a recommended 5-minute demo script to show your college professor or evaluator:

1. **Landing Page Tour (`/`):**
   - Point out the headline *"Lost something? Let's bring it back."*
   - Show the dynamic statistics counters (connected to the `/api/items/stats/summary` endpoint).
   - Scroll through "How It Works" and "Recently Reported Items".
2. **Search & Filter Items (`/items`):**
   - Click "Explore Items" in the navbar.
   - Switch between **All Items**, **Lost Only**, and **Found Only** tabs.
   - Test category dropdown (e.g., select *Electronics & Gadgets*).
   - Test keyword search (e.g., type *"AirPods"* or *"Hydro Flask"*).
3. **Inspect Item & Safety Features (`/items/:id`):**
   - Open any item card.
   - Point out that personal contact details are safely masked for anonymous visitors.
4. **Log In (Evaluation Fast-Pass):**
   - Click **Log In** in the top navigation.
   - Use the **"Evaluation Fast-Pass"** button: Click **"Student (Alex)"** to instantly auto-fill credentials and click **Sign In**.
5. **Student Dashboard (`/dashboard`):**
   - Show the personal dashboard with Alex's reported posts.
   - Switch to the **"Incoming Claims"** tab to see claims other students submitted on Alex's items.
   - Click **"Approve Claim"** to demonstrate marking the item as **Reunited** and resolving the claim with a personalized return note.
6. **Report an Item (`/report`):**
   - Click **Report Item**.
   - Fill in a sample post (e.g., "Casio Watch found in Library Room 204").
   - Attach an image or preview.
   - Submit and verify it instantly appears on the Browse page!
7. **Admin Moderation Console (`/admin`):**
   - Sign out and log in with the **"Campus Admin"** button (`admin@campus.edu`).
   - Click **Admin Panel** in the navbar.
   - Show the platform-wide audit: view all users, review incoming claims, and demonstrate removing spam or inappropriate posts with one click.

---

## 🎓 Viva / Exam Q&A Guide (College Project Evaluation)

| Question | Simple, High-Scoring Answer |
|---|---|
| **What is the MERN stack in this project?** | MongoDB (NoSQL database for flexible item documents), Express.js (lightweight REST API routing), React with Vite (fast, reactive single-page frontend), and Node.js (runtime environment). |
| **How is authentication secured?** | Passwords are encrypted before database insertion using `bcryptjs` salts. Upon valid login, a signed JSON Web Token (JWT) is issued. Protected routes verify the `Authorization: Bearer <token>` header via Express middleware (`protect`). |
| **How are conflicting claims prevented?** | The `Claim` collection uses a compound unique index on `{ item: 1, claimedBy: 1 }` so a student cannot spam multiple claims on the same item. When an owner approves a claim, the item status changes to `resolved` and competing pending claims are automatically transitioned to `rejected`. |
| **How is student privacy protected?** | The backend sanitizes the user model before sending JSON responses (`delete obj.password`). Furthermore, phone numbers and personal emails are hidden from public visitors on the item details route unless the requester is the item's poster or an authorized administrator. |
| **How is image upload handled?** | If Cloudinary API credentials are provided in `.env`, the server streams uploads to Cloudinary CDN. In offline college lab environments, it automatically falls back to clean, optimized Base64 data previews so no paid account is required. |

---

## 📄 License
This project was created for educational purposes and campus community evaluation. Distributed under the MIT License.


---

## 🌐 Deploy the frontend on GitHub Pages

This repository includes `.github/workflows/deploy-pages.yml`, which builds and deploys **only the React frontend** from `client/` when you push to the `main` branch.

1. Push this project to a GitHub repository. Keep the `.github/workflows/deploy-pages.yml` file.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. If the backend is already deployed, open **Settings → Secrets and variables → Actions → Variables** and create a repository variable named `VITE_API_URL` with your backend API base URL, for example `https://your-backend.example.com/api`. Do not include a trailing slash.
5. Push a commit to `main`, or run the workflow from **Actions → Deploy LostLoop frontend to GitHub Pages → Run workflow**.
6. After the workflow succeeds, open the Pages URL shown in the workflow deployment summary.

**Important:** GitHub Pages hosts static frontend files only. It cannot run the Express/Node backend or MongoDB. Login, registration, item listing, claims, uploads, and dashboard features need the backend deployed separately (for example, on a Node hosting service) and connected through the `VITE_API_URL` variable. Until that is configured, the frontend may load but API-powered features will not work.

This version uses hash-based URLs (`/#/items`, etc.) so React Router routes work on GitHub Pages without server-side rewrite configuration. For local development, run the backend and frontend as described below.


---

## 📦 Push this project to a new GitHub repository

This source package intentionally excludes the old `.git` history, so it can be connected to a fresh repository.

1. Create a **new empty repository** on GitHub. Do not initialize it with a README, license, or `.gitignore`.
2. Extract this ZIP file.
3. Open a terminal in the extracted `lostloop-main` folder (the folder containing the root `package.json`).
4. Run:

```bash
git init
git add .
git status
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-NEW-REPO.git
git push -u origin main
```

Replace `YOUR-USERNAME/YOUR-NEW-REPO` with the new repository details. If Git says `nothing to commit`, check `git status`; the files may already have been committed.

### Before deploying

- Copy `server/.env.example` to `server/.env` and set your real MongoDB URI and a long, random `JWT_SECRET`. Never commit `.env` files or real credentials.
- Copy `client/.env.example` to `client/.env` for local configuration, then set `VITE_API_URL` to your backend API URL when deploying.
- GitHub Pages can host the frontend only. The Express server and MongoDB must be hosted separately.
- For the existing GitHub Pages workflow, add a repository variable named `VITE_API_URL` under **Settings → Secrets and variables → Actions → Variables**. Set it to the deployed backend URL ending in `/api`. Also enable GitHub Pages to deploy using **GitHub Actions** in the repository's Pages settings.
