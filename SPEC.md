# SPEC.md - Weather Card

## WHO is it for?
A student who wants one glance at today's weather in Hong Kong.

## WHAT should it do?
- Fetch live data from: https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en
- Display the current temperature in Celsius for station "Hong Kong Observatory".
- Display the last update time (updateTime) alongside the temperature.
- Display the current humidity percentage.

## HOW will you know it is right?
- The temperature shown matches the value on the Hong Kong Observatory website when I reload the page.
- The update time changes when a new reading is published.
- The humidity value matches the one shown on the Observatory site.

## WHAT should happen when it breaks?
- If data cannot be fetched, show a dash "-" and a short message inside the Weather card: "Unable to load weather data."
- If the network is offline, show a user-friendly message instead of a blank card.