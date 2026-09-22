import { formatTemp, formatAqhi, nextTrain } from "./format.js";

const WEATHER_API =
  "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
const AIR_QUALITY_API =
  "https://dashboard.data.gov.hk/api/aqhi-individual?format=json";
const TRANSPORT_API =
  "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=HKU";

async function loadWeather() {
  const root = document.getElementById("weather");

  try {
    const response = await fetch(WEATHER_API);
    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const data = await response.json();
    root.innerHTML = formatTemp(data);
  } catch (error) {
    root.innerHTML = `<p class="weather-status" data-state="error">Could not load weather. Check your connection and try again.</p>`;
  }
}

async function loadAirQuality() {
  const root = document.getElementById("air-quality");

  try {
    const response = await fetch(AIR_QUALITY_API);
    if (!response.ok) {
      throw new Error("Air quality request failed");
    }

    const stations = await response.json();
    if (!Array.isArray(stations)) {
      throw new Error("Air quality data is unavailable");
    }

    root.innerHTML = formatAqhi(stations);
  } catch (error) {
    root.innerHTML = `<p class="weather-status" data-state="error">Air quality unavailable.</p>`;
  }
}

async function loadTransport() {
  const root = document.getElementById("transport");

  try {
    const response = await fetch(TRANSPORT_API);
    if (!response.ok) {
      throw new Error("Transport request failed");
    }

    const result = await response.json();
    root.innerHTML = nextTrain(result);
  } catch (error) {
    root.innerHTML = `<p class="weather-status" data-state="error">Unable to load MTR train information.</p>`;
  }
}

loadWeather();
loadAirQuality();
loadTransport();
