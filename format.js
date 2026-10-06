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

export function formatTemp(data) {
  if (!data.temperature?.data?.length) return "--";

  const observatoryTemp = findByPlace(data.temperature?.data, "Hong Kong Observatory");
  if (!observatoryTemp || observatoryTemp.place !== "Hong Kong Observatory") return "--";

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

  return `
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
}

export function formatAqhi(data, stationName = "Central/Western") {
  const stations = Array.isArray(data) ? data : [];
  const station = stations.find((item) => item.station === stationName);

  if (!station || station.aqhi === undefined || station.health_risk === undefined) {
    return `<p class="weather-status" data-state="error">Air quality unavailable.</p>`;
  }

  return `
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
}

export function nextTrain(data) {
  const json = data;
  if (json?.status !== 1) {
    return `<p class="weather-status" data-state="error">Unable to load MTR train information.</p>`;
  }

  const trains = json?.data?.["ISL-HKU"]?.UP;
  if (!Array.isArray(trains)) {
    return `<p class="weather-status" data-state="error">Unable to load MTR train information.</p>`;
  }
  if (trains.length === 0) {
    return `<p class="weather-status">No upcoming trains.</p>`;
  }

  const nextTrainData = trains[0];
  const minutes = Number(nextTrainData.ttnt);
  if (!Number.isFinite(minutes) || nextTrainData.dest === undefined) {
    return `<p class="weather-status" data-state="error">Unable to load MTR train information.</p>`;
  }

  return `
    <dl class="weather-stats">
      <div>
        <dt>Next train</dt>
        <dd>${escapeHtml(minutes)} min</dd>
      </div>
      <div>
        <dt>Destination</dt>
        <dd>${escapeHtml(nextTrainData.dest)}</dd>
      </div>
    </dl>
  `;
}
