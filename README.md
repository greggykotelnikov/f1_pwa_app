# F1 Dashboard PWA

A Formula 1 dashboard built as an installable Progressive Web App. Fans can
browse driver and constructor standings, search, sort and filter the data,
watch season highlights, and post on a community board after signing in.

I built it starting from November 2025 to January 2026
assessment and it was one of my first full-stack projects.

## Features

- Dashboard with an image carousel and driver and constructor standings
- Search, sorting and filtering of standings and driver stats
- Season overview and F1 highlights pages with embedded videos
- Signup and login with bcrypt-hashed passwords and `express-session` sessions
- Community posts board for signed-in users
- Admin-only endpoint for listing users
- Installable PWA with a web app manifest and an offline-caching service worker

## Tech

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express, express-session, bcrypt
- **Database:** SQLite (`sqlite3`), schema in `.database/myQuery_fixed.sql`

## Running it locally

```bash
npm install
cp .env.example .env   # then set SESSION_SECRET
npm start
```

Then open <http://localhost:5000>.

## API

| Method | Route               | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/signup`       | Create an account                 |
| POST   | `/api/login`        | Log in                            |
| POST   | `/api/logout`       | Log out                           |
| GET    | `/api/me`           | Current user                      |
| GET    | `/api/season/:year` | Season, standings and driver stats |
| GET    | `/api/posts`        | List posts                        |
| POST   | `/api/posts`        | Create a post (signed in)         |
| GET    | `/api/admin/users`  | List users (admin only)           |
