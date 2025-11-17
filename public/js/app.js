fetch("/api/season/2024")
    .then(res => res.json())
    .then(data => {
        loadSeasonOverview(data);
        loadDriverStandings(data);
        loadTeamStandings(data);
        loadDriverStats(data);
    });

function loadSeasonOverview(data) {
    document.getElementById("season-overview").innerText =
        `${data.season.year} • ${data.season.races} races • Current Round: ${data.season.currentRound}`;
}

function loadDriverStandings(data) {
    const table = document.getElementById("driver-standings-table");
    table.innerHTML = `<tr><th>Pos</th><th>Driver</th><th>Team</th><th>Points</th></tr>`;
    data.driverStandings.forEach((d, i) => {
        table.innerHTML += `<tr>
            <td>${i+1}</td>
            <td>${d.driver}</td>
            <td>${d.team}</td>
            <td>${d.points}</td>
        </tr>`;
    });
}

function loadTeamStandings(data) {
    const table = document.getElementById("team-standings-table");
    table.innerHTML = `<tr><th>Pos</th><th>Team</th><th>Points</th></tr>`;
    data.teamStandings.forEach((t, i) => {
        table.innerHTML += `<tr>
            <td>${i+1}</td>
            <td>${t.team} <img src="${t.icon}" class="team-icon"/></td>
            <td>${t.points}</td>
        </tr>`;
    });
}

function loadDriverStats(data) {
    const div = document.getElementById("driver-stats");
    div.innerHTML = "";
    data.driverStats.forEach(driver => {
        div.innerHTML += `<div class="dashboard-card">
            <img src="${driver.photo}" alt="${driver.driver}" class="driver-photo"/>
            <h3>${driver.driver}</h3>
            <p><strong>Team:</strong> ${driver.team} <img src="/images/teams/${driver.team.toLowerCase().replace(' ','_')}.png" class="team-icon" /></p>
            <p><strong>Wins:</strong> ${driver.wins}</p>
            <p><strong>Podiums:</strong> ${driver.podiums}</p>
            <p><strong>Pole Positions:</strong> ${driver.poles}</p>
        </div>`;
    });
}   