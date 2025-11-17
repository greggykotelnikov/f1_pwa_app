-- Season table
CREATE TABLE season(
    id INTEGER PRIMARY KEY,
    year INTEGER,
    races INTEGER,
    currentRound INTEGER
);

-- Driver standings
CREATE TABLE driver_standings(
    id INTEGER PRIMARY KEY,
    season_id INTEGER,
    driver TEXT,
    team TEXT,
    points INTEGER,
    FOREIGN KEY(season_id) REFERENCES season(id)
);

-- Team standings
CREATE TABLE team_standings(
    id INTEGER PRIMARY KEY,
    season_id INTEGER,
    team TEXT,
    points INTEGER,
    icon TEXT,
    FOREIGN KEY(season_id) REFERENCES season(id)
);

-- Driver stats
CREATE TABLE driver_stats(
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
