from fastapi import FastAPI, UploadFile, File
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import requests
from fastapi.middleware.cors import CORSMiddleware
import os


app = FastAPI()

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TF_SERVING_URL = (
#     "http://localhost:8501/v1/models/potato_model:predict"
# )

TF_SERVING_URL = os.getenv(
    "TF_SERVING_URL",
    "http://localhost:8501/v1/models/potato_model:predict"
)

CLASS_NAMES= ["Potato___Early_blight", "Potato___Late_blight", "Potato___healthy"]

@app.get("/")
async def root():

    return {"message": "Potato Disease Detection API is running"}



def read_file_as_img(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")

    # Resize to the size expected by the model
    image = image.resize((256, 256))

    # Convert to NumPy float32
    image = np.array(image).astype(np.float32)

    # Add batch dimension
    image = np.expand_dims(image, axis=0)  #converts a 1DA to 2DA

    return image

@app.post("/predict")
async def prediction(file: UploadFile = File(...)):

    # Read uploaded image and preprocess the image
    image= read_file_as_img(await file.read())


    # Create TensorFlow Serving request
    data = {
        "instances": image.tolist()
    }

    # Send image to TensorFlow Serving
    response = requests.post(
        TF_SERVING_URL,
        json=data,
        timeout=30
    )

    response.raise_for_status()

    # Get response
    result = response.json()

    # Get predictions
    predictions = np.array(
        result["predictions"][0]
    )


    #Get predicted class
    predicted_class = CLASS_NAMES[np.argmax(predictions)]

    # Get confidence
    # confidence = float(np.max(predictions))
    confidence = float(np.max(predictions)) * 100

    return {
        "class": predicted_class,
        # "confidence": confidence
        "confidence": f"{confidence:.2f}%"
    }


if __name__ == "__main__":
    # uvicorn.run(app, host="localhost", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))