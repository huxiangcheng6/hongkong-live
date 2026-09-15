const WEATHER_API =
  "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
const AIR_QUALITY_API =
  "https://dashboard.data.gov.hk/api/aqhi-individual?format=json";
const TRANSPORT_API =
  "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=HKU";

const ICON_LABELS = {
  50: "Sunny",
  51: "Sunny periods",
  52: "Sunny intervals",
  53: "Sunny periods with showers",
  54: "Sunny intervals with showers",
  60: "Cloudy",
  61: "Overcast",
  62: "Light rain",
  63: "Rain",
  64: "Heavy rain",
  65: "Thunderstorms",
  70: "Fine",
  76: "Mainly cloudy",
  77: "Mainly fine",
  80: "Windy",
  90: "Hot",
  91: "Warm",
  92: "Cool",
  93: "Cold"
};

function findByPlace(list, place) {
  return (list || []).find((item) => item.place === place) || list?.[0];
}

function formatTime(iso) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleString("en-HK", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short"
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function loadWeather() {
  const root = document.getElementById("weather");

  try {
    const response = await fetch(WEATHER_API);
    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const data = await response.json();
    const observatoryTemp = findByPlace(data.temperature?.data, "Hong Kong Observatory");
    const humidity = findByPlace(data.humidity?.data, "Hong Kong Observatory");
    const uv = data.uvindex?.data?.[0];
    const rainfall = findByPlace(data.rainfall?.data, "Yau Tsim Mong")
      || findByPlace(data.rainfall?.data);
    const iconCode = data.icon?.[0];
    const condition = ICON_LABELS[iconCode] || "Current conditions";
    const warning = (data.warningMessage || []).filter(Boolean).join(" ");

    const iconHtml = iconCode
      ? `<img class="weather-icon" src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic${iconCode}.png" alt="${escapeHtml(condition)}">`
      : "";

    root.innerHTML = `
      <div class="weather-main">
        ${iconHtml}
        <div>
          <p class="weather-temp">${escapeHtml(observatoryTemp?.value ?? "–")}<span>°${escapeHtml(observatoryTemp?.unit || "C")}</span></p>
          <p class="weather-condition">${escapeHtml(condition)} · Hong Kong Observatory</p>
        </div>
      </div>
      <dl class="weather-stats">
        <div>
          <dt>Humidity</dt>
          <dd>${humidity ? `${escapeHtml(humidity.value)}%` : "–"}</dd>
        </div>
        <div>
          <dt>UV index</dt>
          <dd>${uv ? `${escapeHtml(uv.value)} (${escapeHtml(uv.desc)})` : "–"}</dd>
        </div>
        <div>
          <dt>Rain (1 hr)</dt>
          <dd>${rainfall ? `${escapeHtml(rainfall.max ?? rainfall.value ?? 0)} mm` : "–"}</dd>
        </div>
      </dl>
      ${warning ? `<p class="weather-warning">${escapeHtml(warning)}</p>` : ""}
      <p class="weather-updated">Updated ${escapeHtml(formatTime(data.updateTime))} · HKO open data</p>
    `;
  } catch (error) {
    root.innerHTML = `<p class="weather-status" data-state="error">Could not load weather. Check your connection and try again.</p>`;
  }
}

async function loadAirQuality() {
  const root = document.getElementById("air-quality");
  const stationName = "Central/Western";

  try {
    const response = await fetch(AIR_QUALITY_API);
    if (!response.ok) {
      throw new Error("Air quality request failed");
    }

    const stations = await response.json();
    if (!Array.isArray(stations)) {
      throw new Error("Air quality data is unavailable");
    }

    const station = stations.find((item) => item.station === stationName);
    if (!station || station.aqhi === undefined || station.health_risk === undefined) {
      throw new Error("Air quality station data is unavailable");
    }

    root.innerHTML = `
      <dl class="weather-stats">
        <div>
          <dt>Station</dt>
          <dd>${escapeHtml(stationName)}</dd>
        </div>
        <div>
          <dt>AQHI</dt>
          <dd>${escapeHtml(station.aqhi)}</dd>
        </div>
        <div>
          <dt>Health risk</dt>
          <dd>${escapeHtml(station.health_risk)}</dd>
        </div>
      </dl>
    `;
  } catch (error) {
    root.innerHTML = `<p class="weather-status" data-state="error">Unable to load air quality data for Central/Western.</p>`;
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
    const json = result;
    if (json["status"] !== 1) {
      throw new Error("Transport data is unavailable");
    }

    const trains = json["data"]?.["ISL-HKU"]?.UP;
    if (!Array.isArray(trains)) {
      throw new Error("Upcoming train data is unavailable");
    }
    if (trains.length === 0) {
      root.innerHTML = `<p class="weather-status">No upcoming trains.</p>`;
      return;
    }

    const nextTrain = trains[0];
    const minutes = Number(nextTrain.ttnt);
    if (!Number.isFinite(minutes) || nextTrain.dest === undefined) {
      throw new Error("Next train data is unavailable");
    }

    root.innerHTML = `
      <dl class="weather-stats">
        <div>
          <dt>Next train</dt>
          <dd>${escapeHtml(minutes)} min</dd>
        </div>
        <div>
          <dt>Destination</dt>
          <dd>${escapeHtml(nextTrain.dest)}</dd>
        </div>
      </dl>
    `;
  } catch (error) {
    root.innerHTML = `<p class="weather-status" data-state="error">Unable to load MTR train information.</p>`;
  }
}

loadWeather();
loadAirQuality();
loadTransport();
