# Usa una imagen oficial ligera de Python
FROM python:3.9-slim

# Establece la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia el contenido del backend (incluye main.py y templates/)
COPY backend/ /app/

# Instala dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto donde se ejecutará FastAPI
EXPOSE 8000

# Inicia la aplicación con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]