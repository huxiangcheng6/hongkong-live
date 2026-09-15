Hong Kong Live

Static dashboard of live Hong Kong open data. No build step, no framework.

Project structure

- index.html - the single page, three cards: weather, transport, air quality
- style.css - all styling (if separated later)
- app.js - all fetch and render logic (if separated later)

Rules

- Plain HTML, CSS and vanilla JavaScript only. No React, no Vue, no bundle.
- Do not add npm packages. The page must run by opening index.html.
- Two-space indentation. Use const and let, never var.

Data sources

- Weather: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en
- Do not change this URL without asking me first.

Error handling

- Wrap every fetch in try/catch and show a message inside the card.

When you are unsure

- Ask before changing a data source URL.
- Show me a plan before editing more than two files.
