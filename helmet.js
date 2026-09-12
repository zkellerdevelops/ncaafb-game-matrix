/* CFB full-season helmet matrix — rows = conference teams, columns = weeks, cells = opponent helmets. */

const SEASON = 2026;

// League + conference data live in leagues.js (global LEAGUES). These helpers
// read the currently selected league/conference from state.
function currentLeague() {
  return LEAGUES[state.leagueKey] || LEAGUES.college;
}
function confs() {
  return currentLeague().conferences;
}
function currentConf() {
  return confs()[state.confKey] || confs()[firstConfKey(state.leagueKey)];
}
function confTeams() {
  return currentConf().teams;
}

const els = {
  grid: document.getElementById("grid"),
  gridWrap: document.getElementById("grid-wrap"),
  topChrome: document.getElementById("top-chrome"),
  tabs: document.getElementById("conf-tabs"),
  leagueToggle: document.getElementById("league-toggle"),
  status: document.getElementById("status"),
  refresh: document.getElementById("refresh-btn"),
  theme: document.getElementById("theme-btn"),
};

/* ---------- Headroom: hide the header/tabs on scroll-down, reveal on scroll-up ---------- */
function initHeadroom() {
  const measure = () => {
    document.documentElement.style.setProperty("--chrome-h", `${els.topChrome.offsetHeight}px`);
    if (state.built) updateFabClearance(); // table fit vs viewport can change on resize
  };
  measure();
  window.addEventListener("resize", measure);

  let lastY = 0;
  const THRESHOLD = 6;
  els.gridWrap.addEventListener(
    "scroll",
    () => {
      const y = els.gridWrap.scrollTop;
      // Toggling the header changes .grid-wrap's height, which shifts scrollTop
      // near the bottom. Freeze the chrome state in that zone so those layout-
      // induced shifts can't be misread as user scroll and oscillate the header.
      const chromeH = els.topChrome.offsetHeight;
      const nearBottom =
        y >= els.gridWrap.scrollHeight - els.gridWrap.clientHeight - chromeH - 4;
      if (y <= 4) {
        document.body.classList.remove("chrome-hidden"); // always show at the top
      } else if (nearBottom) {
        // hold current state near the bottom
      } else if (y > lastY + THRESHOLD) {
        document.body.classList.add("chrome-hidden"); // scrolling down
      } else if (y < lastY - THRESHOLD) {
        document.body.classList.remove("chrome-hidden"); // scrolling up
      }
      lastY = y;
    },
    { passive: true }
  );
}

/* ---------- Theme: auto -> light -> dark ---------- */
const THEME_KEY = "sec-matrix-theme";

function resolvedTheme() {
  const t = document.documentElement.getAttribute("data-theme") || "auto";
  if (t !== "auto") return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.theme.title = `Theme: ${theme} (click to change)`;
}
function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "auto");
}
els.theme.addEventListener("click", () => {
  // Flip against what's actually on screen (resolving "auto" via the OS) so a
  // single press always changes the visible theme.
  const current = document.documentElement.getAttribute("data-theme") || "auto";
  const effective =
    current === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : current;
  const next = effective === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  if (state.built) render(); // re-render so helmet logos use the right light/dark variant
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if ((document.documentElement.getAttribute("data-theme") || "auto") === "auto" && state.built) render();
});

/* ---------- Favorite team (one per conference) ---------- */
const FAV_KEY = "cfb-fav-teams"; // map of conference key -> favorite team id
const LEGACY_FAV_KEY = "sec-fav-team"; // single global favorite from earlier versions

function loadFavorites() {
  let map = {};
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === "object") map = parsed;
  } catch {
    map = {};
  }
  // Migrate the old single favorite into the SEC slot, once.
  const legacy = localStorage.getItem(LEGACY_FAV_KEY);
  if (legacy && !("sec" in map)) {
    map.sec = legacy;
    localStorage.setItem(FAV_KEY, JSON.stringify(map));
  }
  localStorage.removeItem(LEGACY_FAV_KEY);
  return map;
}
const favorites = loadFavorites();

function getFavorite(confKey) {
  return favorites[confKey] || null;
}
function setFavorite(id) {
  if (id) favorites[state.confKey] = id;
  else delete favorites[state.confKey];
  localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  state.favoriteId = getFavorite(state.confKey);
  if (state.built) render();
}
// Sort key for a team's game in the week being sorted on: earliest kickoff first,
// TBD times after known kickoffs, and byes (no game) last.
function kickoffSortKey(team) {
  const g = (state.grid[team.id] || {})[state.sortWeek];
  if (!g || !g.date) return Number.POSITIVE_INFINITY; // bye / no game → bottom
  const t = new Date(g.date).getTime();
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return g.timeTbd ? t + 1e12 : t; // undecided kickoff → after the known ones
}

