# Agri ML Starter — Crop, Disease & Fertilizer
End‑to‑end, beginner‑friendly project with three models:
1) **Crop recommendation** (tabular → RandomForest)
2) **Fertilizer recommendation** (tabular → RandomForest)
3) **Plant disease classification** (images → MobileNetV2 transfer learning)

## Quickstart
```bash
# 1) Create and activate a virtual environment (Windows example)
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux:
# python3 -m venv .venv && source .venv/bin/activate

# 2) Install deps
pip install -r requirements.txt

# 3) (Optional) Run a smoke test with synthetic data
python src/training/train_crop.py --synthetic
python src/training/train_fertilizer.py --synthetic

# 4) Train with real data (see Data section below for paths)
# Crop recommendation CSV expected at: data/raw/crop_recommendation/crop_recommendation.csv
python src/training/train_crop.py

# Fertilizer recommendation CSV expected at: data/raw/fertilizer_recommendation/fertilizer.csv
python src/training/train_fertilizer.py

# Plant disease dataset (PlantVillage‑style) under data/raw/plant_disease/
# format: data/raw/plant_disease/{class_name}/*.jpg
python src/training/train_disease.py

# 5) Launch API
uvicorn src.api.main:app --reload
```

Then open http://127.0.0.1:8000/docs to try endpoints.

## Data
Put datasets in:
- `data/raw/crop_recommendation/crop_recommendation.csv` with columns like:
  `N,P,K,temperature,humidity,ph,rainfall,label`
- `data/raw/fertilizer_recommendation/fertilizer.csv` with columns like:
  `temperature,humidity,moisture,soil_type,crop_type,N,P,K,fertilizer`
- `data/raw/plant_disease/{class_name}/*.jpg` (PlantVillage‑style folders).

You can start with the **synthetic** mode first to validate everything runs even without real data.

## Project layout
```
src/
  api/
    main.py             # FastAPI server with 3 prediction endpoints
  features/
    preprocess.py       # Encoders, scalers, image transforms
  inference/
    predict.py          # Loads models and runs predictions
  pipelines/
    crop_pipeline.py    # Tabular ML pipeline (crop)
    fert_pipeline.py    # Tabular ML pipeline (fertilizer)
    disease_pipeline.py # Transfer learning pipeline (images)
  training/
    train_crop.py       # Train + save crop model
    train_fertilizer.py # Train + save fertilizer model
    train_disease.py    # Train + save disease model
models/                  # Saved artifacts (.joblib, .keras) end up here
```

## Tips
- Start with `--synthetic` flags to build confidence.
- Use the API docs (`/docs`) to test inputs quickly.
- For images, ensure classes have at least ~100 images each for decent results.
- Prefer GPU for training the disease model, but CPU works for small subsets.