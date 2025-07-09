'use client';
import { useState, useEffect } from 'react';

export default function Formulario() {
  const [formData, setFormData] = useState({
    fechaOtorgamiento: '',
    matriculaInmobiliaria: '',
    cedulaCatastral: '',
    mayorExtension: false,
    departamento: '',
    ciudad: '',
    tipoPredio: 'Urbano',
    nombreLote: '',
    direccion: '',
    acto: '',
    valorActo: '',
    descripcionInmueble: '',
    oficinaInstrumentos: '',
    tradicion: '',
    complementosTradicion: '',
    viviendaFamiliar: 'Lote',
    descripcionViviendaFamiliar: '',
    fechaPazYSalvo: '',
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [errores, setErrores] = useState({});
  
  // Estados para partes involucradas
  const [cantidadCompradores, setCantidadCompradores] = useState(1);
  const [cantidadVendedores, setCantidadVendedores] = useState(1);
  const [compradores, setCompradores] = useState([{
    nombreCompleto: '',
    identificacion: '',
    expedicion: '',
    domicilioDireccion: '',
    departamentoResidencia: '',
    ciudadResidencia: '',
    telefono: '',
    estadoCivil: '',
    sexo: '',
    correo: '',
    ocupacion: '',
  }]);
  
  const [vendedores, setVendedores] = useState([{
    nombreCompleto: '',
    identificacion: '',
    expedicion: '',
    domicilioDireccion: '',
    departamentoResidencia: '',
    ciudadResidencia: '',
    telefono: '',
    estadoCivil: '',
    sexo: '',
    correo: '',
    ocupacion: '',
  }]);

  // Cargar departamentos al iniciar
  useEffect(() => {
    fetch('/data/colombia.json')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(err => console.error("Error cargando departamentos:", err));
  }, []);

  // Actualizar ciudades cuando se selecciona un departamento
  useEffect(() => {
    if (formData.departamento) {
      const deptoSeleccionado = departamentos.find(
        depto => depto.departamento === formData.departamento
      );
      setCiudades(deptoSeleccionado?.ciudades || []);
      setFormData(prev => ({ ...prev, ciudad: '' }));
    }
  }, [formData.departamento, departamentos]);

  // Actualizar arrays de compradores/vendedores cuando cambia la cantidad
  useEffect(() => {
    // Para compradores
    if (cantidadCompradores > compradores.length) {
      const faltantes = cantidadCompradores - compradores.length;
      setCompradores([
        ...compradores,
        ...Array(faltantes).fill().map(() => ({
          nombreCompleto: '',
          identificacion: '',
          expedicion: '',
          domicilioDireccion: '',
          departamentoResidencia: '',
          ciudadResidencia: '',
          telefono: '',
          estadoCivil: '',
          sexo: '',
          correo: '',
          ocupacion: '',
        }))
      ]);
    } else if (cantidadCompradores < compradores.length) {
      setCompradores(compradores.slice(0, cantidadCompradores));
    }
  }, [cantidadCompradores]);

  useEffect(() => {
    // Para vendedores
    if (cantidadVendedores > vendedores.length) {
      const faltantes = cantidadVendedores - vendedores.length;
      setVendedores([
        ...vendedores,
        ...Array(faltantes).fill().map(() => ({
          nombreCompleto: '',
          identificacion: '',
          expedicion: '',
          domicilioDireccion: '',
          departamentoResidencia: '',
          ciudadResidencia: '',
          telefono: '',
          estadoCivil: '',
          sexo: '',
          correo: '',
          ocupacion: '',
        }))
      ]);
    } else if (cantidadVendedores < vendedores.length) {
      setVendedores(vendedores.slice(0, cantidadVendedores));
    }
  }, [cantidadVendedores]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevosErrores = {};
    
    // Validaciones del formulario principal (se mantienen igual)
    if (!formData.fechaOtorgamiento) {
      nuevosErrores.fechaOtorgamiento = 'La fecha es requerida';
    } else if (new Date(formData.fechaOtorgamiento) > new Date()) {
      nuevosErrores.fechaOtorgamiento = 'No puede ser fecha futura';
    }

    if (!formData.fechaPazYSalvo) {
      nuevosErrores.fechaPazYSalvo = 'La fecha de paz y salvo es requerida';
    } else if (new Date(formData.fechaPazYSalvo) > new Date()) {
      nuevosErrores.fechaPazYSalvo = 'No puede ser fecha futura';
    }

    if (!formData.matriculaInmobiliaria.trim()) {
      nuevosErrores.matriculaInmobiliaria = 'La matrícula es requerida';
    }

    if (formData.cedulaCatastral && !/^\d+$/.test(formData.cedulaCatastral)) {
      nuevosErrores.cedulaCatastral = 'Solo se permiten números';
    }

    if (!formData.departamento) {
      nuevosErrores.departamento = 'Seleccione un departamento';
    }

    if (!formData.ciudad) {
      nuevosErrores.ciudad = 'Seleccione una ciudad';
    }

    if (!formData.nombreLote.trim()) {
      nuevosErrores.nombreLote = 'El nombre del lote es requerido';
    }

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }

    if (!formData.acto) {
      nuevosErrores.acto = 'El acto es requerido';
    } else if (!/^\d+$/.test(formData.acto)) {
      nuevosErrores.acto = 'Solo se permiten números';
    }

    if (!formData.valorActo) {
      nuevosErrores.valorActo = 'El valor del acto es requerido';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.valorActo)) {
      nuevosErrores.valorActo = 'Formato monetario inválido';
    }

    // Validar datos de compradores
    compradores.forEach((comprador, index) => {
      if (!comprador.nombreCompleto.trim()) {
        nuevosErrores[`comprador-${index}-nombre`] = 'Nombre completo requerido';
      }
      if (!comprador.identificacion.trim()) {
        nuevosErrores[`comprador-${index}-id`] = 'Identificación requerida';
      }
      if (!comprador.expedicion.trim()) {
        nuevosErrores[`comprador-${index}-expedicion`] = 'Expedición requerida';
      }
      if (!comprador.domicilioDireccion.trim()) {
        nuevosErrores[`comprador-${index}-domicilioDireccion`] = 'Domicilio requerido';
      }
      if (!comprador.departamentoResidencia.trim()) {
        nuevosErrores[`comprador-${index}-departamentoResidencia`] = 'Departamento de residencia requerido';
      }
      if (!comprador.ciudadResidencia.trim()) {
        nuevosErrores[`comprador-${index}-ciudadResidencia`] = 'Ciudad de residencia requerida';
      }
      if (!comprador.telefono.trim()) {
        nuevosErrores[`comprador-${index}-telefono`] = 'Teléfono requerido';
      } else if (!/^\d+$/.test(comprador.telefono)) {
        nuevosErrores[`comprador-${index}-telefono`] = 'Solo se permiten números';
      }
      if (!comprador.estadoCivil.trim()) {
        nuevosErrores[`comprador-${index}-estadoCivil`] = 'Estado civil requerido';
      }
      if (!comprador.correo.trim()) {
        nuevosErrores[`comprador-${index}-correo`] = 'Debe ingresar algún valor (ej: sin correo)';
      }
      if (!comprador.ocupacion.trim()) {
        nuevosErrores[`comprador-${index}-ocupacion`] = 'Ocupación requerida';
      }
    });

    // Validar datos de vendedores (similar a compradores)
    vendedores.forEach((vendedor, index) => {
      if (!vendedor.nombreCompleto.trim()) {
        nuevosErrores[`vendedor-${index}-nombre`] = 'Nombre completo requerido';
      }
      if (!vendedor.identificacion.trim()) {
        nuevosErrores[`vendedor-${index}-id`] = 'Identificación requerida';
      }
      if (!vendedor.expedicion.trim()) {
        nuevosErrores[`vendedor-${index}-expedicion`] = 'Expedición requerida';
      }
      if (!vendedor.domicilioDireccion.trim()) {
        nuevosErrores[`vendedor-${index}-domicilio`] = 'Domicilio requerido';
      }
      if (!vendedor.departamentoResidencia.trim()) {
        nuevosErrores[`vendedor-${index}-departamentoResidencia`] = 'Departamento de residencia requerido';
      }
      if (!vendedor.ciudadResidencia.trim()) {
        nuevosErrores[`vendedor-${index}-ciudadResidencia`] = 'Ciudad de residencia requerida';
      }
      if (!vendedor.telefono.trim()) {
        nuevosErrores[`vendedor-${index}-telefono`] = 'Teléfono requerido';
      } else if (!/^\d+$/.test(vendedor.telefono)) {
        nuevosErrores[`vendedor-${index}-telefono`] = 'Solo se permiten números';
      }
      if (!vendedor.estadoCivil.trim()) {
        nuevosErrores[`vendedor-${index}-estadoCivil`] = 'Estado civil requerido';
      }
      if (!vendedor.correo.trim()) {
        nuevosErrores[`vendedor-${index}-correo`] = 'Debe ingresar algún valor (ej: sin correo)';
      }
      if (!vendedor.ocupacion.trim()) {
        nuevosErrores[`vendedor-${index}-ocupacion`] = 'Ocupación requerida';
      }
    });

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      const payload = {
        ...formData,
        valorActo: parseFloat(formData.valorActo),
        compradores,
        vendedores
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/generar-doc/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "escritura_generada.docx";
        a.click();
      })
      .catch(error => {
        console.error("Error generando el documento:", error);
        alert("Hubo un error al generar el archivo")
      });
    }
  };

  const handleCompradorChange = (index, field, value) => {
    const nuevosCompradores = [...compradores];
    nuevosCompradores[index][field] = value;
    setCompradores(nuevosCompradores);
  };

  const handleVendedorChange = (index, field, value) => {
    const nuevosVendedores = [...vendedores];
    nuevosVendedores[index][field] = value;
    setVendedores(nuevosVendedores);
  };

  const agregarComprador = () => {
    setCompradores([...compradores, {
      nombreCompleto: '',
      identificacion: '',
      expedicion: '',
      domicilioDireccion: '',
      departamentoResidencia: '',
      ciudadResidencia: '',
      telefono: '',
      estadoCivil: '',
      sexo: '',
      correo: '',
      ocupacion: '',
    }]);
    setCantidadCompradores(cantidadCompradores + 1);
  };

  const eliminarComprador = (index) => {
    if (compradores.length > 1) {
      const nuevosCompradores = compradores.filter((_, i) => i !== index);
      setCompradores(nuevosCompradores);
      setCantidadCompradores(nuevosCompradores.length);
    }
  };

  const agregarVendedor = () => {
    setVendedores([...vendedores, {
      nombreCompleto: '',
      identificacion: '',
      expedicion: '',
      domicilioDireccion: '',
      departamentoResidencia: '',
      ciudadResidencia: '',
      telefono: '',
      estadoCivil: '',
      sexo: '',
      correo: '',
      ocupacion: '',
    }]);
    setCantidadVendedores(cantidadVendedores + 1);
  };

  const eliminarVendedor = (index) => {
    if (vendedores.length > 1) {
      const nuevosVendedores = vendedores.filter((_, i) => i !== index);
      setVendedores(nuevosVendedores);
      setCantidadVendedores(nuevosVendedores.length);
    }
  };

