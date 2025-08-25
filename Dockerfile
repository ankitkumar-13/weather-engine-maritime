FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Expose port
EXPOSE 8000

# Start command
CMD ["python", "backend/main.py"]
