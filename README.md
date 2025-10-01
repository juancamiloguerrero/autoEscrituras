
---

## 📑 README para **autoEscrituras**

```markdown
# 📝 autoEscrituras

Plataforma **full-stack** que automatiza la generación de **escrituras y documentos legales** en formato `.docx`, reduciendo tiempos y errores en procesos notariales.

---

## 🚀 Tecnologías
- [FastAPI](https://fastapi.tiangolo.com/) (Backend en Python)
- [python-docx](https://python-docx.readthedocs.io/en/latest/) para generar documentos Word
- [Next.js](https://nextjs.org/) (Frontend con React)
- [TailwindCSS](https://tailwindcss.com/) para estilos modernos

---

## ✨ Funcionalidades
- Formulario dinámico para captura de datos
- Generación automática de escrituras en formato Word
- Descarga directa del documento
- Plantillas personalizables

---

## ⚙️ Instalación
```bash
git clone https://github.com/tuusuario/autoEscrituras.git
cd autoEscrituras
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Frontend
cd ../formulario
npm install
npm run dev
