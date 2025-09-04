from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ..inference.predict import predict_crop, predict_fertilizer, predict_disease

app = FastAPI(title="Agri ML API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
def root():
    return {"message": "AgriSmart AI API is running!"}

@app.post("/predict/crop")
def predict_crop_endpoint(body: CropFeatures):
    try:
        result = predict_crop(body.dict())
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/predict/fertilizer")
def predict_fertilizer_endpoint(body: FertFeatures):
    try:
        result = predict_fertilizer(body.dict())
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/predict/disease")
async def predict_disease_endpoint(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        result = predict_disease(img_bytes)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}