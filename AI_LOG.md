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

## Session 4 (2026-09-22)

- Used GitHub Copilot Agent to help with testing and code review of the Hong Kong Live dashboard.
- Separated formatting logic from data fetching so the logic could be tested independently.
- Wrote and ran Node.js tests for the formatting functions.
- Initially confirmed that all five existing tests passed.
- Added a regression test using both "Central/Western" and "Central" to expose a station-name partial-match bug that the original tests had missed.
- Fixed the AQHI station lookup so that it uses an exact station-name match instead of substring matching.
- Re-ran the test suite and confirmed that all six tests passed.
- Reviewed the agent-written changes and checked the diff before accepting them.
- Created a Git save point before starting a risky experiment.
- Created an `experiment` branch and asked the agent to add a fourth card showing a live chart of temperature over the past 24 hours.
- Found that the current weather feed did not provide the required 24-hour historical temperature data, so the experiment could not produce a genuine history chart.
- Returned to the `master` branch, deleted the failed `experiment` branch, and confirmed that the original Weather, Transport and Air Quality cards still worked.

## Session 5 (2026-09-29)

- Continued the same `hongkong-live` project in Visual Studio Code with GitHub Copilot.
- Temporarily disabled VS Code's built-in browser chat tools so that MCP browser tools could be tested separately.
- Checked the official `@playwright/mcp` package and repository before connecting it.
- Added Context7 to `.vscode/mcp.json`.
- Used Context7 to look up current documentation for adding a timeout to the browser `fetch` API and confirmed that the agent actually used the Context7 MCP tools.
- Added Playwright MCP with `npx -y @playwright/mcp@0.0.79`.
- Inspected the Playwright tool list and distinguished read-only browser tools from tools that can change browser or page state.
- Deliberately changed the MCP configuration key so the Context7 and Playwright tools disappeared, then restored the correct configuration and confirmed both MCP servers were running again.
- Created `.github/prompts/check-dashboard.prompt.md` as a reusable `/check-dashboard` prompt.
- Used `/check-dashboard` to open `http://localhost:5500`, inspect the Weather, Transport and Air Quality cards, check whether their values looked plausible, and take a full-page screenshot.
- Deliberately changed the MTR station from `HKU` to `XXX` and confirmed that the Transport card showed `Unable to load MTR train information.`
- Ran `/check-dashboard` again and confirmed that Playwright correctly detected the broken Transport card while the Weather and Air Quality cards remained normal.
- Restored the MTR station to `HKU` and confirmed all three dashboard cards worked normally again.
- Re-enabled VS Code's built-in browser chat tools after the MCP experiment.
- Submitted the required MCP configuration and saved prompt as the WS5C ZIP file.
- Submitted a dashboard screenshot showing the Transport error and marked the issue that the agent caught.
- Estimated the five-session agent cost using the worksheet assumptions as Standard: `$0.10` and Fast: `$0.60`.