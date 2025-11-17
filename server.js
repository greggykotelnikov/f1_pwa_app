const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./.database/f1data.db");

app.use(express.static(path.join(__dirname, "public")));

// Endpoint to get all data for a season
app.get("/api/season/:year", (req, res) => {
    const year = req.params.year;
    const data = {};

    db.get("SELECT * FROM season WHERE year = ?", [year], (err, season) => {
        if (err) return res.status(500).json({error: err.message});
        data.season = season;

        db.all("SELECT * FROM driver_standings WHERE season_id = ?", [season.id], (err, drivers) => {
            if (err) return res.status(500).json({error: err.message});
            data.driverStandings = drivers;

            db.all("SELECT * FROM team_standings WHERE season_id = ?", [season.id], (err, teams) => {
                if (err) return res.status(500).json({error: err.message});
                data.teamStandings = teams;

                db.all("SELECT * FROM driver_stats WHERE season_id = ?", [season.id], (err, stats) => {
                    if (err) return res.status(500).json({error: err.message});
                    data.driverStats = stats;

                    res.json(data);
                });
            });
        });
    });
});

app.listen(8080, () => console.log("Server running on http://localhost:8080"));
