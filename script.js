const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("weather-result");
const locationNameEl = document.getElementById("location-name");
const temperatureEl = document.getElementById("temperature");
const conditionsEl = document.getElementById("conditions");

const weatherCodeMap = {
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
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm"
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setStatus("Please enter a city.");
    return;
  }

  setStatus("Loading weather...");
  resultEl.hidden = true;

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results?.length) {
      setStatus("City not found. Please try another location.");
      return;
    }

    const { name, country, latitude, longitude } = geoData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`
    );
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    if (!current) {
      setStatus("Weather data unavailable. Please try again.");
      return;
    }

    locationNameEl.textContent = `${name}, ${country}`;
    temperatureEl.textContent = `Temperature: ${current.temperature_2m}°C`;
    conditionsEl.textContent = `Conditions: ${weatherCodeMap[current.weather_code] ?? "Unknown"}`;
    resultEl.hidden = false;
    setStatus("");
  } catch (error) {
    setStatus("Unable to fetch weather right now. Please try again later.");
  }
});

function setStatus(message) {
  statusEl.textContent = message;
}
