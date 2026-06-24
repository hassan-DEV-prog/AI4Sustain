# AI4Sustain 🌍

> \\\*\\\*As AI infrastructure scales globally — which countries run out of sustainable resources first?\\\*\\\*

AI4Sustain is a full-stack AI/ML web application that predicts and visualises the environmental and socio-economic impact of artificial intelligence infrastructure expansion across **261 countries worldwide**.

\---

## Screenshots

### Global Dashboard

!\[Global Map View](assets/screenshot1.png)

### Country Sustainability Dashboard

!\[Country Dashboard](assets/screenshot2.png)

### Risk Dimensions \& Socio-Economic Analysis

!\[Risk Analysis](assets/screenshot3.png)

\---

## What It Does

* Pulls **real-world data** from the World Bank API — energy consumption, CO2 emissions, renewable energy share, water stress, GDP, and population
* Computes a **Sustainability Score (0–100)** for each country using a synthetically engineered AI Expansion Index
* Uses **XGBoost** to predict the current sustainability score per country
* Uses an **LSTM neural network** to forecast how that score evolves **year by year from 2024 to 2040** as AI infrastructure scales
* Displays everything on an **interactive world map** — click any country to open a full dashboard

\---

## Features

* 🗺️ **Interactive World Map** — click any country to open its sustainability dashboard
* 📊 **15-Year Forecast** — LSTM-powered line chart from 2024 to 2040
* 🕸️ **Radar Chart** — five risk dimensions: Energy Risk, Water Risk, Carbon Risk, AI Pressure, Renewables
* 📈 **Socio-Economic Analysis** — AI jobs risk, energy cost index, inequality pressure
* 🌐 **261 Countries Tracked** — global average score, most sustainable, most at risk
* ⚡ **REST API Backend** — FastAPI serving all predictions through clean endpoints

\---

## Tech Stack

|Layer|Technology|
|-|-|
|Frontend|React, Vite, CSS|
|Backend|Python, FastAPI|
|ML Models|XGBoost, LSTM (Keras/TensorFlow)|
|Data Source|World Bank API|
|Data Processing|Pandas, NumPy, Scikit-learn|
|Visualisation|Recharts, React Simple Maps|

\---

## Project Structure

```
ai4sustain/
├── backend/
│   ├── main.py          # FastAPI server \\\& REST endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # Dashboard, MapView, TopBar, LandingStats
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── data/
│   ├── raw/             # World Bank API data
│   ├── processed/       # Feature engineered datasets \\\& plots
│   └── models/          # Trained XGBoost \\\& LSTM models
├── notebooks/
│   ├── 01\\\_eda.ipynb
│   ├── 02\\\_xgboost.ipynb
│   └── 03\\\_lstm.ipynb
└── assets/              # Screenshots
```

\---

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

\---

## Key Findings

* **26 countries** are currently in High/Critical risk category
* **Bahrain (21.8), Qatar (21.9), and Brunei (22.0)** are the most at-risk nations
* **Global average sustainability score: 54.3/100**
* The **United States scores 34.6/100** — High risk — with only 10.9% renewable energy share despite a 97/100 AI expansion index
* Most "sustainable" scores belong to low-AI-infrastructure nations, revealing the true cost of AI scaling

\---

## ML Model Details

### XGBoost (Current Score Prediction)

* Trained on World Bank indicators + engineered AI Expansion Index
* Predicts sustainability score for each country

### LSTM (Forecast 2024–2040)

* Sequential model forecasting sustainability trajectory per country
* Captures temporal degradation patterns as AI infrastructure scales

\---

## Author

**Mohd Hassan**
Pre-Final Year B.Tech CSE — Jamia Hamdard

[!\[GitHub](https://img.shields.io/badge/GitHub-hassan--DEV--prog-black?logo=github)](https://github.com/hassan-DEV-prog)
[!\[LinkedIn](https://img.shields.io/badge/LinkedIn-Mohd%20Hassan-blue?logo=linkedin)](https://www.linkedin.com/in/mohd-hassan-44949a2b3)

