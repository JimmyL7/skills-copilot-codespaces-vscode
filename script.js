const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  95: "Thunderstorm"
};

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("weather-result");
const locationNameEl = document.getElementById("location-name");
const temperatureEl = document.getElementById("temperature");
const windSpeedEl = document.getElementById("wind-speed");
const conditionEl = document.getElementById("condition");

function setStatus(message) {
  statusEl.textContent = message;
}

function setResultVisibility(isVisible) {
  resultEl.hidden = !isVisible;
}

async function geocodeCity(city) {
  const geocodeUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geocodeUrl.searchParams.set("name", city);
  geocodeUrl.searchParams.set("count", "1");

  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error("Could not geocode city");
  }

  const data = await response.json();
  return data.results?.[0] ?? null;
}

async function getWeather(latitude, longitude) {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", latitude);
  weatherUrl.searchParams.set("longitude", longitude);
  weatherUrl.searchParams.set("current", "temperature_2m,wind_speed_10m,weather_code");

  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error("Could not fetch weather");
  }

  const data = await response.json();
  return data.current;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Please enter a city name.");
    setResultVisibility(false);
    return;
  }

  setStatus("Loading weather...");
  setResultVisibility(false);

  try {
    const place = await geocodeCity(city);
    if (!place) {
      setStatus("No results found for that city.");
      return;
    }

    const weather = await getWeather(place.latitude, place.longitude);
    locationNameEl.textContent = `${place.name}${place.country ? `, ${place.country}` : ""}`;
    temperatureEl.textContent = weather.temperature_2m;
    windSpeedEl.textContent = weather.wind_speed_10m;
    conditionEl.textContent = weatherCodes[weather.weather_code] ?? `Code ${weather.weather_code}`;

    setStatus("Weather loaded.");
    setResultVisibility(true);
  } catch (error) {
    console.error(error);
    setStatus("Unable to load weather right now. Please try again.");
    setResultVisibility(false);
  }
});
