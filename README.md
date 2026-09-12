# Helmet Schedule

A college football season viewed as a **helmet matrix**: every team in a conference is a row, every week is a column, and each cell shows the opponent's helmet — home/away/neutral, kickoff time, AP rank, and final result. A companion **live scoreboard** page shares the same look and data source.

No build step, no framework — just static HTML, CSS, and vanilla JavaScript. Data and helmet logos come from ESPN's public college-football API.

## Pages

| File | Purpose | Scripts / styles |
|------|---------|------------------|
| `index.html` | Full-season helmet matrix (teams × weeks) | `helmet.js`, `helmet.css` |
| `scoreboard.html` | Responsive, live-updating scoreboard | `app.js`, `styles.css` |

## Features

- **Helmet matrix** — opponent helmets per week, with `vs` / `@` / `N` (neutral) indicators, kickoff times, AP rank, and W/L result badges with final scores.
- **Conference tabs** — SEC, Big Ten, ACC, Big 12, Mountain West, American, Sun Belt, MAC, C-USA, and Independents. The current week is highlighted, and the table hugs its content so short conferences don't leave empty space.
- **Favorite team per conference** — star a team to pin it to the top of its conference; each conference remembers its own favorite (stored in `localStorage`).
- **Light / dark / auto theme** — one press flips the visible theme; helmet logos swap to their light or dark variant to match.
- **Mobile-friendly** — a collapsing header reclaims vertical space on scroll, a hamburger menu holds the actions, and a narrowed team column reveals more upcoming weeks.

## Data source

All schedule, score, and logo data is fetched at runtime from ESPN's public endpoints, e.g.:

- Team schedule: `site.api.espn.com/apis/site/v2/sports/football/college-football/teams/{id}/schedule?season={year}`
- Scoreboard: `site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups={groupId}`

The season is set by the `SEASON` constant in `helmet.js`. There is no API key and no server component — the pages call ESPN directly from the browser.

## Running locally

It's a static site, so any static file server works:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve
```

Then open `http://localhost:8000/`. (Opening `index.html` directly via `file://` also works, since all data is fetched from ESPN over HTTPS.)

## Deployment

Push to the default branch and serve the files from any static host (GitHub Pages, Netlify, etc.). No build or bundling required.

## Project layout

```
index.html        Helmet schedule matrix
scoreboard.html   Live scoreboard
helmet.js         Matrix logic: conferences, data fetch, render, favorites, theme
helmet.css        Matrix styles
app.js            Scoreboard logic
styles.css        Scoreboard styles
shared/assets/    Logo (PNG) and header icons (SVG)
```

## Notes

- Google Analytics (gtag.js) is included in the `<head>` of both pages.
- Not affiliated with the NCAA, any conference, or ESPN. Helmet logos and data are ESPN's.
