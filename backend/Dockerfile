FROM python:3.13.2-slim
WORKDIR /hospitalApp/backend

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Run backend
WORKDIR /hospitalApp/backend/app/
CMD ["python", "main.py"]