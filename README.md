# Project AEGIS — AI Forecast Bust Detection Platform
### *SIH 2026 Problem Statement 26079 | Ministry of Earth Sciences (MoES) / NCMRWF*
> **Core Motto:** *"Don't predict the weather. Predict when the prediction will fail."*

> **Prototype notice:** This repository is a front-end concept dashboard. Its nine district scenarios, trust scores, historical comparisons, alert counts, and recommendations are illustrative sample data. There is no live NWP feed, trained model, operational API, or validated CAP alert service. XML downloads use CAP `Test` status.

---

## 🌟 Overview

Project AEGIS is an AI-powered Risk Intelligence and Meta-Forecasting platform that sits on top of Numerical Weather Prediction (NWP) models (NCUM, GFS, WRF) developed by the **National Centre for Medium Range Weather Forecasting (NCMRWF)** and **India Meteorological Department (IMD)**.

Instead of predicting weather, AEGIS analyzes:
1. Historical forecast-vs-actual error distributions across 10 years (2015–2025).
2. Multi-day forecast drift (consecutive model cycle divergence).
3. Meso-scale atmospheric physics anomalies (CAPE, bulk wind shear, moisture convergence).

It outputs:
- **Calibrated Operational Trust Scores (0–100)** for Day 1 to Day 10 lead times.
- **Forecast Bust Probability Maps** highlighting regions prone to severe model failure.
- **Conformal Prediction Error Intervals** providing statistically guaranteed bounds on precipitation.
- **Explainable Meteorologist Reason Cards** powered by TreeSHAP.
- **Historical Synoptic Twins** matching current conditions with infamous past bust events.

---

## 🗺️ Layer-by-Layer Architecture

Project AEGIS implements a dual layer-by-layer structure:

### 1. Geographic map workspace
The map uses Leaflet 1.9.4 and locally stored Natural Earth geographic boundaries. All map assets are vendored, so the basemap needs no API key, tile server, or internet connection. Sample locations use longitude/latitude reference points rather than screen coordinates.

- All hazards shows all nine locations. Hazard tabs filter by primary or secondary hazard.
- Nearby locations form a cluster; click it to zoom in and reveal individual trust scores.
- High risk shows locations with bust probability above 70%. Empty results have a clear reset action.
- Zoom, drag, keyboard navigation, and the Fit India action use geographic coordinates.
- Layers: geographic basemap, rainfall labels (rainfall/cyclone scenarios), bust probability halos, drift rings, reference points, trust markers, and high-risk outlines. Halos/rings are visual indicators, not district boundaries or physical hazard extents.
- Changing the forecast day preserves layer settings and the map position. Layer reset restores the same defaults used at startup.
- On narrow screens, the panels are mutually exclusive drawers. The map resizes when the layout changes.

Sources and licenses: [map source notes](assets/MAP-SOURCES.md).

### 2. System Intelligence Layers
1. **Telemetry & Ingestion Layer:** GRIB2/NetCDF4 parser for NCUM, AWS ground stations, Doppler radars, and INSAT-3DR.
2. **Atmospheric Physics Feature Engine:** Computes CAPE, 850–200 hPa wind shear, orographic lift index, and moisture convergence.
3. **Forecast Drift Engine (FDI):** Quantifies run-to-run numerical bifurcation over $T_0, T_{-24h}, T_{-48h}, T_{-72h}$.
4. **District Vulnerability DNA Registry:** Micro-climate risk profiles for 780+ districts.
5. **Hybrid AI Decision Ensemble:** XGBoost + LSTM + Conformal Calibration (MAPIE).
6. **Neuro-Symbolic & SHAP Explainability Engine:** Translates feature attributions into natural-language meteorological reasons.
7. **Operational API & CAP Dispatch:** REST API and CAP v1.2 XML feeds for NDRF, SDMA, and IMD forecasters.

---

## 🚀 How to Run the Application

The web application is built with modern HTML5, Vanilla CSS (Light Theme Design System), and JavaScript with zero external runtime build dependencies.

### Local Development
1. Install dependencies (first time only):
   ```bash
   npm install
   ```
2. Start the local dev server:
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000/](http://localhost:3000/) in your browser.

*(Alternative: You can also run `pwsh -NoProfile -ExecutionPolicy Bypass -File .\server.ps1 -port 5000` or open `index.html` directly in a browser).*

### ☁️ Deploy to Vercel
This project is fully configured for zero-config Vercel deployment:
- **Via Vercel Dashboard:** Push this repository to GitHub/GitLab/Bitbucket and import it in Vercel. Vercel automatically detects the configuration from [vercel.json](file:///c:/Users/adity/Documents/ps2/vercel.json).
- **Via Vercel CLI:**
  ```bash
  npm i -g vercel
  vercel
  ```

2. **Interactive Controls:**
   - **Lead Time Slider (Bottom):** Scrub from **Day 1** to **Day 10** to observe how model uncertainty grows over time.
   - **Play/Pause Button (`Space` key):** Animates the 10-day forecast evolution.
   - **Number Keys (`1` - `9`, `0`):** Jump directly to Day 1 through Day 10.
   - **Layer Controller (Left):** Toggle visibility or adjust opacity sliders for any of the 7 layers.
   - **District Inspector (Right):** Click any district marker (e.g. *Ratnagiri*, *Wayanad*, *Shimla*, *Cuttack*) to view its SHAP reason card, drift sparkline, and historical analogue twin.
   - **Model Drift Lab (Header):** Open cross-model consensus divergence curves (NCUM vs GFS vs WRF).
   - **CAP / REST API Sandbox (Header):** Test live JSON payloads, cURL snippets, and CAP v1.2 XML alerts.

---

## 👥 Hackathon Team Presentation Highlights
- **Adherence to PS-26079:** Fully addresses MoES & NCMRWF requirements for medium-range forecast bust detection.
- **Novel Innovations:** Introduces Forecast Drift Index (FDI), Conformal Prediction envelopes, and Synoptic Historical Twins.
- **Light Theme UX:** Authoritative, high-clarity scientific daylight interface designed for operational command centers.
