-- Season table
CREATE TABLE IF NOT EXISTS season(
    id INTEGER PRIMARY KEY,
    year INTEGER,
    races INTEGER,
    currentRound INTEGER
);

-- Driver standings
CREATE TABLE IF NOT EXISTS driver_standings(
    id INTEGER PRIMARY KEY,
    season_id INTEGER,
    driver TEXT,
    team TEXT,
    points INTEGER,
    FOREIGN KEY(season_id) REFERENCES season(id)
);

-- Team standings
CREATE TABLE IF NOT EXISTS team_standings(
    id INTEGER PRIMARY KEY,
    season_id INTEGER,
    team TEXT,
    points INTEGER,
    icon TEXT,
    FOREIGN KEY(season_id) REFERENCES season(id)
);

-- Driver stats
CREATE TABLE IF NOT EXISTS driver_stats(
    id INTEGER PRIMARY KEY,
    season_id INTEGER,
    driver TEXT,
    team TEXT,
    wins INTEGER,
    podiums INTEGER,
    poles INTEGER,
    photo TEXT,
    FOREIGN KEY(season_id) REFERENCES season(id)
);

-- Posts table for F1 PWA
CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0,
    fantasyTeam TEXT DEFAULT '{}'
);  
