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

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createStatus(root, message, state = "error") {
  const status = createElement("p", "weather-status", message);
  status.dataset.state = state;
  root.replaceChildren(status);
}

function createStatsItem(label, value) {
  const item = document.createElement("div");
  item.append(
    createElement("dt", "", label),
    createElement("dd", "", value)
  );
  return item;
}

function createWeather(data) {
  const temperatureData = data.temperature?.data || [];
  const observatoryTemperature = temperatureData.find(
    (item) => item.place === "Hong Kong Observatory"
  );
  const humidity = data.humidity?.data?.find(
    (item) => item.place === "Hong Kong Observatory"
  );
  const uv = data.uvindex?.data?.[0];
  const rainfall =
    data.rainfall?.data?.find((item) => item.place === "Yau Tsim Mong") ||
    data.rainfall?.data?.[0];
  const iconCode = data.icon?.[0];
  const condition = ICON_LABELS[iconCode] || "Current conditions";
  const warning = (data.warningMessage || []).filter(Boolean).join(" ");

  const weatherMain = createElement("div", "weather-main");
  const image = document.createElement("img");
  if (ICON_LABELS[iconCode]) {
    image.className = "weather-icon";
    image.src = `https://www.hko.gov.hk/images/HKOWxIconOutline/pic${iconCode}.png`;
    image.alt = condition;
    weatherMain.append(image);
  }

  const temperature = createElement("div");
  temperature.append(
    createElement("p", "weather-temp", observatoryTemperature?.value ?? "–"),
    createElement("p", "weather-condition", `${condition} · Hong Kong Observatory`)
  );
  const temperatureValue = temperature.querySelector(".weather-temp");
  const temperatureUnit = document.createElement("span");
  temperatureUnit.textContent = `°${observatoryTemperature?.unit || "C"}`;
  temperatureValue.append(temperatureUnit);
  weatherMain.append(temperature);

  const stats = document.createElement("dl");
  stats.className = "weather-stats";
  stats.append(
    createStatsItem("Humidity", humidity ? `${humidity.value}%` : "–"),
    createStatsItem("UV index", uv ? `${uv.value} (${uv.desc})` : "–"),
    createStatsItem(
      "Rain (1 hr)",
      rainfall ? `${rainfall.max ?? rainfall.value ?? 0} mm` : "–"
    )
  );

  const result = document.createElement("div");
  result.append(weatherMain, stats);
  if (warning) {
    result.append(createElement("p", "weather-warning", warning));
  }
  result.append(
    createElement(
      "p",
      "weather-updated",
      `Updated ${new Date(data.updateTime).toLocaleString("en-HK", {
        hour: "numeric",
        minute: "2-digit",
        day: "numeric",
        month: "short"
      })} · HKO open data`
    )
  );
  return result;
}

function createAirQuality(data) {
  const station = (Array.isArray(data) ? data : []).find(
    (item) => item.station === "Central/Western"
  );
  if (!station || station.aqhi === undefined || station.health_risk === undefined) {
    return createElement("p", "weather-status", "Air quality unavailable.");
  }

  const stats = document.createElement("dl");
  stats.className = "weather-stats";
  stats.append(
    createStatsItem("Station", "Central/Western"),
    createStatsItem("AQHI", station.aqhi),
    createStatsItem("Health risk", station.health_risk)
  );
  return stats;
}

function createTransport(data) {
  if (data?.status !== 1) {
    return createElement(
      "p",
      "weather-status",
      "Unable to load MTR train information."
    );
  }

  const trains = data?.data?.["ISL-HKU"]?.UP;
  if (!Array.isArray(trains)) {
    return createElement(
      "p",
      "weather-status",
      "Unable to load MTR train information."
    );
  }
  if (trains.length === 0) {
    return createElement("p", "weather-status", "No upcoming trains.");
  }

  const nextTrainData = trains[0];
  const minutes = Number(nextTrainData.ttnt);
  if (!Number.isFinite(minutes) || nextTrainData.dest === undefined) {
    return createElement(
      "p",
      "weather-status",
      "Unable to load MTR train information."
    );
  }

  const stats = document.createElement("dl");
  stats.className = "weather-stats";
  stats.append(
    createStatsItem("Next train", `${minutes} min`),
    createStatsItem("Destination", nextTrainData.dest)
  );
  return stats;
}

async function loadWeather() {
  const root = document.getElementById("weather");

  try {
    const response = await fetch(WEATHER_API);
    if (!response.ok) throw new Error("Weather request failed");

    const data = await response.json();
    if (!data.temperature?.data?.length) {
      root.replaceChildren(createElement("p", "weather-status", "–"));
      return;
    }
    root.replaceChildren(createWeather(data));
  } catch (error) {
    createStatus(
      root,
      "Could not load weather. Check your connection and try again."
    );
  }
}

async function loadAirQuality() {
  const root = document.getElementById("air-quality");

  try {
    const response = await fetch(AIR_QUALITY_API);
    if (!response.ok) throw new Error("Air quality request failed");

    const stations = await response.json();
    if (!Array.isArray(stations)) throw new Error("Air quality data is unavailable");
    root.replaceChildren(createAirQuality(stations));
  } catch (error) {
    createStatus(root, "Air quality unavailable.");
  }
}

async function loadTransport() {
  const root = document.getElementById("transport");

  try {
    const response = await fetch(TRANSPORT_API);
    if (!response.ok) throw new Error("Transport request failed");

    const result = await response.json();
    root.replaceChildren(createTransport(result));
  } catch (error) {
    createStatus(root, "Unable to load MTR train information.");
  }
}

loadWeather();
loadAirQuality();
loadTransport();
