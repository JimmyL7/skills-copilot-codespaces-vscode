# skills-copilot-codespaces-vscode

A small browser-based weather app.

## Run locally

Because this app uses browser `fetch`, serve it with a local static server:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> and search for a city to see current weather.

## Data source

The app uses the free Open-Meteo APIs:

- Geocoding API: city name to coordinates
- Forecast API: current weather conditions
