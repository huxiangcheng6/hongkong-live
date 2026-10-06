Copilot obeyed the no-framework rule in [AGENTS.md](http://AGENTS.md).

It stopped and asked for permission before making any React changes, so it did not rewrite the dashboard.

- Broken 1: Replaced the CORS-blocked AQHI XML source with the browser-accessible AQHI JSON API. I understood that the source needed changing after checking the console, but I used Copilot for the exact edit. Copilot took about 1 minute.
- Next time, I would recognise this problem from a CORS error in the browser console when the data URL works directly but fetch() is blocked.
- - Broken 1: Replaced the CORS-blocked AQHI XML source with the browser-accessible AQHI JSON API. I understood that the source needed changing after checking the console, but I used Copilot for the exact edit. Copilot took about 1 minute.
- Next time, I would recognise this problem from a CORS error in the browser console when the data URL works directly but fetch() is blocked.
- Broken 2: Added a check for json.status before reading [json.data](http://json.data), converted ttnt to a number before adding 1, and handled an empty UP list. I knew the two main faults from the worksheet but used Copilot for the exact implementation. Copilot took about 1 minute.

| Fix | Knew exact change before asking? | Agent time | Estimated manual time |

|---|---|---|---|

| Replace the CORS-blocked AQHI source | No, not before checking the console | About 1 min | About 3–5 min |

| Check json.status before [json.data](http://json.data) | Yes | About 1 min | About 30 sec |

| Convert ttnt to a number before +1 | Yes | About 1 min | About 20 sec |

### S4 Task A

Wi-Fi off:

- Weather: clear error message shown.
- Transport: clear error message shown.
- Air Quality: clear error message shown.
- No undefined, NaN, blank card, or blank page.

Invalid weather station ("Atlantis"):

- Weather card still showed a normal temperature instead of an error message.
- The user cannot tell that the requested station was not found.



Invalid MTR station ("XXX"):

- Transport card stayed visible.

- It showed "Unable to load MTR train information."

- No undefined, NaN, null, blank card, or blank page.

## Task D - Branch, break, roll back

I created an experiment branch and asked the agent to add a live chart of temperature over the past 24 hours. The fourth card displayed "Temperature history unavailable" because the current weather feed does not provide 24-hour historical temperature data.

Branch list before deleting the failed experiment:
  experiment
* master

Branch list after deleting the experiment:
* master

After switching back to master, the original Weather, Transport and Air Quality cards worked as before.

## Session 5 - MCP Tools and Automation

### Task A - Agent without browser tools

I temporarily disabled VS Code's built-in browser chat tools with:

`"workbench.browser.enableChatTools": false`

Without direct browser access, the agent could not simply inspect the dashboard page. When asked about live values, it relied on other available information such as the public APIs instead of reading the rendered page itself.

### Task A2 - Vet Playwright MCP

Before connecting Playwright MCP, I checked the official npm package and its GitHub repository.

- Package: `@playwright/mcp`
- Repository: `microsoft/playwright-mcp`
- The npm package linked to the Microsoft GitHub repository.
- The package and repository appeared to be maintained by the Playwright/Microsoft team.

### Task B - Connect MCP servers

I configured two MCP servers in `.vscode/mcp.json`:

- Context7
- Playwright

Context7 was tested by asking for current documentation on setting a timeout for the browser `fetch` API.

Playwright exposed browser tools including tools for navigation, snapshots, screenshots, console messages, network requests and page interaction.

I also confirmed that MCP tools only appeared when the configuration used the correct key and structure.

### Task C - Reusable dashboard check

I created:

`.github/prompts/check-dashboard.prompt.md`

This created the `/check-dashboard` command.

On the first run, Playwright opened `http://localhost:5500` and correctly reported the live dashboard:

- Weather: 29°C, "Mainly fine"
- Transport: a valid next-train time to CHW
- Air Quality: Central/Western, AQHI 3, Low

It also saved a full-page screenshot.

I then deliberately changed the MTR request from:

`sta=HKU`

to:

`sta=XXX`

After a hard refresh, the Transport card displayed:

`Unable to load MTR train information.`

Running `/check-dashboard` again correctly detected the Transport error while Weather and Air Quality remained normal.

I then restored:

`sta=HKU`

and confirmed that the Transport card returned to a normal next-train value.

Finally, I restored the VS Code browser setting to:

`"workbench.browser.enableChatTools": true`

and confirmed that the built-in browser tools appeared again in the tool picker.

### Task D - Estimated agent cost

Estimated agent requests from Tasks B and C:

`4 × 5 sessions = 20 requests`

Using the worksheet assumptions:

- Input: `20 × 5,000 = 100,000 tokens`
- Output: `20 × 1,000 = 20,000 tokens`
- Standard estimated cost: `$0.10`
- Fast estimated cost: `$0.60`

### Session 5 final state

- Context7 MCP connected.
- Playwright MCP connected.
- `/check-dashboard` reusable prompt works.
- Built-in browser tools restored.
- MTR station restored to `HKU`.
- Weather, Transport and Air Quality cards working normally.
- WS5C ZIP prepared with `mcp.json` and `check-dashboard.prompt.md`.
- Dashboard screenshot submitted to iClass ONE with the Transport error marked.

## Session 6 - Security Audit

- Completed a security audit covering secrets, dependencies, untrusted API data, failure behaviour, MCP access, and attribution.
- Searched for `key`, `token`, `secret`, and `password`; no real API keys, access tokens, passwords, or other credentials were found.
- Confirmed the dashboard does not use an unverified third-party package.
- Replaced fetched-data `innerHTML` rendering in `app.js` with safe DOM APIs, `textContent`, `replaceChildren`, and safe attributes.
- Kept the existing formatter tests compatible and corrected AQHI station handling.
- Tested the responsive layout at 375 x 812: the three cards stack vertically, text remains readable, and there is no problematic horizontal overflow.
- Tested failure behaviour by blocking the three external API domains in Chrome DevTools Request conditions:
  - Weather: `Could not load weather. Check your connection and try again.`
  - Transport: `Unable to load MTR train information.`
  - Air Quality: `Air quality unavailable.`
- Restored the network and confirmed live data returned normally.
- Added the footer `Data from the Hong Kong Government and DATA.GOV.HK.`
- Final test result: 5 passed, 0 failed.
- Final code commit: `complete session 6 security audit fixes`.