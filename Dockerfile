FROM python:3.9-slim

WORKDIR /app

# Copia requirements primero para cachear
COPY formulario/backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el proyecto
COPY . .

# Expone el puerto que usa FastAPI
EXPOSE 10000

# Comando para iniciar la aplicación
CMD ["uvicorn", "formulario.backend.main:app", "--host", "0.0.0.0", "--port", "10000"]