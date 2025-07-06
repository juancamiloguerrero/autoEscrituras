from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from docx import Document
from docx.shared import Pt, Cm
import os
import uuid

app = FastAPI()

# CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class Persona(BaseModel):
    nombreCompleto: str
    identificacion: str
    expedicion: str
    domicilioDireccion: str
    departamentoResidencia: str
    ciudadResidencia: str
    telefono: str
    estadoCivil: str
    sexo: str
    correo: EmailStr
    ocupacion: str

class FormularioData(BaseModel):
    fechaOtorgamiento: str
    matriculaInmobiliaria: str
    cedulaCatastral: Optional[str]
    mayorExtension: bool
    departamento: str
    ciudad: str
    tipoPredio: str
    nombreLote: str
    direccion: str
    acto: str
    valorActo: float
    descripcionInmueble: Optional[str]
    oficinaInstrumentos: Optional[str]
    tradicion: Optional[str]
    complementosTradicion: Optional[str]
    viviendaFamiliar: str
    descripcionViviendaFamiliar: Optional[str]
    compradores: List[Persona]
    vendedores: List[Persona]

def formatear_parrafos(doc: Document):
    for p in doc.paragraphs:
        for run in p.runs:
            run.font.name = 'Arial'
            run.font.size = Pt(12)
            run.bold = True
        p.style.font.name = 'Arial'

def ajustar_margenes_superiores(doc: Document):
    section = doc.sections[0]
    section.top_margin = Cm(3.1)
    section.bottom_margin = Cm(0.8)
    section.left_margin = Cm(3.2)
    section.right_margin = Cm(2.3)
    section.gutter = Cm(0)

def reemplazar_campos(doc: Document, datos: FormularioData):
    valor_acto = f"${datos.valorActo:,.0f}".replace(",", ".")
    ciudad = datos.ciudad
    departamento = datos.departamento
    mayor_ext = "( MAYOR EXTENSION )" if datos.mayorExtension else ""
    direccion_completa = f"{datos.nombreLote}, {datos.direccion}"

    # Determinar encabezados dinámicos
    def encabezado_personas(lista, rol):
        plural = len(lista) > 1
        sexos = {p.sexo.lower() for p in lista}

        if sexos == {"femenino"}:
            return f"{rol}A" if not plural else f"{rol}AS", "femenino"
        elif sexos == {"masculino"}:
            return f"{rol}" if not plural else f"{rol}ES", "masculino"
        elif "femenino" in sexos and "masculino" in sexos:
            return f"{rol}ES", "mixto"
        else:
            return rol, "desconocido"

    def texto_personas(lista):
        bloques = []
        for p in lista:
            bloque = f"{p.nombreCompleto}\nC.C. {p.identificacion} expedida en {p.expedicion}"
            bloques.append(bloque)
        return "\n\n".join(bloques)

    reemplazos = {
        "fechaOtorgamiento": datos.fechaOtorgamiento,
        "matriculaInmobiliaria": datos.matriculaInmobiliaria,
        "cedulaCatastral": f"{datos.cedulaCatastral} {mayor_ext}",
        "ciudad": ciudad,
        "departamento": departamento,
        "tipoPredio": datos.tipoPredio,
        "nombreLote": datos.nombreLote,
        "direccion": datos.direccion,
        "valorActo": valor_acto,
        "codigoActo": datos.acto,
        "descripcionInmueble": datos.descripcionInmueble or "",
        "tradicion": datos.tradicion or "",
        "complementosTradicion": datos.complementosTradicion or "",
        "viviendaFamiliar": datos.viviendaFamiliar or "",
        "descripcionViviendaFamiliar": datos.descripcionViviendaFamiliar or "",
    }

    doc_text = "\n".join(p.text for p in doc.paragraphs)

    # Aplicar reemplazos simples
    for clave, valor in reemplazos.items():
        doc_text = doc_text.replace(f'{{“{clave}”}}', str(valor))

    # Insertar listas dinámicas
    encabezado_v, label_v = encabezado_personas(datos.vendedores, "VENDEDOR")
    encabezado_c, label_c = encabezado_personas(datos.compradores, "COMPRADOR")

    doc_text = doc_text.replace("\nIDENTIFICACIÓN VENDEDORA/VENDEDOR o VENDEDORAS/VENDEDORES", f"IDENTIFICACIÓN {encabezado_v}:\n\n")
    doc_text = doc_text.replace("\nIDENTIFICACION COMPRADORAS/COMPRADORES o COMPRADORA/COMPRADOR", f"IDENTIFICACIÓN {encabezado_c}:\n\n")
    doc_text = doc_text.replace("{vendedores}", texto_personas(datos.vendedores))
    doc_text = doc_text.replace("{compradores}", texto_personas(datos.compradores))
    doc_text = doc_text.replace("{vendedorEtiqueta}", encabezado_v)
    doc_text = doc_text.replace("{compradorEtiqueta}", encabezado_c)

    # Elimina todos los párrafos del documento original
    while len(doc.paragraphs) > 0:
        p = doc.paragraphs[0]
        p._element.getparent().remove(p._element)

    # Agregar cada línea del documento como párrafo independiente
    for bloque in doc_text.split("\n"):
        p = doc.add_paragraph(bloque.strip())
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.0

        for run in p.runs:
            run.font.name = 'Arial'
            run.font.size = Pt(12)
            run.bold = True


    formatear_parrafos(doc)
    ajustar_margenes_superiores(doc)

# Endpoint principal
@app.post("/generar-doc/")
async def generar_documento(datos: FormularioData):
    try:
        plantilla_path = "templates/formatoPlantilla.docx"
        doc = Document(plantilla_path)

        reemplazar_campos(doc, datos)

        output_id = str(uuid.uuid4())
        output_path = f"generated/documento_{output_id}.docx"
        doc.save(output_path)

        return FileResponse(
            output_path,
            filename="escritura_generada.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))