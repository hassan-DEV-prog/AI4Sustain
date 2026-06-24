from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import pickle
import os

app = FastAPI(title="AI4Sustain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── paths ──────────────────────────────────────────────
BASE       = os.path.join(os.path.dirname(__file__), "..", "data")
MODELS_DIR = os.path.join(BASE, "models")
DATA_DIR   = os.path.join(BASE, "processed")

# ── load models and data at startup ────────────────────
with open(os.path.join(MODELS_DIR, "xgb_model.pkl"), "rb") as f:
    xgb_model = pickle.load(f)

with open(os.path.join(MODELS_DIR, "feature_list.pkl"), "rb") as f:
    FEATURES = pickle.load(f)

df_predictions = pd.read_csv(os.path.join(DATA_DIR, "predictions.csv"))
df_forecast    = pd.read_csv(os.path.join(DATA_DIR, "forecast_2024_2040.csv"))
df_country     = pd.read_csv(os.path.join(DATA_DIR, "country_data.csv"))

print("All models and data loaded OK")

# ── helpers ────────────────────────────────────────────
def safe_float(val, default=0.0):
    try:
        v = float(val)
        return default if (v != v) else v  # nan check
    except Exception:
        return default

def get_country_row(code):
    row = df_country[df_country["country_code"] == code.upper()]
    return row.iloc[0] if not row.empty else None

def get_prediction_row(code):
    row = df_predictions[df_predictions["country_code"] == code.upper()]
    return row.iloc[0] if not row.empty else None

def build_overview(name, score, risk, ai_idx, renewable, energy):
    trend      = "accelerating" if ai_idx > 0.6 else "growing moderately"
    renew_lbl  = "strong" if renewable > 50 else "limited"
    outlook    = "concerning" if score < 45 else "cautiously optimistic"
    return (
        f"{name} currently holds a sustainability score of {score:.1f}/100, "
        f"placing it in the '{risk}' category. AI infrastructure is {trend} "
        f"in this region (AI expansion index: {ai_idx:.2f}). "
        f"Renewable energy adoption is {renew_lbl} at {renewable:.1f}% of total "
        f"energy mix, with per-capita consumption at {energy:.0f} kWh/year. "
        f"Under continued AI expansion, resource consumption — particularly "
        f"electricity and water — is projected to rise significantly through 2040. "
        f"The long-term sustainability outlook is {outlook}. Proactive green "
        f"data centre policies and renewable investment will be critical."
    )

# ── routes ─────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "AI4Sustain API running", "version": "1.0"}


@app.get("/countries")
def list_countries():
    cols = ["country_code", "country_name"]
    data = (df_predictions[cols]
            .drop_duplicates()
            .sort_values("country_name")
            .to_dict(orient="records"))
    return data


@app.get("/global")
def global_summary():
    avg_score   = round(float(df_predictions["predicted_score"].mean()), 1)
    risk_counts = df_predictions["risk_level"].value_counts().to_dict()
    top5 = (df_predictions
            .sort_values("predicted_score", ascending=False)
            [["country_name","country_code","predicted_score","risk_level"]]
            .head(5).to_dict(orient="records"))
    bottom5 = (df_predictions
               .sort_values("predicted_score")
               [["country_name","country_code","predicted_score","risk_level"]]
               .head(5).to_dict(orient="records"))
    return {
        "global_avg_score" : avg_score,
        "risk_distribution": risk_counts,
        "most_sustainable" : top5,
        "least_sustainable": bottom5,
        "total_countries"  : int(len(df_predictions)),
    }


@app.get("/country/{code}")
def country_summary(code: str):
    code     = code.upper()
    pred_row = get_prediction_row(code)
    if pred_row is None:
        return {"error": f"Country code '{code}' not found"}

    data_row = get_country_row(code)

    gdp          = safe_float(data_row.get("gdp_per_capita")         if data_row is not None else None, 0)
    energy       = safe_float(data_row.get("energy_kwh_per_capita")  if data_row is not None else None, 0)
    renewable    = safe_float(data_row.get("renewable_pct")          if data_row is not None else None, 20)
    water_stress = safe_float(data_row.get("water_stress_pct")       if data_row is not None else None, 30)
    population   = safe_float(data_row.get("population")             if data_row is not None else None, 0)
    ai_idx       = safe_float(pred_row.get("ai_expansion_index"),    0)
    score        = safe_float(pred_row.get("predicted_score"),       50)
    risk         = str(pred_row.get("risk_level", "Unknown"))
    name         = str(pred_row.get("country_name", code))

    # forecast curve from pre-computed CSV
    fc = (df_forecast[df_forecast["country_code"] == code]
          .sort_values("year"))
    forecast_curve = fc[["year","predicted_score"]].to_dict(orient="records")

    # radar dimensions (0-100)
    co2_proxy = max(0.5, energy / 3000) if energy > 0 else 2.0
    radar = {
        "energy_risk"    : round(min(100, energy / 150),    1),
        "water_risk"     : round(min(100, water_stress),    1),
        "carbon_risk"    : round(min(100, co2_proxy * 5),   1),
        "ai_pressure"    : round(ai_idx * 100,              1),
        "renewable_score": round(renewable,                  1),
    }

    # socio-economic proxies
    socio = {
        "gdp_per_capita"      : round(gdp, 2),
        "ai_jobs_risk_pct"    : round(min(40, ai_idx * 35), 1),
        "energy_cost_index"   : round(min(100, energy / 100), 1),
        "inequality_pressure" : round(min(100, ai_idx*60 + (1-renewable/100)*20), 1),
    }

    overview = build_overview(name, score, risk, ai_idx, renewable, energy)

    return {
        "country_code"        : code,
        "country_name"        : name,
        "sustainability_score": round(score, 1),
        "risk_level"          : risk,
        "ai_expansion_index"  : round(ai_idx, 3),
        "renewable_pct"       : round(renewable, 1),
        "energy_kwh_per_capita": round(energy, 1),
        "water_stress_pct"    : round(water_stress, 1),
        "population"          : int(population),
        "gdp_per_capita"      : round(gdp, 2),
        "forecast_curve"      : forecast_curve,
        "radar"               : radar,
        "socio"               : socio,
        "overview"            : overview,
    }


@app.get("/forecast/{code}")
def country_forecast(code: str):
    code = code.upper()
    fc   = df_forecast[df_forecast["country_code"] == code].sort_values("year")
    if fc.empty:
        return {"error": f"No forecast for '{code}'"}
    return {
        "country_code": code,
        "forecast": fc[["year","predicted_score"]].to_dict(orient="records")
    }