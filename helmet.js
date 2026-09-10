/* CFB full-season helmet matrix — rows = conference teams, columns = weeks, cells = opponent helmets. */

const SEASON = 2026;

// Conference rosters (ESPN team ids + primary colors), alphabetical by school.
const CONFERENCES = {
  sec: {
    label: "SEC",
    group: 8,
    teams: [
      { id: "333", abbr: "ALA", name: "Alabama", color: "9e1b32" },
      { id: "8", abbr: "ARK", name: "Arkansas", color: "9d2235" },
      { id: "2", abbr: "AUB", name: "Auburn", color: "0c2340" },
      { id: "57", abbr: "FLA", name: "Florida", color: "0021a5" },
      { id: "61", abbr: "UGA", name: "Georgia", color: "ba0c2f" },
      { id: "96", abbr: "UK", name: "Kentucky", color: "0033a0" },
      { id: "99", abbr: "LSU", name: "LSU", color: "461d7c" },
      { id: "344", abbr: "MSST", name: "Miss. State", color: "660000" },
      { id: "142", abbr: "MIZ", name: "Missouri", color: "f1b82d" },
      { id: "201", abbr: "OU", name: "Oklahoma", color: "841617" },
      { id: "145", abbr: "MISS", name: "Ole Miss", color: "13294b" },
      { id: "2579", abbr: "SC", name: "South Carolina", color: "73000a" },
      { id: "2633", abbr: "TENN", name: "Tennessee", color: "ff8200" },
      { id: "251", abbr: "TEX", name: "Texas", color: "bf5700" },
      { id: "245", abbr: "TA&M", name: "Texas A&M", color: "500000" },
      { id: "238", abbr: "VAN", name: "Vanderbilt", color: "866d4b" },
    ],
  },
  big10: {
    label: "Big Ten",
    group: 5,
    teams: [
      { id: "356", abbr: "ILL", name: "Illinois", color: "e84a27" },
      { id: "84", abbr: "IND", name: "Indiana", color: "990000" },
      { id: "2294", abbr: "IOWA", name: "Iowa", color: "ffcd00" },
      { id: "120", abbr: "MD", name: "Maryland", color: "e03a3e" },
      { id: "130", abbr: "MICH", name: "Michigan", color: "00274c" },
      { id: "127", abbr: "MSU", name: "Michigan State", color: "18453b" },
      { id: "135", abbr: "MINN", name: "Minnesota", color: "7a0019" },
      { id: "158", abbr: "NEB", name: "Nebraska", color: "e41c38" },
      { id: "77", abbr: "NW", name: "Northwestern", color: "4e2a84" },
      { id: "194", abbr: "OSU", name: "Ohio State", color: "bb0000" },
      { id: "2483", abbr: "ORE", name: "Oregon", color: "154733" },
      { id: "213", abbr: "PSU", name: "Penn State", color: "041e42" },
      { id: "2509", abbr: "PUR", name: "Purdue", color: "b1810b" },
      { id: "164", abbr: "RUT", name: "Rutgers", color: "cc0033" },
      { id: "26", abbr: "UCLA", name: "UCLA", color: "2d68c4" },
      { id: "30", abbr: "USC", name: "USC", color: "990000" },
      { id: "264", abbr: "WASH", name: "Washington", color: "4b2e83" },
      { id: "275", abbr: "WIS", name: "Wisconsin", color: "c5050c" },
    ],
  },
  acc: {
    label: "ACC",
    group: 1,
    teams: [
      { id: "103", abbr: "BC", name: "Boston College", color: "98002e" },
      { id: "25", abbr: "CAL", name: "California", color: "003262" },
      { id: "228", abbr: "CLEM", name: "Clemson", color: "f56600" },
      { id: "150", abbr: "DUKE", name: "Duke", color: "003087" },
      { id: "52", abbr: "FSU", name: "Florida State", color: "782f40" },
      { id: "59", abbr: "GT", name: "Georgia Tech", color: "003057" },
      { id: "97", abbr: "LOU", name: "Louisville", color: "ad0000" },
      { id: "2390", abbr: "MIA", name: "Miami", color: "f47321" },
      { id: "153", abbr: "UNC", name: "North Carolina", color: "4b9cd3" },
      { id: "152", abbr: "NCST", name: "NC State", color: "cc0000" },
      { id: "221", abbr: "PITT", name: "Pittsburgh", color: "003594" },
      { id: "2567", abbr: "SMU", name: "SMU", color: "cc0035" },
      { id: "24", abbr: "STAN", name: "Stanford", color: "8c1515" },
      { id: "183", abbr: "SYR", name: "Syracuse", color: "f76900" },
      { id: "258", abbr: "UVA", name: "Virginia", color: "232d4b" },
      { id: "259", abbr: "VT", name: "Virginia Tech", color: "630031" },
      { id: "154", abbr: "WAKE", name: "Wake Forest", color: "8c6b2b" },
    ],
  },
  big12: {
    label: "Big 12",
    group: 4,
    teams: [
      { id: "12", abbr: "ARIZ", name: "Arizona", color: "0c234b" },
      { id: "9", abbr: "ASU", name: "Arizona State", color: "8c1d40" },
      { id: "239", abbr: "BAY", name: "Baylor", color: "154734" },
      { id: "252", abbr: "BYU", name: "BYU", color: "002e5d" },
      { id: "2132", abbr: "CIN", name: "Cincinnati", color: "e00122" },
      { id: "38", abbr: "COLO", name: "Colorado", color: "cfb87c" },
      { id: "248", abbr: "HOU", name: "Houston", color: "c8102e" },
      { id: "66", abbr: "ISU", name: "Iowa State", color: "c8102e" },
      { id: "2305", abbr: "KU", name: "Kansas", color: "0051ba" },
      { id: "2306", abbr: "KSU", name: "Kansas State", color: "512888" },
      { id: "197", abbr: "OKST", name: "Oklahoma State", color: "ff7300" },
      { id: "2628", abbr: "TCU", name: "TCU", color: "4d1979" },
      { id: "2641", abbr: "TTU", name: "Texas Tech", color: "cc0000" },
      { id: "2116", abbr: "UCF", name: "UCF", color: "ba9b37" },
      { id: "254", abbr: "UTAH", name: "Utah", color: "cc0000" },
      { id: "277", abbr: "WVU", name: "West Virginia", color: "002855" },
    ],
  },
  mwc: {
    label: "Mountain West",
    group: 17,
    teams: [
      { id: "2005", abbr: "AF", name: "Air Force", color: "003594" },
      { id: "62", abbr: "HAW", name: "Hawai'i", color: "005737" },
      { id: "2440", abbr: "NEV", name: "Nevada", color: "041e42" },
      { id: "167", abbr: "UNM", name: "New Mexico", color: "ba0c2f" },
      { id: "2449", abbr: "NDSU", name: "North Dakota State", color: "01402a" },
      { id: "2459", abbr: "NIU", name: "Northern Illinois", color: "c8102e" },
      { id: "23", abbr: "SJSU", name: "San José State", color: "0038a8" },
      { id: "2439", abbr: "UNLV", name: "UNLV", color: "cf0a2c" },
      { id: "2638", abbr: "UTEP", name: "UTEP", color: "ff8200" },
      { id: "2751", abbr: "WYO", name: "Wyoming", color: "492f24" },
    ],
  },
  aac: {
    label: "American",
    group: 151,
    teams: [
      { id: "349", abbr: "ARMY", name: "Army", color: "000000" },
      { id: "2429", abbr: "CLT", name: "Charlotte", color: "005035" },
      { id: "151", abbr: "ECU", name: "East Carolina", color: "582c83" },
      { id: "2226", abbr: "FAU", name: "Florida Atlantic", color: "003366" },
      { id: "235", abbr: "MEM", name: "Memphis", color: "004991" },
      { id: "2426", abbr: "NAVY", name: "Navy", color: "00225b" },
      { id: "249", abbr: "UNT", name: "North Texas", color: "068f33" },
      { id: "242", abbr: "RICE", name: "Rice", color: "00205b" },
      { id: "58", abbr: "USF", name: "South Florida", color: "006747" },
      { id: "218", abbr: "TEM", name: "Temple", color: "a41e35" },
      { id: "2655", abbr: "TULN", name: "Tulane", color: "006747" },
      { id: "202", abbr: "TLSA", name: "Tulsa", color: "003595" },
      { id: "5", abbr: "UAB", name: "UAB", color: "1a5632" },
      { id: "2636", abbr: "UTSA", name: "UTSA", color: "0c2340" },
    ],
  },
  sunbelt: {
    label: "Sun Belt",
    group: 37,
    teams: [
      { id: "2026", abbr: "APP", name: "App State", color: "000000" },
      { id: "2032", abbr: "ARST", name: "Arkansas State", color: "cc092f" },
      { id: "324", abbr: "CCU", name: "Coastal Carolina", color: "006f71" },
      { id: "290", abbr: "GASO", name: "Georgia Southern", color: "041e42" },
      { id: "2247", abbr: "GAST", name: "Georgia State", color: "0039a6" },
      { id: "256", abbr: "JMU", name: "James Madison", color: "450084" },
      { id: "309", abbr: "UL", name: "Louisiana", color: "ce181e" },
      { id: "2348", abbr: "LT", name: "Louisiana Tech", color: "003087" },
      { id: "276", abbr: "MRSH", name: "Marshall", color: "00b140" },
      { id: "295", abbr: "ODU", name: "Old Dominion", color: "003768" },
      { id: "6", abbr: "USA", name: "South Alabama", color: "00205b" },
      { id: "2572", abbr: "USM", name: "Southern Miss", color: "ffc72c" },
      { id: "2653", abbr: "TROY", name: "Troy", color: "862633" },
      { id: "2433", abbr: "ULM", name: "UL Monroe", color: "840029" },
    ],
  },
  mac: {
    label: "MAC",
    group: 15,
    teams: [
      { id: "2006", abbr: "AKR", name: "Akron", color: "041e42" },
      { id: "2050", abbr: "BALL", name: "Ball State", color: "ba0c2f" },
      { id: "189", abbr: "BGSU", name: "Bowling Green", color: "fd5000" },
      { id: "2084", abbr: "BUF", name: "Buffalo", color: "005bbb" },
      { id: "2117", abbr: "CMU", name: "Central Michigan", color: "4c0027" },
      { id: "2199", abbr: "EMU", name: "Eastern Michigan", color: "006938" },
      { id: "2309", abbr: "KENT", name: "Kent State", color: "002664" },
      { id: "113", abbr: "MASS", name: "Massachusetts", color: "881c1c" },
      { id: "193", abbr: "M-OH", name: "Miami (OH)", color: "c41230" },
      { id: "195", abbr: "OHIO", name: "Ohio", color: "154734" },
      { id: "16", abbr: "SAC", name: "Sacramento State", color: "00573c" },
      { id: "2649", abbr: "TOL", name: "Toledo", color: "0b2240" },
      { id: "2711", abbr: "WMU", name: "Western Michigan", color: "532e1f" },
    ],
  },
  cusa: {
    label: "C-USA",
    group: 12,
    teams: [
      { id: "48", abbr: "DEL", name: "Delaware", color: "00539f" },
      { id: "2229", abbr: "FIU", name: "Florida International", color: "091f3f" },
      { id: "55", abbr: "JXST", name: "Jacksonville State", color: "cc0000" },
      { id: "338", abbr: "KENN", name: "Kennesaw State", color: "fdbb30" },
      { id: "2335", abbr: "LIB", name: "Liberty", color: "0a254e" },
      { id: "2393", abbr: "MTSU", name: "Middle Tennessee", color: "036eb7" },
      { id: "2623", abbr: "MOST", name: "Missouri State", color: "5e0009" },
      { id: "166", abbr: "NMSU", name: "New Mexico State", color: "7e141b" },
      { id: "2534", abbr: "SHSU", name: "Sam Houston", color: "f56423" },
      { id: "98", abbr: "WKU", name: "Western Kentucky", color: "e13a3e" },
    ],
  },
  independents: {
    label: "Independents",
    group: 18,
    teams: [
      { id: "87", abbr: "ND", name: "Notre Dame", color: "062340" },
      { id: "41", abbr: "CONN", name: "UConn", color: "0c2340" },
    ],
  },
};

