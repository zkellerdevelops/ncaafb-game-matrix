/* CFB live scoreboard — pulls live data from ESPN's public scoreboard API. */

// League + conference data live in leagues.js (global LEAGUES); this page and
// the helmet schedule share the same selection via localStorage.
let { leagueKey, confKey } = initialSelection();
let league = LEAGUES[leagueKey];
let conf = league.conferences[confKey];

const els = {
  matrix: document.getElementById("matrix"),
  status: document.getElementById("status"),
  weekLabel: document.getElementById("week-label"),
  tabs: document.getElementById("conf-tabs"),
  leagueToggle: document.getElementById("league-toggle"),
  refresh: document.getElementById("refresh-btn"),
  theme: document.getElementById("theme-btn"),
};

/* ---------- Theme toggle: auto -> light -> dark -> auto ---------- */
const THEME_KEY = "sec-matrix-theme";
const THEME_ORDER = ["auto", "light", "dark"];

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.theme.title = `Theme: ${theme} (click to change)`;
}

function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "auto");
}

els.theme.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "auto";
  const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

/* ---------- Rendering ---------- */
const UNRANKED = 99; // ESPN uses 99 for "not in the poll".

function formatKickoff(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function locationText(competition) {
  const v = competition.venue || {};
  const addr = v.address || {};
  const place = [addr.city, addr.state].filter(Boolean).join(", ");
  const name = v.fullName || "Venue TBD";
  return { name, place };
}

function teamRow(competitor) {
  const t = competitor.team || {};
  const rank = competitor.curatedRank ? competitor.curatedRank.current : UNRANKED;
  const ranked = rank && rank !== UNRANKED;
  const logo = t.logo || (t.logos && t.logos[0] && t.logos[0].href) || "";
  const winner = competitor.winner === true;
  const score = competitor.score;

  const rankHtml = ranked ? `<span class="team-rank">#${rank}</span>` : "";
  const scoreHtml = score != null && score !== "" ? `<span class="team-score">${score}</span>` : "";
  const logoHtml = logo
    ? `<img class="team-logo" src="${logo}" alt="" loading="lazy" />`
    : `<div class="team-logo" aria-hidden="true"></div>`;

  return `
    <div class="team${winner ? " is-winner" : ""}">
      ${logoHtml}
      <div class="team-main">
        ${rankHtml}
        <span class="team-name">${t.displayName || t.name || "TBD"}</span>
      </div>
      ${scoreHtml}
    </div>`;
}

function gameCard(event) {
  const comp = event.competitions[0];
  const competitors = comp.competitors || [];
  const away = competitors.find((c) => c.homeAway === "away") || competitors[0];
  const home = competitors.find((c) => c.homeAway === "home") || competitors[1];

  const status = event.status && event.status.type ? event.status.type : {};
  const loc = locationText(comp);
  const neutral = comp.neutralSite === true;

  let badge = formatKickoff(event.date);
  if (status.state === "in") badge = status.shortDetail || "Live";
  else if (status.state === "post") badge = "Final";

  const neutralTag = neutral ? `<span class="game-badge">Neutral site</span>` : "";

  return `
    <article class="game">
      <div class="game-head">
        <span class="game-date">${badge}</span>
        ${neutralTag}
      </div>
      <div class="teams">
        ${teamRow(away)}
        ${teamRow(home)}
      </div>
      <div class="game-foot">
        <span class="pin" aria-hidden="true">📍</span>
        <span>
          <span class="venue-name">${loc.name}</span>${loc.place ? ` · ${loc.place}` : ""}
        </span>
      </div>
    </article>`;
}

function setStatus(msg, isError) {
  if (!msg) {
    els.status.classList.add("hidden");
    return;
  }
  els.status.textContent = msg;
  els.status.classList.remove("hidden");
  els.status.classList.toggle("error", !!isError);
}

async function load() {
  setStatus("Loading matchups…", false);
  els.refresh.disabled = true;
  const loadingConf = confKey; // guard against stale responses after a tab switch
  try {
    // College filters by conference group; the NFL scoreboard returns every
    // game, so we filter it down to the selected division's teams client-side.
    const base = `https://site.api.espn.com/apis/site/v2/sports/football/${league.sport}/scoreboard`;
    const url = conf.group != null ? `${base}?groups=${conf.group}&limit=100` : `${base}?limit=100`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (loadingConf !== confKey) return; // a newer tab was selected mid-flight

    const season = data.season && data.season.year;
    const week = data.week && data.week.number;
    els.weekLabel.textContent =
      `${conf.label}${week ? ` · Week ${week}` : ""}${season ? ` · ${season}` : ""}`;

    let events = (data.events || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    if (conf.group == null) {
      // NFL: keep only games involving a team in this division.
      const ids = new Set(conf.teams.map((t) => t.id));
      events = events.filter((e) =>
        ((e.competitions && e.competitions[0] && e.competitions[0].competitors) || []).some(
          (c) => c.team && ids.has(c.team.id)
        )
      );
    }
    if (!events.length) {
      els.matrix.innerHTML = "";
      setStatus(`No ${conf.label} games scheduled for this week.`, false);
      return;
    }

    els.matrix.innerHTML = events.map(gameCard).join("");
    setStatus("", false);

    // Live scoreboard: poll every 30s while any game is in progress.
    const anyLive = events.some(
      (e) => e.status && e.status.type && e.status.type.state === "in"
    );
    scheduleLiveRefresh(anyLive);
  } catch (err) {
    els.matrix.innerHTML = "";
    setStatus(`Couldn't load matchups (${err.message}). Check your connection and retry.`, true);
  } finally {
    els.refresh.disabled = false;
  }
}

let liveTimer = null;
function scheduleLiveRefresh(anyLive) {
  clearTimeout(liveTimer);
  if (anyLive) liveTimer = setTimeout(load, 30000);
}

els.refresh.addEventListener("click", load);

/* ---------- League toggle (College / NFL) ---------- */
function renderLeagueToggle() {
  els.leagueToggle.innerHTML = Object.entries(LEAGUES)
    .map(
      ([key, lg]) =>
        `<button class="league-btn ${key === leagueKey ? "active" : ""}" type="button"
                 data-league="${key}" aria-pressed="${key === leagueKey}">${lg.label}</button>`
    )
    .join("");
}
function switchLeague(key) {
  if (!LEAGUES[key] || key === leagueKey) return;
  leagueKey = key;
  league = LEAGUES[key];
  confKey = confForLeague(key);
  conf = league.conferences[confKey];
  localStorage.setItem(LEAGUE_KEY, key);
  rememberConf(key, confKey);
  clearTimeout(liveTimer);
  renderLeagueToggle();
  renderTabs();
  load();
}
els.leagueToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-league]");
  if (btn) switchLeague(btn.getAttribute("data-league"));
});

/* ---------- Conference tabs ---------- */
function renderTabs() {
  els.tabs.innerHTML = Object.entries(league.conferences)
    .map(
      ([key, c]) =>
        `<button class="tab ${key === confKey ? "active" : ""}" type="button"
                 data-conf="${key}" aria-pressed="${key === confKey}">${c.label}</button>`
    )
    .join("");
}
function switchConference(key) {
  if (!league.conferences[key] || key === confKey) return;
  confKey = key;
  conf = league.conferences[key];
  rememberConf(leagueKey, key);
  clearTimeout(liveTimer); // stop polling the conference we just left
  renderTabs();
  load();
}
els.tabs.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-conf]");
  if (btn) switchConference(btn.getAttribute("data-conf"));
});

// Tuck the floating action group away near the bottom of the page so the last
// cards aren't blocked; it slides back as soon as the user scrolls up.
window.addEventListener(
  "scroll",
  () => {
    const de = document.documentElement;
    const max = de.scrollHeight - window.innerHeight;
    document.body.classList.toggle("fab-tucked", max > 8 && max - window.scrollY <= 96);
  },
  { passive: true }
);

initTheme();
renderLeagueToggle();
renderTabs();
load();
