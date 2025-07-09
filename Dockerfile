FROM python:3.9-slim

WORKDIR /app

# 1. Copia solo requirements primero para cachear
COPY formulario/backend/requirements.txt .

# 2. Instala dependencias
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copia los templates (asegura que existan)
COPY formulario/backend/templates/ /app/templates/

# 4. Verifica que la plantilla existe (fail fast)
RUN [ -f /app/templates/formatoPlantilla.docx ] || { echo "ERROR: Plantilla no encontrada"; exit 1; }

# 5. Copia solo el backend, no todo el proyecto
COPY formulario/backend/ /app/

# 6. Crea directorio para archivos generados
RUN mkdir -p /app/generated && chmod a+rwx /app/generated

# 7. Puerto expuesto
EXPOSE 10000

# 8. Comando de inicio (ajustado a la nueva estructura)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]