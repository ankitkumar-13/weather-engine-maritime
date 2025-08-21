# Instructions for Running the Backend Service

## Overview
This project is a maritime weather intelligence application that provides real-time weather alerts, forecasts, and speed optimization for vessels. The backend is built using FastAPI and serves multiple endpoints to fetch weather data, optimize routes, and provide alerts.

## Environment Variables
Before running the backend service, ensure that the following environment variables are set:

```
OWM_KEY=your_openweather_key (if not set, system uses deterministic mock)
DATABASE_URL=sqlite:///./data/data.db  # optional
FUEL_PRICE_PER_TON=500
USE_MOCK=1  # optional flag to force mock mode
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/weather-engine-maritime.git
   cd weather-engine-maritime/backend
   ```

2. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

3. **Initialize the database:**
   Run the following command to create the SQLite database and seed it with sample data:
   ```
   python ../data/init_db.py
   ```

4. **Run the FastAPI application:**
   Start the backend service using Uvicorn:
   ```
   uvicorn src.main:app --reload --port 8000
   ```

## API Endpoints
The backend provides the following endpoints:

- **GET /route_forecast?route_id=1**
  - Fetches the weather forecast for the specified route.

- **POST /optimize**
  - Optimizes the speed for the given route and vessel.

- **GET /alerts?route_id=1**
  - Retrieves alerts based on the weather conditions for the specified route.

## Testing
To run the tests for the backend service, execute:
```
pytest
```

## Docker Setup
To build and run the backend service using Docker, follow these steps:

1. **Build the Docker image:**
   ```
   docker build -t weather-engine-backend .
   ```

2. **Run the Docker container:**
   ```
   docker run -p 8000:8000 weather-engine-backend
   ```

## Conclusion
This README provides the necessary instructions to set up and run the backend service for the maritime weather intelligence application. For further details on the optimizer and deployment, refer to the respective documentation files.