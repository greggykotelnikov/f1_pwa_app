// Load environment variables from .env
require("dotenv").config();

// Import required modules
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const fetch = require("node-fetch");

// Create express app
const app = express();

// Connect to SQLite database
const db = new sqlite3.Database("./.database/f1data.db");

// Initialize posts table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Middlewares for JSON parsing + static files
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Session system (stores logged-in user)
app.use(session({
    secret: process.env.SESSION_SECRET,   // Secret used to sign cookies
    resave: false,                        // Don't save session if unchanged
    saveUninitialized: false              // Don't create empty sessions
}));






// ---------- SIGNUP ----------
app.post("/api/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).send("Missing fields");

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.code === "SQLITE_CONSTRAINT") {
                        return res.status(400).send("User already exists");
                    }
                    return res.status(500).send("Database error");
                }

                req.session.userId = this.lastID;
                res.redirect("/index.html");   // <-- redirect instead of JSON
            }
        );
    } catch (e) {
        res.status(500).send("Server error");
    }
});

// ---------- LOGIN ----------
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).send("Missing fields");

    try {
        db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
            if (err) return res.status(500).send("Database error");
            if (!user) return res.status(400).send("Invalid credentials");

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.userId = user.id;
                res.redirect("/index.html");   // <-- redirect instead of JSON
            } else {
                res.status(400).send("Invalid credentials");
            }
        });
    } catch (e) {
        res.status(500).send("Server error");
    }
});


// ---------- LOGOUT ----------
app.post("/api/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out" });
    });
});

// ---------- GET CURRENT USER ----------
app.get("/api/me", (req, res) => {
    if (!req.session.userId)
        return res.status(401).json({ error: "Not logged in" });

    db.get(
        "SELECT username, isAdmin, fantasyTeam FROM users WHERE id = ?",
        [req.session.userId],
        (err, user) => {
            if (err || !user)
                return res.status(500).json({ error: "User not found" });

            res.json(user);
        }
    );
});


// ---------- UPDATE FANTASY TEAM ----------
app.post("/api/fantasy", (req, res) => {
    if (!req.session.userId)
        return res.status(401).json({ error: "Not logged in" });

    const fantasyTeam = JSON.stringify(req.body.fantasyTeam || []);

    db.run(
        "UPDATE users SET fantasyTeam = ? WHERE id = ?",
        [fantasyTeam, req.session.userId],
        err => {
            if (err) return res.status(500).json({ error: "Update failed" });
            res.json({ message: "Fantasy team updated" });
        }
    );
});


// ---------- ADMIN: LIST ALL USERS ----------
app.get("/api/admin/users", (req, res) => {
    if (!req.session.userId)
        return res.status(401).json({ error: "Not logged in" });

    db.get("SELECT isAdmin FROM users WHERE id = ?", [req.session.userId], (err, user) => {
        if (!user || user.isAdmin !== 1)
            return res.status(403).json({ error: "Forbidden" });

        db.all("SELECT id, username, fantasyTeam, isAdmin FROM users", [], (err, users) => {
            res.json(users);
        });
    });
});


// ---------- SEASON API ----------
app.get("/api/season/:year", (req, res) => {
    const year = req.params.year;
    const data = {};

    db.get("SELECT * FROM season WHERE year = ?", [year], (err, season) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!season) return res.status(404).json({ error: "Season not found" });
        data.season = season;

        db.all("SELECT * FROM driver_standings WHERE season_id = ?", [season.id], (err, drivers) => {
            if (err) return res.status(500).json({ error: err.message });
            data.driverStandings = drivers;

            db.all("SELECT * FROM team_standings WHERE season_id = ?", [season.id], (err, teams) => {
                if (err) return res.status(500).json({ error: err.message });
                data.teamStandings = teams;

                db.all("SELECT * FROM driver_stats WHERE season_id = ?", [season.id], (err, stats) => {
                    if (err) return res.status(500).json({ error: err.message });
                    data.driverStats = stats;

                    res.json(data);
                });
            });
        });
    });
});


// ---------- POSTS ----------
app.get("/api/posts", (req, res) => {
    db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/api/posts", (req, res) => {
    const { user_email, content } = req.body;

    if (!user_email || !content)
        return res.status(400).json({ error: "Missing fields" });

    db.run(
        "INSERT INTO posts (user_email, content) VALUES (?, ?)",
        [user_email, content],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// ---------- START SERVER ----------
app.listen(5000, "0.0.0.0", () =>
    console.log("Server running on http://0.0.0.0:5000")
);