const CONF_KEY = "cfb-conference";
function currentConf() {
  return CONFERENCES[state.confKey] || CONFERENCES.sec;
}
function confTeams() {
  return currentConf().teams;
}

const els = {
  grid: document.getElementById("grid"),
  gridWrap: document.getElementById("grid-wrap"),
  topChrome: document.getElementById("top-chrome"),
  tabs: document.getElementById("conf-tabs"),
  status: document.getElementById("status"),
  refresh: document.getElementById("refresh-btn"),
  theme: document.getElementById("theme-btn"),
  menuBtn: document.getElementById("menu-btn"),
  headerActions: document.getElementById("header-actions"),
};

/* ---------- Headroom: hide the header/tabs on scroll-down, reveal on scroll-up ---------- */
function initHeadroom() {
  const measure = () =>
    document.documentElement.style.setProperty("--chrome-h", `${els.topChrome.offsetHeight}px`);
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
        setMenu(false); // close the mobile menu when the header hides
      } else if (y < lastY - THRESHOLD) {
        document.body.classList.remove("chrome-hidden"); // scrolling up
      }
      lastY = y;
    },
    { passive: true }
  );
}

/* ---------- Mobile hamburger menu (header links/buttons only) ---------- */
function setMenu(open) {
  els.headerActions.classList.toggle("open", open);
  els.menuBtn.setAttribute("aria-expanded", String(open));
}
els.menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setMenu(!els.headerActions.classList.contains("open"));
});
// Close after picking an action, or when tapping outside.
els.headerActions.addEventListener("click", (e) => {
  if (e.target.closest("a, button")) setMenu(false);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".header-controls")) setMenu(false);
});

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
// Favorite first (only if it's in the current conference), rest alphabetical.
function orderedTeams() {
  const teams = confTeams();
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
  confKey: localStorage.getItem(CONF_KEY) || "sec",
  favoriteId: getFavorite(localStorage.getItem(CONF_KEY) || "sec"),
};

