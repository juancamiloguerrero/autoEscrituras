FROM python:3.9-slim

WORKDIR /app

# Copia requirements primero para cachear
COPY formulario/backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copia la plantilla
COPY formulario/backend/templates/ /app/templates/

# Copia el código
COPY formulario/backend/ /app/

# Crea directorio para archivos generados
RUN mkdir -p /app/generated

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]