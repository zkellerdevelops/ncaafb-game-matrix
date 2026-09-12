/* Shared league / conference / roster data for both the helmet matrix and the
   scoreboard. Loaded before helmet.js and app.js, exposing a global `LEAGUES`.

   Each league carries the ESPN sport slug and logo path it needs; each
   "conference" (a college conference or an NFL division) has a roster of teams
   with ESPN team ids, an abbreviation, name, and primary color. College
   conferences also carry the ESPN `group` id used by the scoreboard endpoint.
   Conference keys are globally unique across leagues, so favorites (keyed by
   conference) never collide between College and NFL. */
const LEAGUES = {
  college: {
    label: "College",
    sport: "college-football",
    logoPath: "ncaa",
    conferences: {
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
    },
  },

  nfl: {
    label: "NFL",
    sport: "nfl",
    logoPath: "nfl",
    conferences: {
      "afc-east": {
        label: "AFC East",
        teams: [
          { id: "2", abbr: "BUF", name: "Bills", color: "00338d" },
          { id: "15", abbr: "MIA", name: "Dolphins", color: "008e97" },
          { id: "17", abbr: "NE", name: "Patriots", color: "002244" },
          { id: "20", abbr: "NYJ", name: "Jets", color: "125740" },
        ],
      },
      "afc-north": {
        label: "AFC North",
        teams: [
          { id: "33", abbr: "BAL", name: "Ravens", color: "241773" },
          { id: "4", abbr: "CIN", name: "Bengals", color: "fb4f14" },
          { id: "5", abbr: "CLE", name: "Browns", color: "311d00" },
          { id: "23", abbr: "PIT", name: "Steelers", color: "101820" },
        ],
      },
      "afc-south": {
        label: "AFC South",
        teams: [
          { id: "34", abbr: "HOU", name: "Texans", color: "03202f" },
          { id: "11", abbr: "IND", name: "Colts", color: "002c5f" },
          { id: "30", abbr: "JAX", name: "Jaguars", color: "006778" },
          { id: "10", abbr: "TEN", name: "Titans", color: "0c2340" },
        ],
      },
      "afc-west": {
        label: "AFC West",
        teams: [
          { id: "7", abbr: "DEN", name: "Broncos", color: "fb4f14" },
          { id: "12", abbr: "KC", name: "Chiefs", color: "e31837" },
          { id: "13", abbr: "LV", name: "Raiders", color: "000000" },
          { id: "24", abbr: "LAC", name: "Chargers", color: "0080c6" },
        ],
      },
      "nfc-east": {
        label: "NFC East",
        teams: [
          { id: "6", abbr: "DAL", name: "Cowboys", color: "041e42" },
          { id: "19", abbr: "NYG", name: "Giants", color: "0b2265" },
          { id: "21", abbr: "PHI", name: "Eagles", color: "004c54" },
          { id: "28", abbr: "WSH", name: "Commanders", color: "5a1414" },
        ],
      },
      "nfc-north": {
        label: "NFC North",
        teams: [
          { id: "3", abbr: "CHI", name: "Bears", color: "0b162a" },
          { id: "8", abbr: "DET", name: "Lions", color: "0076b6" },
          { id: "9", abbr: "GB", name: "Packers", color: "203731" },
          { id: "16", abbr: "MIN", name: "Vikings", color: "4f2683" },
        ],
      },
      "nfc-south": {
        label: "NFC South",
        teams: [
          { id: "1", abbr: "ATL", name: "Falcons", color: "a71930" },
          { id: "29", abbr: "CAR", name: "Panthers", color: "0085ca" },
          { id: "18", abbr: "NO", name: "Saints", color: "d3bc8d" },
          { id: "27", abbr: "TB", name: "Buccaneers", color: "d50a0a" },
        ],
      },
      "nfc-west": {
        label: "NFC West",
        teams: [
          { id: "22", abbr: "ARI", name: "Cardinals", color: "97233f" },
          { id: "14", abbr: "LAR", name: "Rams", color: "003594" },
          { id: "25", abbr: "SF", name: "49ers", color: "aa0000" },
          { id: "26", abbr: "SEA", name: "Seahawks", color: "002244" },
        ],
      },
    },
  },
};

/* ---------- League / conference selection helpers (shared) ---------- */
const LEAGUE_KEY = "cfb-league"; // which league is active
const CONF_BY_LEAGUE_KEY = "cfb-conf-by-league"; // last-viewed conference per league
const LEGACY_CONF_KEY = "cfb-conference"; // single college conference from earlier versions

function firstConfKey(leagueKey) {
  return Object.keys(LEAGUES[leagueKey].conferences)[0];
}

function loadConfByLeague() {
  let map = {};
  try {
    const parsed = JSON.parse(localStorage.getItem(CONF_BY_LEAGUE_KEY));
    if (parsed && typeof parsed === "object") map = parsed;
  } catch {
    map = {};
  }
  // Migrate the old single college conference into the map, once.
  const legacy = localStorage.getItem(LEGACY_CONF_KEY);
  if (legacy && !map.college && LEAGUES.college.conferences[legacy]) {
    map.college = legacy;
    localStorage.setItem(CONF_BY_LEAGUE_KEY, JSON.stringify(map));
  }
  return map;
}

// Resolve the starting league + conference from storage, validating both.
function initialSelection() {
  let leagueKey = localStorage.getItem(LEAGUE_KEY) || "college";
  if (!LEAGUES[leagueKey]) leagueKey = "college";
  const map = loadConfByLeague();
  let confKey = map[leagueKey];
  if (!confKey || !LEAGUES[leagueKey].conferences[confKey]) confKey = firstConfKey(leagueKey);
  return { leagueKey, confKey };
}

// Remember the conference last viewed within a league (shared across pages).
function rememberConf(leagueKey, confKey) {
  const map = loadConfByLeague();
  map[leagueKey] = confKey;
  localStorage.setItem(CONF_BY_LEAGUE_KEY, JSON.stringify(map));
  if (leagueKey === "college") localStorage.setItem(LEGACY_CONF_KEY, confKey); // keep in sync
}

// The conference to show when a league is chosen (its last-viewed, else first).
function confForLeague(leagueKey) {
  const map = loadConfByLeague();
  const k = map[leagueKey];
  return k && LEAGUES[leagueKey].conferences[k] ? k : firstConfKey(leagueKey);
}
