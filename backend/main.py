from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow import keras
from keras.utils import img_to_array
import numpy as np
from PIL import Image
import io

# Load Pneumonia model
model = keras.models.load_model("model/pneumonia_model.keras")  # put your .keras file inside 'model' folder

# Define class names
# Make sure the order matches your model's training labels
class_names = ["Normal", "Pneumonia"]

# FastAPI app
app = FastAPI()

# Allow CORS from React frontend (optional if you have frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Pneumonia Detection API Running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image bytes
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("L").resize((224, 224))  # grayscale and resize
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Shape: (1, 224, 224, 1)
    img_array = img_array / 255.0  # Normalize if needed

    # Predict
    prediction = model.predict(img_array)[0][0]

    predicted_class = "Pneumonia" if prediction > 0.5 else "Normal"
    confidence = prediction if prediction > 0.5 else 1 - prediction

    return {
        "predicted_class": predicted_class,
        "confidence": round(float(confidence) * 100, 2)
    }
