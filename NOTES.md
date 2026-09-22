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

