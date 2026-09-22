# AI Log

Project notes and changes made with AI assistance.

## 2026-09-01

- Created `hello.html` with heading "Hello, Hong Kong Live".
- Created `index.html` dashboard page: title "Hong Kong Live", author Hu XiangCheng / EEE, description of weather/transport/air quality, and three cards.
- Updated `index.html` styling: light gray background; cards with rounded borders and shadow.

# AI Usage Log

## Session 1 (2026-09-01)

- Installed and signed in to Cursor using GitHub authorization, selected Hobby plan.
- Created project folder `hongkong-live` and opened it in Cursor.
- Ran first prompt: generated `hello.html` and successfully displayed "Hello, Hong Kong Live" in browser.
- Created project cover page `index.html` with title "Hong Kong Live", author name and program (EEE), description of weather/transport/air quality, and three empty cards.
- Modified `index.html` styling as required: light gray background, cards with rounded borders and shadow.
- Encountered issue: Cursor's built-in Live Server at `127.0.0.1:8765` failed to start. Workaround: preview by double-clicking `index.html` directly in Chrome browser.
- Completed GitHub Education student verification. Application approved. Awaiting Copilot benefits (estimated 72-hour activation).
- Submitted `index.html` to Moodle.

## Session 2 (2026-09-08)

- Read the Hong Kong Observatory weather data via browser.
- Confirmed live temperature: 32°C, update time: 2026-09-08T17:02:00+08:00.
- Created SPEC.md draft while Cursor was temporarily unavailable.

## Session 2 Follow-up (2026-09-12)

- Used GitHub Copilot to create AGENTS.md with project rules.
- Extracted all inline JavaScript from index.html into a separate app.js file.
- Tested offline scenario: turned off Wi-Fi, reloaded page, and weather card correctly showed "Could not load weather" message instead of going blank. Turned Wi-Fi back on and data returned.

## Session 3

- Used HKU GenAI free chat to review implementation plans for the Air Quality and Transport cards before asking Copilot to edit files.

- Used GitHub Copilot to implement the Air Quality card with exact matching for Central/Western.

- Used GitHub Copilot to implement the Transport card and checked the result against the live MTR API.

- Tested whether Copilot would follow [AGENTS.md](http://AGENTS.md) when asked to rewrite the project in React. Copilot stopped and asked before overriding the project rules, so no React changes were made.

- Used HKU GenAI to understand the CORS error in broken1.html, then used Copilot to replace the blocked XML source with the working AQHI JSON API.

- Used Copilot to repair broken2.html by checking json.status, converting ttnt to a number, and handling an empty train list.

- Tested broken2.html with STA = "XXX" and confirmed that it displayed an error message instead of crashing, then restored STA to "HKU".

