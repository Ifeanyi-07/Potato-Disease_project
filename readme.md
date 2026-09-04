# 🥔 Potato Leaf Disease Classification

An end-to-end deep learning application that detects potato leaf diseases from images using a TensorFlow/Keras image classification model.

The project provides both a **React web application** and a **React Native mobile application**, with a **FastAPI REST API** handling requests and **TensorFlow Serving** responsible for model inference.

## 🚀 Live Demo

**Web Application:**  
https://frontend-production-e5215.up.railway.app

**Backend API:**  
https://potato-api-rw-production.up.railway.app

## 📌 Features

- Upload a potato leaf image for classification
- Detects:
  - Early Blight
  - Late Blight
  - Healthy Potato Leaf
- Displays the predicted disease and confidence score
- React web interface
- React Native mobile application
- REST API built with FastAPI
- TensorFlow Serving for production model inference
- Dockerized services
- Cloud deployment using Railway

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React Web App    │
                    │      Railway        │
                    └──────────┬──────────┘
                               │ HTTPS
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │      Railway        │
                    └──────────┬──────────┘
                               │
                               │ Private HTTP
                               ▼
                    ┌─────────────────────┐
                    │ TensorFlow Serving  │
                    │      Railway        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Potato Disease Model│
                    │   SavedModel v1     │
                    └─────────────────────┘


                    ┌─────────────────────┐
                    │ React Native Mobile │
                    │        App          │
                    └──────────┬──────────┘
                               │ HTTPS
                               ▼
                         FastAPI API
```

## 🛠️ Tech Stack

### Machine Learning
- TensorFlow
- Keras
- Image Classification

### Backend & Model Serving
- Python
- FastAPI
- TensorFlow Serving
- REST API
- NumPy
- Pillow

### Frontend
- React
- Material UI
- Axios

### Mobile
- React Native
- Android

### DevOps & Deployment
- Docker
- Railway
- Git
- GitHub

## 📂 Project Structure

```text
Deep_learning_project/
│
├── backend/
│   ├── api/
│   │   └── main_tf_server.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── model-serving/
│   ├── models/
│   │   └── 1/
│   │       ├── saved_model.pb
│   │       ├── fingerprint.pb
│   │       ├── assets/
│   │       └── variables/
│   ├── start.sh
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── mobile-app/
│   ├── android/
│   ├── app/
│   ├── assets/
│   ├── App.js
│   ├── package.json
│   └── ...
│
└── README.md
```

## 🔬 Model

The model classifies potato leaf images into three categories:

```text
Potato___Early_blight
Potato___Late_blight
Potato___healthy
```

Input images are processed as:

```text
Image
  ↓
RGB conversion
  ↓
Resize to 256 × 256
  ↓
TensorFlow Serving
  ↓
Model prediction
  ↓
Class + confidence
```

The trained model is exported as a **TensorFlow SavedModel** and served using TensorFlow Serving rather than loading the model directly inside the FastAPI application.

## 🔌 API

### Prediction Endpoint

```http
POST /predict
```

The endpoint accepts an image using `multipart/form-data`.

Example response:

```json
{
  "class": "Potato___Late_blight",
  "confidence": "98.42%"
}
```

### Health Check

```http
GET /
```

Response:

```json
{
  "message": "Potato Disease Detection API is running"
}
```

## 🐳 Running with Docker

### TensorFlow Serving

Build the model-serving image:

```bash
docker build -t potato-tf-serving ./model-serving
```

Run it:

```bash
docker run -p 8501:8501 potato-tf-serving
```

### FastAPI

Build the backend:

```bash
docker build -t potato-api ./backend
```

Run it:

```bash
docker run -p 8000:8000 \
  -e TF_SERVING_URL=http://host.docker.internal:8501/v1/models/potato_model:predict \
  potato-api
```

The API will be available at:

```text
http://localhost:8000
```

## 💻 Running the Web Application

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000/predict
```

Start the development server:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## 📱 Running the Mobile Application

Navigate to the mobile application:

```bash
cd mobile-app
```

Install dependencies:

```bash
npm install
```

Make sure an Android emulator or physical Android device is connected, then run:

```bash
npx react-native run-android
```

The mobile application communicates with the same FastAPI backend used by the web application.

## ☁️ Deployment

The production system is deployed on **Railway** using separate services:

```text
potato-web
     │
     ▼
potato-api
     │
     ▼
potato-tf-serving
```

### Deployment Flow

```text
Local Development
       ↓
Git
       ↓
GitHub
       ↓
Railway
       ↓
Docker Build / Application Build
       ↓
Production Deployment
```

Each service is independently deployed, allowing the API and model-serving infrastructure to be managed separately.

## 🔐 Environment Variables

The frontend uses:

```env
REACT_APP_API_URL=<FastAPI prediction endpoint>
```

The backend uses:

```env
TF_SERVING_URL=<TensorFlow Serving prediction endpoint>
FRONTEND_URL=<Frontend URL>
```

Environment files containing local or sensitive configuration should not be committed to GitHub.

## 🎯 Project Goals

This project was built to demonstrate an end-to-end machine learning deployment workflow, including:

- Deep learning model development
- Image classification
- Model export and serving
- REST API development
- Docker containerization
- Web application integration
- Mobile application integration
- Cloud deployment
- Frontend/backend communication
- Production model inference

## 👨‍💻 Author

**Obiajulu Ifeanyichukwu Abah**

Software Engineer | AI, Machine Learning & MLOps Engineer

GitHub: https://github.com/Ifeanyi-07

---
