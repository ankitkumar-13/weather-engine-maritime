FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements and install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy entire project structure
COPY . .

# Set Python path
ENV PYTHONPATH=/app/backend

# Expose port
EXPOSE 8000

# Start command
CMD ["python", "backend/main.py"]
