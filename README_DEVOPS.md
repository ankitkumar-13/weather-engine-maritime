# Instructions for Running and Deploying the Weather Engine Locally

This document provides instructions on how to run and deploy the Weather Engine project locally, including Docker setup for both the backend and frontend services.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Git to clone the repository.

## Running the Backend

1. **Navigate to the Backend Directory:**
   ```bash
   cd weather-engine-maritime/backend
   ```

2. **Build the Docker Image:**
   ```bash
   docker build -t weather-engine-backend .
   ```

3. **Run the Docker Container:**
   ```bash
   docker run -d -p 8000:8000 --env-file .env weather-engine-backend
   ```

   Ensure that you have the necessary environment variables set in a `.env` file in the backend directory.

## Running the Frontend

1. **Navigate to the Frontend Directory:**
   ```bash
   cd weather-engine-maritime/frontend
   ```

2. **Build the Docker Image:**
   ```bash
   docker build -t weather-engine-frontend .
   ```

3. **Run the Docker Container:**
   ```bash
   docker run -d -p 3000:3000 weather-engine-frontend
   ```

## Using Docker Compose (Optional)

You can also use Docker Compose to run both services together. Create a `docker-compose.yml` file in the root directory with the following content:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
```

To start both services, run:

```bash
docker-compose up --build
```

## Accessing the Application

- The backend API will be available at `http://localhost:8000`.
- The frontend application will be available at `http://localhost:3000`.

## Running Tests

To run the backend tests, you can execute the following command inside the backend directory:

```bash
pytest
```

Make sure your Docker container is running to allow the tests to access the API.

## Conclusion

You should now have the Weather Engine running locally. For any issues, please refer to the individual service README files for more detailed instructions.