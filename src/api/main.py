from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, Field
from ..inference.predict import predict_crop, predict_fertilizer, predict_disease

app = FastAPI(title="Agri ML API", version="1.0.0")

class CropFeatures(BaseModel):
    N: float = Field(..., description="Nitrogen")
    P: float = Field(..., description="Phosphorus")
    K: float = Field(..., description="Potassium")
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertFeatures(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    N: float
    P: float
    K: float

@app.post("/predict/crop")
def predict_crop_endpoint(body: CropFeatures):
    return predict_crop(body.dict())

@app.post("/predict/fertilizer")
def predict_fertilizer_endpoint(body: FertFeatures):
    return predict_fertilizer(body.dict())

@app.post("/predict/disease")
async def predict_disease_endpoint(file: UploadFile = File(...)):
    img_bytes = await file.read()
    return predict_disease(img_bytes)