// Renderizado del formulario
return (
  <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Registro</h2>
    
    {/* Sección de Datos Básicos */}
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fechaOtorgamiento" className="block mb-2 font-medium text-gray-700">Fecha de otorgamiento</label>
          <input
            type="date"
            id="fechaOtorgamiento"
            name="fechaOtorgamiento"
            value={formData.fechaOtorgamiento}
            onChange={(e) => setFormData({...formData, fechaOtorgamiento: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.fechaOtorgamiento ? 'border-red-500' : 'border-gray-300'
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errores.fechaOtorgamiento && (
            <p className="mt-2 text-sm text-red-600">{errores.fechaOtorgamiento}</p>
          )}
        </div>

        <div>
          <label htmlFor="fechaPazYSalvo" className="block mb-2 font-medium text-gray-700">Fecha de Paz y Salvo</label>
          <input
            type="date"
            id="fechaPazYSalvo"
            name="fechaPazYSalvo"
            value={formData.fechaPazYSalvo}
            onChange={(e) => setFormData({...formData, fechaPazYSalvo: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.fechaPazYSalvo ? 'border-red-500' : 'border-gray-300'
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errores.fechaPazYSalvo && (
            <p className="mt-2 text-sm text-red-600">{errores.fechaPazYSalvo}</p>
          )}
        </div>

        <div>
          <label htmlFor="matriculaInmobiliaria" className="block mb-2 font-medium text-gray-700">Matrícula inmobiliaria</label>
          <input
            type="text"
            id="matriculaInmobiliaria"
            name="matriculaInmobiliaria"
            value={formData.matriculaInmobiliaria}
            onChange={(e) => setFormData({...formData, matriculaInmobiliaria: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.matriculaInmobiliaria ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: 000-0000000"
          />
          {errores.matriculaInmobiliaria && (
            <p className="mt-2 text-sm text-red-600">{errores.matriculaInmobiliaria}</p>
          )}
        </div>

        <div>
          <label htmlFor="cedulaCatastral" className="block mb-2 font-medium text-gray-700">Cédula Catastral</label>
          <input
            type="text"
            inputMode="numeric"
            id="cedulaCatastral"
            name="cedulaCatastral"
            value={formData.cedulaCatastral}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({...formData, cedulaCatastral: value});
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.cedulaCatastral ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: 01020300010002"
          />
          {errores.cedulaCatastral && (
            <p className="mt-2 text-sm text-red-600">{errores.cedulaCatastral}</p>
          )}
        </div>

        <div className="flex items-center pt-8"> {/* Ajuste para alinear con los otros campos */}
          <input
            type="checkbox"
            id="mayorExtension"
            name="mayorExtension"
            checked={formData.mayorExtension}
            onChange={(e) => setFormData({...formData, mayorExtension: e.target.checked})}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
          />
          <label htmlFor="mayorExtension" className="ml-3 block text-base text-gray-700">
            ¿Mayor extensión?
          </label>
        </div>
      </div>
    </div>

    {/* Sección de Ubicación */}
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="departamento" className="block mb-2 font-medium text-gray-700">Departamento</label>
          <select
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={(e) => setFormData({...formData, departamento: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.departamento ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((depto) => (
              <option key={depto.id} value={depto.departamento}>
                {depto.departamento}
              </option>
            ))}
          </select>
          {errores.departamento && (
            <p className="mt-2 text-sm text-red-600">{errores.departamento}</p>
          )}
        </div>

        <div>
          <label htmlFor="ciudad" className="block mb-2 font-medium text-gray-700">Ciudad/Municipio</label>
          <select
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.ciudad ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!formData.departamento}
          >
            <option value="">{formData.departamento ? 'Seleccione una ciudad' : 'Primero seleccione departamento'}</option>
            {ciudades.map((ciudad, index) => (
              <option key={index} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          {errores.ciudad && (
            <p className="mt-2 text-sm text-red-600">{errores.ciudad}</p>
          )}
        </div>
      </div>
    </div>

    {/* Sección de Detalles Adicionales */}
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Tipo de predio</label>
          <div className="flex space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoPredio"
                value="Urbano"
                checked={formData.tipoPredio === 'Urbano'}
                onChange={(e) => setFormData({...formData, tipoPredio: e.target.value})}
                className="text-blue-600 focus:ring-blue-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Urbano</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoPredio"
                value="Rural"
                checked={formData.tipoPredio === 'Rural'}
                onChange={(e) => setFormData({...formData, tipoPredio: e.target.value})}
                className="text-blue-600 focus:ring-blue-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Rural</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="nombreLote" className="block mb-2 font-medium text-gray-700">Nombre del lote/terreno</label>
          <input
            type="text"
            id="nombreLote"
            name="nombreLote"
            value={formData.nombreLote}
            onChange={(e) => setFormData({...formData, nombreLote: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.nombreLote ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Las Acacias"
          />
          {errores.nombreLote && (
            <p className="mt-2 text-sm text-red-600">{errores.nombreLote}</p>
          )}
        </div>

        <div className="md:col-span-2"> {/* Ocupa ambas columnas */}
          <label htmlFor="direccion" className="block mb-2 font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.direccion ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Calle 123 #45-67"
          />
          {errores.direccion && (
            <p className="mt-2 text-sm text-red-600">{errores.direccion}</p>
          )}
        </div>

        <div>
          <label htmlFor="acto" className="block mb-2 font-medium text-gray-700">Acto</label>
          <input
            type="text"
            inputMode="numeric"
            id="acto"
            name="acto"
            value={formData.acto}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({...formData, acto: value});
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
              errores.acto ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0137"
          />
          {errores.acto && (
            <p className="mt-2 text-sm text-red-600">{errores.acto}</p>
          )}
        </div>

        <div>
          <label htmlFor="valorActo" className="block mb-2 font-medium text-gray-700">Valor del acto</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="text"
              id="valorActo"
              name="valorActo"
              value={formData.valorActo}
              onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9.]/g, '');
              setFormData({ ...formData, valorActo: rawValue });
              }}
              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out ${
                errores.valorActo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />

          </div>
          {errores.valorActo && (
            <p className="mt-2 text-sm text-red-600">{errores.valorActo}</p>
          )}
        </div>
      </div>
    </div>

    {/* Nueva sección: Compradores */}
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información de Compradores</h3>
      
      <div className="mb-6">
        <label htmlFor="cantidadCompradores" className="block mb-2 font-medium text-gray-700">
          ¿Cuántos compradores son?
        </label>
        <select
          id="cantidadCompradores"
          value={cantidadCompradores}
          onChange={(e) => setCantidadCompradores(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {compradores.map((comprador, index) => (
        <div key={`comprador-${index}`} className="space-y-4 border border-gray-300 p-5 rounded-lg mb-6 last:mb-0">
          <h4 className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">Comprador #{index + 1}</h4>
          
          <div>
            <label htmlFor={`comprador-${index}-nombre`} className="block mb-2 text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              id={`comprador-${index}-nombre`}
              value={comprador.nombreCompleto}
              onChange={(e) => handleCompradorChange(index, 'nombreCompleto', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Nombre completo del comprador"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`comprador-${index}-identificacion`} className="block mb-2 text-sm font-medium text-gray-700">Número de identificación</label>
              <input
                type="text"
                id={`comprador-${index}-identificacion`}
                value={comprador.identificacion}
                onChange={(e) => handleCompradorChange(index, 'identificacion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ej: 123456789"
              />
            </div>
            <div>
              <label htmlFor={`comprador-${index}-expedicion`} className="block mb-2 text-sm font-medium text-gray-700">Lugar de expedición</label>
              <input
                type="text"
                id={`comprador-${index}-expedicion`}
                value={comprador.expedicion}
                onChange={(e) => handleCompradorChange(index, 'expedicion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ciudad de expedición"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`comprador-${index}-domicilioDireccion`} className="block mb-2 text-sm font-medium text-gray-700">Dirección de domicilio</label>
            <input
              type="text"
              id={`comprador-${index}-domicilioDireccion`}
              value={comprador.domicilioDireccion}
              onChange={(e) => handleCompradorChange(index, 'domicilioDireccion', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Ej: Carrera 10 #20-30"
            />
          </div>

          <div>
            <label htmlFor={`comprador-${index}-departamentoResidencia`} className="block mb-2 text-sm font-medium text-gray-700">Departamento de residencia</label>
            <input
              type="text"
              id={`comprador-${index}-departamentoResidencia`}
              value={comprador.departamentoResidencia}
              onChange={(e) => handleCompradorChange(index, 'departamentoResidencia', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Ej: Cundinamarca, Antioquia, Valle del Cauca"
            />
          </div>

          <div>
            <label htmlFor={`comprador-${index}-ciudadResidencia`} className="block mb-2 text-sm font-medium text-gray-700">Ciudad de residencia</label>
            <input
              type="text"
              id={`comprador-${index}-ciudadResidencia`}
              value={comprador.ciudadResidencia}
              onChange={(e) => handleCompradorChange(index, 'ciudadResidencia', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Ej: Bogotá, Medellín, Cali"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`comprador-${index}-telefono`} className="block mb-2 text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                id={`comprador-${index}-telefono`}
                value={comprador.telefono}
                onChange={(e) => handleCompradorChange(index, 'telefono', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ej: 3001234567"
              />
            </div>
            <div>
              <label htmlFor={`comprador-${index}-estadoCivil`} className="block mb-2 text-sm font-medium text-gray-700">Estado civil</label>
              <input
                type="text"
                id={`comprador-${index}-estadoCivil`}
                value={comprador.estadoCivil}
                onChange={(e) => handleCompradorChange(index, 'estadoCivil', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ej: Soltero(a), Casado(a)"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Sexo</label>
              <div className="flex space-x-6">
                <label htmlFor={`comprador-${index}-sexo-masculino`} className="inline-flex items-center">
                  <input
                    type="radio"
                    id={`comprador-${index}-sexo-masculino`}
                    name={`comprador-${index}-sexo`}
                    value="Masculino"
                    checked={comprador.sexo === 'Masculino'}
                    onChange={(e) => handleCompradorChange(index, 'sexo', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Masculino</span>
                </label>
                <label htmlFor={`comprador-${index}-sexo-femenino`} className="inline-flex items-center">
                  <input
                    type="radio"
                    id={`comprador-${index}-sexo-femenino`}
                    name={`comprador-${index}-sexo`}
                    value="Femenino"
                    checked={comprador.sexo === 'Femenino'}
                    onChange={(e) => handleCompradorChange(index, 'sexo', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">Femenino</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`comprador-${index}-correo`} className="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="text"
                id={`comprador-${index}-correo`}
                value={comprador.correo}
                onChange={(e) => handleCompradorChange(index, 'correo', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label htmlFor={`comprador-${index}-ocupacion`} className="block mb-2 text-sm font-medium text-gray-700">Ocupación</label>
              <input
                type="text"
                id={`comprador-${index}-ocupacion`}
                value={comprador.ocupacion}
                onChange={(e) => handleCompradorChange(index, 'ocupacion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ej: Ingeniero, Estudiante"
              />
            </div>
          </div>

          {compradores.length > 1 && (
            <button
              type="button"
              onClick={() => eliminarComprador(index)}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar comprador
            </button>
          )}
        </div>
      ))}

      {cantidadCompradores > 0 && compradores.length < cantidadCompradores && ( // Solo permite agregar si no se ha alcanzado la cantidad deseada
        <button
          type="button"
          onClick={agregarComprador}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar otro comprador
        </button>
      )}
    </div>

    {/* Sección de Vendedores (similar a compradores) */}
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información de Vendedores</h3>
      
      <div className="mb-6">
        <label htmlFor="cantidadVendedores" className="block mb-2 font-medium text-gray-700">
          ¿Cuántos vendedores son?
        </label>
        <select
          id="cantidadVendedores"
          value={cantidadVendedores}
          onChange={(e) => setCantidadVendedores(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {vendedores.map((vendedor, index) => (
        <div key={`vendedor-${index}`} className="space-y-4 border border-gray-300 p-5 rounded-lg mb-6 last:mb-0">
          <h4 className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">Vendedor #{index + 1}</h4>
          
          {/* Campos del vendedor (igual que los de comprador) */}
          <div>
            <label htmlFor={`vendedor-${index}-nombre`} className="block mb-2 text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              id={`vendedor-${index}-nombre`}
              value={vendedor.nombreCompleto}
              onChange={(e) => handleVendedorChange(index, 'nombreCompleto', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Nombre completo del vendedor"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`vendedor-${index}-identificacion`} className="block mb-2 text-sm font-medium text-gray-700">Número de identificación</label>
              <input
                type="text"
                id={`vendedor-${index}-identificacion`}
                value={vendedor.identificacion}
                onChange={(e) => handleVendedorChange(index, 'identificacion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ej: 123456789"
              />
            </div>
            <div>
              <label htmlFor={`vendedor-${index}-expedicion`} className="block mb-2 text-sm font-medium text-gray-700">Lugar de expedición</label>
              <input
                type="text"
                id={`vendedor-${index}-expedicion`}
                value={vendedor.expedicion}
                onChange={(e) => handleVendedorChange(index, 'expedicion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                placeholder="Ciudad de expedición"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`vendedor-${index}-domicilioDireccion`} className="block mb-2 text-sm font-medium text-gray-700">Dirección de domicilio</label>
            <input 
              type="text"
              id={`vendedor-${index}-domicilioDireccion`}
              value={vendedor.domicilioDireccion}
              onChange={(e) => handleVendedorChange(index, 'domicilioDireccion', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"  
              placeholder="Eje: Carrera 10 #20-30"
            />
          </div>

          <div>
            <label htmlFor={`vendedor-${index}-ciudadResidencia`} className="block mb-2 text-sm font-medium text-gray-700">Ciudad de residencia</label>
            <input 
              type="text"
              id={`vendedor-${index}-ciudadResidencia`}
              value={vendedor.ciudadResidencia}
              onChange={(e) => handleVendedorChange(index, 'ciudadResidencia', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"  
              placeholder="Eje: Bogotá, Medellín, Cali"
            />
          </div>

          <div>
            <label htmlFor={`vendedor-${index}-departamentoResidencia`} className="block mb-2 text-sm font-medium text-gray-700">Departamento de residencia</label>
            <input 
              type="text"
              id={`vendedor-${index}-departamentoResidencia`}
              value={vendedor.departamentoResidencia}
              onChange={(e) => handleVendedorChange(index, 'departamentoResidencia', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"  
              placeholder="Eje: Cundinamarca, Antioquia, Valle del Cauca"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`vendedor-${index}-telefono`} className="block mb-2 text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                id={`vendedor-${index}-telefono`}
                value={vendedor.telefono}
                onChange={(e) => handleVendedorChange(index, 'telefono', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" 
                placeholder="Ej: 3001234567"
              />
            </div>
            <div>
              <label htmlFor={`vendedor-${index}-estadoCivil`} className="block mb-2 text-sm font-medium text-gray-700">Estado civil</label>
              <input
                type="text"
                id={`vendedor-${index}-estadoCivil`}
                value={vendedor.estadoCivil}
                onChange={(e) => handleVendedorChange(index, 'estadoCivil', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" 
                placeholder="Ej: Soltero(a), Casado(a)"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Sexo</label>
              <div className="flex space-x-6">
                <label htmlFor={`vendedor-${index}-sexo-masculino`} className="inline-flex items-center">
                  <input
                    type="radio"
                    id={`vendedor-${index}-sexo-masculino`}
                    name={`vendedor-${index}-sexo`}
                    value="Masculino"
                    checked={vendedor.sexo === 'Masculino'}
                    onChange={(e) => handleVendedorChange(index, 'sexo', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5" 
                  />
                  <span className="ml-2 text-gray-700">Masculino</span>
                </label>
                <label htmlFor={`vendedor-${index}-sexo-femenino`} className="inline-flex items-center">
                  <input
                    type="radio"
                    id={`vendedor-${index}-sexo-femenino`}
                    name={`vendedor-${index}-sexo`}
                    value="Femenino"
                    checked={vendedor.sexo === 'Femenino'}
                    onChange={(e) => handleVendedorChange(index, 'sexo', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5" 
                  />
                  <span className="ml-2 text-gray-700">Femenino</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`vendedor-${index}-correo`} className="block mb-2 text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="text"
                id={`vendedor-${index}-correo`}
                value={vendedor.correo}
                onChange={(e) => handleVendedorChange(index, 'correo', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" 
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label htmlFor={`vendedor-${index}-ocupacion`} className="block mb-2 text-sm font-medium text-gray-700">Ocupación</label>
              <input
                type="text"
                id={`vendedor-${index}-ocupacion`}
                value={vendedor.ocupacion}
                onChange={(e) => handleVendedorChange(index, 'ocupacion', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" 
                placeholder="Ej: Ingeniero, Estudiante"
              />
            </div>
          </div>

          {vendedores.length > 1 && (
            <button
              type="button"
              onClick={() => eliminarVendedor(index)}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar vendedor
            </button>
          )}
        </div>
      ))}

      {cantidadVendedores > 0 && vendedores.length < cantidadVendedores && ( // Solo permite agregar si no se ha alcanzado la cantidad deseada
        <button
          type="button"
          onClick={agregarVendedor}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar otro vendedor
        </button>
      )}
    </div>

    {/* Sección: Información del inmueble */}
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información Adicional del Inmueble</h3>
      <div className="space-y-6"> {/* Incrementado el espacio entre campos */}
        <div>
          <label htmlFor="descripcionInmueble" className="block mb-2 font-medium text-gray-700">Descripción del inmueble</label>
          <textarea
            id="descripcionInmueble"
            name="descripcionInmueble"
            value={formData.descripcionInmueble}
            onChange={(e) => setFormData({...formData, descripcionInmueble: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            rows="4"
            placeholder="Descripción detallada del inmueble (ej: área, linderos, mejoras)" 
          />
        </div>

        <div>
          <label htmlFor="oficinaInstrumentos" className="block mb-2 font-medium text-gray-700">Oficina de instrumentos públicos</label>
          <input
            type="text"
            id="oficinaInstrumentos"
            name="oficinaInstrumentos"
            value={formData.oficinaInstrumentos}
            onChange={(e) => setFormData({...formData, oficinaInstrumentos: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            placeholder="Ej: Oficina de Registro de Instrumentos Públicos de Bogotá"
          />
        </div>
        <div>
          <label htmlFor="tradicion" className="block mb-2 font-medium text-gray-700">Tradición</label>
          <textarea
            id="tradicion"
            name="tradicion"
            value={formData.tradicion}
            onChange={(e) => setFormData({...formData, tradicion: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            rows="4"
            placeholder="Descripción de la tradición del inmueble (ej: anteriores propietarios, historial)"
          />
        </div>

        <div>
          <label htmlFor="complementosTradicion" className="block mb-2 font-medium text-gray-700">Complementación de la tradición</label>
          <textarea
            id="complementosTradicion"
            name="complementosTradicion"
            value={formData.complementosTradicion}
            onChange={(e) => setFormData({...formData, complementosTradicion: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            rows="4"
            placeholder="Información adicional o complementaria a la tradición"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">¿Vivienda familiar?</label>
          <div className="flex space-x-6"> {/* Aumento de espacio */}
            <label htmlFor="viviendaFamiliar-lote" className="inline-flex items-center">
              <input
                type="radio"
                id="viviendaFamiliar-lote"
                name="viviendaFamiliar"
                value="Lote"
                checked={formData.viviendaFamiliar === 'Lote'}
                onChange={(e) => setFormData({...formData, viviendaFamiliar: e.target.value})}
                className="text-blue-600 focus:ring-blue-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Lote</span>
            </label>
            <label htmlFor="viviendaFamiliar-otro" className="inline-flex items-center">
              <input
                type="radio"
                id="viviendaFamiliar-otro"
                name="viviendaFamiliar"
                value="Otro"
                checked={formData.viviendaFamiliar === 'Otro'}
                onChange={(e) => setFormData({...formData, viviendaFamiliar: e.target.value})}
                className="text-blue-600 focus:ring-blue-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Otro</span>
            </label>
          </div>

          {formData.viviendaFamiliar === 'Otro' && (
            <div className="mt-4"> {/* Ajustado el margen superior */}
              <input
                type="text"
                name="descripcionViviendaFamiliar"
                value={formData.descripcionViviendaFamiliar}
                onChange={(e) => setFormData({ ...formData, descripcionViviendaFamiliar: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out border-gray-300"
                placeholder="Describa el tipo de vivienda (ej: Casa, Apartamento, Finca)"
              />
            </div>
          )}
        </div>
      </div>
    </div>

    <button
      type="submit"
      className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Guardar Información
    </button>
  </form>
);
}