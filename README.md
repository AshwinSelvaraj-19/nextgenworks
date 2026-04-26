# NextGen Work — Full Stack Website

A complete freelance service website with backend + database.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)

## Project Structure
```
nextgenwork/
├── server.js          ← Backend server
├── package.json       ← Dependencies
├── nextgenwork.db     ← Database (auto-created)
└── public/
    ├── index.html     ← Main website
    └── admin.html     ← Admin panel
```

## Setup & Run

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)

### Step 2 — Install dependencies
Open terminal in this folder and run:
```bash
npm install
```

### Step 3 — Start the server
```bash
npm start
```

### Step 4 — Open in browser
- Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin.html

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/services | Get all services |
| POST | /api/enquiry | Submit new enquiry |
| GET | /api/admin/enquiries | Get all enquiries |
| PATCH | /api/admin/enquiries/:id | Update enquiry status |
| DELETE | /api/admin/enquiries/:id | Delete enquiry |

## Before Going Live — Update These
1. In `public/index.html`:
   - Replace `91XXXXXXXXXX` with your WhatsApp number
   - Replace `nextgenwork@gmail.com` with your real email
   - Replace `@nextgenwork` with your Instagram handle

## Free Deployment Options
1. **Railway.app** — Free Node.js hosting (easiest)
2. **Render.com** — Free backend hosting
3. **Cyclic.sh** — Free Node.js apps

## Deploy on Railway (Recommended)
1. Push this project to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Select your repo → Deploy
4. Your site goes live in 2 minutes! 🚀
