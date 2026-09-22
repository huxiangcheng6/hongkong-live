import test from "node:test";
import assert from "node:assert/strict";
import { formatTemp, formatAqhi, nextTrain } from "./format.js";

test("finds the Hong Kong Observatory temperature regardless of station order", () => {
  const data = {
    temperature: {
      data: [
        { place: "Sha Tin", value: 25, unit: "C" },
        { place: "Hong Kong Observatory", value: 28, unit: "C" }
      ]
    },
    humidity: { data: [] },
    uvindex: { data: [] },
    rainfall: { data: [] },
    icon: [],
    warningMessage: [],
    updateTime: null
  };

  assert.match(formatTemp(data), /28<span>°C<\/span>/);
});

test("shows a dash when the Hong Kong Observatory station is missing", () => {
  const data = {
    temperature: { data: [{ place: "Sha Tin", value: 25, unit: "C" }] },
    humidity: { data: [] },
    uvindex: { data: [] },
    rainfall: { data: [] },
    icon: [],
    warningMessage: [],
    updateTime: null
  };

  assert.strictEqual(formatTemp(data), "--");
});

test("converts an MTR ttnt string to a number", () => {
  const data = {
    status: 1,
    data: {
      "ISL-HKU": {
        UP: [{ ttnt: "3", dest: "CHW" }]
      }
    }
  };

  assert.match(nextTrain(data), /3 min/);
  assert.doesNotMatch(nextTrain(data), /31 min/);
});

test("shows an error when the MTR response status is zero", () => {
  const data = {
    status: 0,
    data: {}
  };

  assert.match(nextTrain(data), /Unable to load MTR train information\./);
});

test("formats the exact Central AQHI station when requested", () => {
  const data = [
    { station: "Central/Western", aqhi: 4, health_risk: "Moderate" },
    { station: "Central", aqhi: 3, health_risk: "Low" }
  ];

  const result = formatAqhi(data, "Central");

  assert.match(result, /<dd>Central<\/dd>/);
  assert.match(result, /<dd>3<\/dd>/);
  assert.doesNotMatch(result, /Central\/Western/);
});