/* ---------- Conference tabs ---------- */
function renderTabs() {
  els.tabs.innerHTML = Object.entries(CONFERENCES)
    .map(
      ([key, conf]) =>
        `<button class="tab ${key === state.confKey ? "active" : ""}" type="button"
                 data-conf="${key}" aria-pressed="${key === state.confKey}">${conf.label}</button>`
    )
    .join("");
}
function switchConference(key) {
  if (!CONFERENCES[key] || key === state.confKey) return;
  state.confKey = key;
  state.favoriteId = getFavorite(key); // each conference keeps its own favorite
  localStorage.setItem(CONF_KEY, key);
  renderTabs();
  load();
}
els.tabs.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-conf]");
  if (btn) switchConference(btn.getAttribute("data-conf"));
});

function logoUrl(teamId, dark) {
  return `https://a.espncdn.com/i/teamlogos/ncaa/500${dark ? "-dark" : ""}/${teamId}.png`;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchTeamSchedule(team) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${team.id}/schedule?season=${SEASON}`;
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

function weekHeaderLabel(wk) {
  const iso = state.weekDates[wk];
  let dateStr = "";
  if (iso) {
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) {
      dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  }
  return `Wk ${wk}${dateStr ? `<span class="wk-date">${dateStr}</span>` : ""}`;
}

function cellHtml(game, dark) {
  if (!game) return `<div class="bye">BYE</div>`;
  const opp = game.opp || {};
  const dark2 = logoUrl(opp.id, !dark);
  const src = logoUrl(opp.id, dark);
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
          .map(
            (wk) =>
              `<th class="${wk === state.currentWeek ? "current-col" : ""}">${weekHeaderLabel(wk)}</th>`
          )
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
              <img src="${logoUrl(team.id, dark)}" alt=""
                   onerror="this.onerror=null;this.src='${logoUrl(team.id, !dark)}';" />
              <span class="t-abbr">${esc(team.abbr)}</span>
              ${record ? `<span class="t-record">${record}</span>` : ""}
            </div>
          </div>
        </th>
        ${cells}
      </tr>`;
  }).join("");

  els.grid.innerHTML = head + `<tbody>${body}</tbody>`;
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
    // Current week (for highlighting) — best-effort, non-fatal.
    fetchJson(
      `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=${conf.group}`
    )
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
  if (!btn) return;
  const id = btn.getAttribute("data-fav-id");
  setFavorite(id === state.favoriteId ? null : id);
});

initTheme();
renderTabs();
initHeadroom();
load();
