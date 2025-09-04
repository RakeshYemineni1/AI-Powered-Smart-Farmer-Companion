import os, io
import numpy as np
import pandas as pd
from joblib import load
from PIL import Image
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

MODELS_DIR = os.getenv("MODELS_DIR", "models")

# Crop + fertilizer (scikit-learn pipelines)
_crop_model = None
_fert_model = None
# Disease (tf)
_dis_model = None
_dis_labels = None

def _lazy_crop():
    global _crop_model
    if _crop_model is None:
        _crop_model = load(os.path.join(MODELS_DIR, "crop_rf.joblib"))
    return _crop_model

def _lazy_fert():
    global _fert_model
    if _fert_model is None:
        _fert_model = load(os.path.join(MODELS_DIR, "fert_rf.joblib"))
    return _fert_model

def _lazy_disease():
    global _dis_model, _dis_labels
    if _dis_model is None:
        _dis_model = tf.keras.models.load_model(os.path.join(MODELS_DIR, "disease_mobilenetv2.keras"))
        with open(os.path.join(MODELS_DIR, "disease_labels.txt")) as f:
            _dis_labels = [l.strip() for l in f if l.strip()]
    return _dis_model, _dis_labels

def predict_crop(features: dict) -> dict:
    model = _lazy_crop()
    df = pd.DataFrame([features])
    pred = model.predict(df)[0]
    proba = getattr(model.named_steps["clf"], "predict_proba", None)
    conf = None
    if proba is not None:
        idx = list(model.named_steps["clf"].classes_).index(pred)
        conf = float(model.predict_proba(df)[0][idx])
    return {"crop": str(pred), "confidence": conf}

def predict_fertilizer(features: dict) -> dict:
    model = _lazy_fert()
    # Corrected features to match backend training data column names
    corrected_features = {
        'Temparature': features['temperature'],
        'Humidity ': features['humidity'],
        'Moisture': features['moisture'],
        'Soil Type': features['soil_type'],
        'Crop Type': features['crop_type'],
        'Nitrogen': features['N'],
        'Phosphorous': features['P'],
        'Potassium': features['K'],
    }
    df = pd.DataFrame([corrected_features])
    pred = model.predict(df)[0]
    return {"fertilizer": str(pred)}

def predict_disease(image_bytes: bytes) -> dict:
    model, labels = _lazy_disease()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224,224))
    arr = np.array(img)[None, ...]
    arr = tf.keras.applications.mobilenet_v2.preprocess_input(arr)
    probs = model.predict(arr, verbose=0)[0]
    idx = int(np.argmax(probs))
    return {"disease": labels[idx], "confidence": float(probs[idx])}

class CropForm(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertilizerForm(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    N: float
    P: float
    K: float

# This is the FastAPI app
app = FastAPI()

@app.post("/predict/crop")
def predict_crop_api(features: CropForm):
    pred = predict_crop(features.dict())
    return {"success": True, "data": pred}

@app.post("/predict/fertilizer")
def predict_fertilizer_api(features: FertilizerForm):
    try:
        pred = predict_fertilizer(features.dict())
        return {"success": True, "data": pred}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/predict/disease")
async def predict_disease_api(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format")
    
    img_bytes = await file.read()
    pred = predict_disease(img_bytes)
    return {"success": True, "data": pred}