// Favorite first (only if it's in the current conference); the rest either
// alphabetical (default) or by the selected week's kickoff time.
function orderedTeams() {
  let teams = confTeams();
  if (state.sortWeek != null) {
    teams = teams.slice().sort((a, b) => {
      const ka = kickoffSortKey(a), kb = kickoffSortKey(b);
      return ka !== kb ? ka - kb : a.name.localeCompare(b.name);
    });
  }
  if (!state.favoriteId) return teams;
  const fav = teams.filter((t) => t.id === state.favoriteId);
  const rest = teams.filter((t) => t.id !== state.favoriteId);
  return [...fav, ...rest];
}

/* ---------- Data ---------- */
const state = {
  grid: {},
  weeks: [],
  weekDates: {},
  currentWeek: null,
  built: false,
  leagueKey: initialSelection().leagueKey,
  confKey: initialSelection().confKey,
  favoriteId: getFavorite(initialSelection().confKey),
  sortWeek: null, // when set, rows sort by that week's kickoff (earliest first)
};

/* ---------- League toggle (College / NFL) ---------- */
function renderLeagueToggle() {
  els.leagueToggle.innerHTML = Object.entries(LEAGUES)
    .map(
      ([key, lg]) =>
        `<button class="league-btn ${key === state.leagueKey ? "active" : ""}" type="button"
                 data-league="${key}" aria-pressed="${key === state.leagueKey}">${lg.label}</button>`
    )
    .join("");
}
function switchLeague(key) {
  if (!LEAGUES[key] || key === state.leagueKey) return;
  state.leagueKey = key;
  state.confKey = confForLeague(key); // resume that league's last-viewed conference
  state.favoriteId = getFavorite(state.confKey);
  state.sortWeek = null;
  localStorage.setItem(LEAGUE_KEY, key);
  rememberConf(key, state.confKey);
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
  els.tabs.innerHTML = Object.entries(confs())
    .map(
      ([key, conf]) =>
        `<button class="tab ${key === state.confKey ? "active" : ""}" type="button"
                 data-conf="${key}" aria-pressed="${key === state.confKey}">${conf.label}</button>`
    )
    .join("");
}
function switchConference(key) {
  if (!confs()[key] || key === state.confKey) return;
  state.confKey = key;
  state.favoriteId = getFavorite(key); // each conference keeps its own favorite
  state.sortWeek = null; // reset kickoff sort when changing conferences
  rememberConf(state.leagueKey, key);
  renderTabs();
  load();
}
els.tabs.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-conf]");
  if (btn) switchConference(btn.getAttribute("data-conf"));
});

// Accepts either a roster team ({id, abbr}) or an ESPN opponent ({id, abbreviation}).
// College logos are keyed by numeric id; NFL logos by lowercase abbreviation.
function logoUrl(team, dark) {
  const lg = currentLeague();
  const slug = lg.logoBy === "abbr"
    ? String(team.abbr || team.abbreviation || "").toLowerCase()
    : team.id;
  return `https://a.espncdn.com/i/teamlogos/${lg.logoPath}/500${dark ? "-dark" : ""}/${slug}.png`;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchTeamSchedule(team) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/${currentLeague().sport}/teams/${team.id}/schedule?season=${SEASON}`;
  const data = await fetchJson(url);
  const byWeek = {};
  for (const e of data.events || []) {
    // Regular season only (seasonType 2); skip bowls / playoff.
    const st = e.seasonType && e.seasonType.type;
    if (st && st !== 2) continue;
    const wk = e.week && e.week.number;
    if (!wk) continue;
    const comp = (e.competitions && e.competitions[0]) || {};
    const competitors = comp.competitors || [];
    const me = competitors.find((c) => c.team && c.team.id === team.id);
    const opp = competitors.find((c) => c.team && c.team.id !== team.id);
    if (!opp) continue;
    const status = (e.status || comp.status || {}).type || {};
    // ESPN flags an unset kickoff with timeValid=false (time defaults to noon/midnight).
    const timeTbd = comp.timeValid === false || e.timeValid === false;
    const scoreStr = (c) => {
      const s = c && c.score;
      if (s == null) return null;
      return typeof s === "object" ? s.displayValue : String(s);
    };
    byWeek[wk] = {
      opp: opp.team,
      homeAway: me ? me.homeAway : "home",
      neutral: comp.neutralSite === true,
      date: e.date,
      timeTbd,
      rank: opp.curatedRank ? opp.curatedRank.current : 99,
      completed: status.completed === true,
      won: me ? me.winner === true : null,
      myScore: scoreStr(me),
      oppScore: scoreStr(opp),
    };
  }
  return byWeek;
}

/* ---------- Render ---------- */
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function weekHeaderLabel(wk, sorted) {
  const iso = state.weekDates[wk];
  let dateStr = "";
  if (iso) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) {
      dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  }
  const caret = sorted ? ` <span class="sort-caret" aria-hidden="true">▲</span>` : "";
  // Keep the caret on the same line as the date (or the "Wk N" line when there's no date).
  if (dateStr) return `Wk ${wk}<span class="wk-date">${dateStr}${caret}</span>`;
  return `Wk ${wk}${caret}`;
}

function cellHtml(game, dark) {
  if (!game) return `<div class="bye">BYE</div>`;
  const opp = game.opp || {};
  const dark2 = logoUrl(opp, !dark);
  const src = logoUrl(opp, dark);
  const name = opp.abbreviation || opp.shortDisplayName || opp.displayName || "TBD";
  const ranked = game.rank && game.rank !== 99;

  let ind = "vs", cls = "vs";
  if (game.neutral) { ind = "N"; cls = "nt"; }
  else if (game.homeAway === "away") { ind = "@"; cls = "at"; }

  // Result badge (only for completed games).
  let result = null;
  if (game.completed) {
    const r = game.won === true ? "W" : game.won === false ? "L" : "T";
    const scoreTxt =
      game.myScore != null && game.oppScore != null ? `${game.myScore}-${game.oppScore}` : "";
    result = { letter: r, cls: r.toLowerCase(), score: scoreTxt };
  }

  const when = game.date
    ? new Date(game.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";

  // Kickoff time for upcoming games (hidden once a game is completed).
  let kick = "";
  if (!game.completed && game.date) {
    const d = new Date(game.date);
    if (!Number.isNaN(d.getTime())) {
      kick = game.timeTbd
        ? "TBD"
        : d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    }
  }
  const title = `${game.neutral ? "vs" : game.homeAway === "away" ? "@" : "vs"} ${opp.displayName || name}${
    ranked ? ` (#${game.rank})` : ""
  }${result ? ` — ${result.letter}${result.score ? " " + result.score : ""}` : when ? ` — ${when}` : ""}`;

  const badge = result
    ? `<span class="result ${result.cls}" title="${esc(result.score)}">${result.letter}${
        result.score ? `<span class="result-score">${esc(result.score)}</span>` : ""
      }</span>`
    : "";

  return `
    <div class="game-cell${result ? " has-result" : ""}" title="${esc(title)}">
      ${badge}
      ${ranked ? `<span class="rank">#${game.rank}</span>` : ""}
      <img src="${src}" alt="${esc(name)}" loading="lazy"
           onerror="this.onerror=null;this.src='${dark2}';" />
      <span class="ind ${cls}">${ind} ${esc(name)}</span>
      ${kick ? `<span class="kick">${esc(kick)}</span>` : ""}
    </div>`;
}

// Win-loss record from a team's completed games (e.g. "3-1").
function teamRecord(row) {
  let w = 0, l = 0;
  for (const wk of Object.keys(row)) {
    const g = row[wk];
    if (!g || !g.completed) continue;
    if (g.won === true) w++;
    else if (g.won === false) l++;
  }
  return w + l ? `${w}-${l}` : "";
}

function render() {
  const dark = resolvedTheme() === "dark";

  const head = `
    <thead>
      <tr>
        <th class="corner">Team</th>
        ${state.weeks
          .map((wk) => {
            const cls = [
              "wk-head",
              wk === state.currentWeek ? "current-col" : "",
              wk === state.sortWeek ? "sorted" : "",
            ].filter(Boolean).join(" ");
            return `<th class="${cls}" data-wk="${wk}" role="button" tabindex="0"
                        aria-sort="${wk === state.sortWeek ? "ascending" : "none"}"
                        title="Sort teams by Week ${wk} kickoff (earliest first)">${weekHeaderLabel(wk, wk === state.sortWeek)}</th>`;
          })
          .join("")}
      </tr>
    </thead>`;

  const body = orderedTeams().map((team) => {
    const row = state.grid[team.id] || {};
    const isFav = team.id === state.favoriteId;
    const record = teamRecord(row);
    const cells = state.weeks
      .map(
        (wk) =>
          `<td class="cell ${wk === state.currentWeek ? "current-col" : ""}">${cellHtml(row[wk], dark)}</td>`
      )
      .join("");
    return `
      <tr class="${isFav ? "is-fav" : ""}">
        <th class="team-cell" style="--team-color:#${team.color}" scope="row">
          <div class="team-inner">
            <div class="team-id">
              <button class="fav-btn ${isFav ? "on" : ""}" type="button"
                      data-fav-id="${team.id}" aria-pressed="${isFav}"
                      title="${isFav ? "Unfavorite " + esc(team.name) : "Favorite " + esc(team.name) + " (pins to top)"}">
                ${isFav ? "★" : "☆"}
              </button>
              <img src="${logoUrl(team, dark)}" alt=""
                   onerror="this.onerror=null;this.src='${logoUrl(team, !dark)}';" />
              <span class="t-abbr">${esc(team.abbr)}</span>
              ${record ? `<span class="t-record">${record}</span>` : ""}
            </div>
          </div>
        </th>
        ${cells}
      </tr>`;
  }).join("");

  els.grid.innerHTML = head + `<tbody>${body}</tbody>`;
  updateFabClearance();
}

// Reserve end-of-scroll clearance for the floating action group only when the
// table actually overflows (so short conferences don't show empty space).
function updateFabClearance() {
  els.gridWrap.classList.remove("has-overflow");
  if (els.grid.offsetHeight > els.gridWrap.clientHeight) {
    els.gridWrap.classList.add("has-overflow");
  }
}

function setStatus(msg, isError) {
  if (!msg) return els.status.classList.add("hidden");
  els.status.textContent = msg;
  els.status.classList.remove("hidden");
  els.status.classList.toggle("error", !!isError);
}

async function load() {
  const conf = currentConf();
  state.built = false;
  els.grid.innerHTML = "";
  setStatus(`Loading the full ${conf.label} schedule…`, false);
  els.refresh.disabled = true;
  const loadingConf = state.confKey; // guard against stale responses after a tab switch
  try {
    // Current week (for highlighting) — best-effort, non-fatal. College filters
    // by conference group; the NFL scoreboard has no group param.
    const sport = currentLeague().sport;
    const wkUrl =
      conf.group != null
        ? `https://site.api.espn.com/apis/site/v2/sports/football/${sport}/scoreboard?groups=${conf.group}`
        : `https://site.api.espn.com/apis/site/v2/sports/football/${sport}/scoreboard`;
    fetchJson(wkUrl)
      .then((sb) => {
        state.currentWeek = sb.week && sb.week.number;
        if (state.built) render();
      })
      .catch(() => {});

    const results = await Promise.all(
      conf.teams.map((t) => fetchTeamSchedule(t).then((s) => [t.id, s]).catch(() => [t.id, {}]))
    );
    if (loadingConf !== state.confKey) return; // a newer tab was selected mid-flight

    const weekSet = new Set();
    state.grid = {};
    state.weekDates = {};
    for (const [id, byWeek] of results) {
      state.grid[id] = byWeek;
      for (const wk of Object.keys(byWeek)) {
        const n = Number(wk);
        weekSet.add(n);
        // remember an example date per week for the header
        if (!state.weekDates[n]) state.weekDates[n] = byWeek[wk].date;
      }
    }
    state.weeks = [...weekSet].sort((a, b) => a - b);

    if (!state.weeks.length) {
      setStatus("No schedule data available yet.", false);
      return;
    }

    state.built = true;
    render();
    setStatus("", false);
  } catch (err) {
    setStatus(`Couldn't load the schedule (${err.message}). Retry.`, true);
  } finally {
    els.refresh.disabled = false;
  }
}

els.refresh.addEventListener("click", load);

// Toggle favorite from the star on each team row.
els.grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-fav-id]");
  if (btn) {
    const id = btn.getAttribute("data-fav-id");
    setFavorite(id === state.favoriteId ? null : id);
    return;
  }
  // Click a week header to sort rows by that week's kickoff; click again to clear.
  const wkHead = e.target.closest("th[data-wk]");
  if (wkHead) toggleSortWeek(Number(wkHead.getAttribute("data-wk")));
});
// Keyboard: Enter/Space on a focused week header toggles the sort.
els.grid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const wkHead = e.target.closest("th[data-wk]");
  if (!wkHead) return;
  e.preventDefault();
  toggleSortWeek(Number(wkHead.getAttribute("data-wk")));
});
function toggleSortWeek(wk) {
  if (!wk) return;
  state.sortWeek = state.sortWeek === wk ? null : wk;
  if (state.built) render();
}

initTheme();
renderLeagueToggle();
renderTabs();
initHeadroom();
load();
