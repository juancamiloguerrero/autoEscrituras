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
    tipoPredio: 'urbano',
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
    domicilio: '',
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
    domicilio: '',
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
          domicilio: '',
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
          domicilio: '',
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
      if (!comprador.domicilio.trim()) {
        nuevosErrores[`comprador-${index}-domicilio`] = 'Domicilio requerido';
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
        nuevosErrores[`comprador-${index}-correo`] = 'Correo electrónico requerido';
      } else if (!/\S+@\S+\.\S+/.test(comprador.correo)) {
        nuevosErrores[`comprador-${index}-correo`] = 'Correo electrónico inválido';
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
      if (!vendedor.domicilio.trim()) {
        nuevosErrores[`vendedor-${index}-domicilio`] = 'Domicilio requerido';
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
        nuevosErrores[`vendedor-${index}-correo`] = 'Correo electrónico requerido';
      } else if (!/\S+@\S+\.\S+/.test(vendedor.correo)) {
        nuevosErrores[`vendedor-${index}-correo`] = 'Correo electrónico inválido';
      }
      if (!vendedor.ocupacion.trim()) {
        nuevosErrores[`vendedor-${index}-ocupacion`] = 'Ocupación requerida';
      }
    });

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      console.log('Datos a enviar:', {
        ...formData,
        valorActo: parseFloat(formData.valorActo),
        compradores,
        vendedores
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
      domicilio: '',
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
      domicilio: '',
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      
      {/* Sección de Datos Básicos */}
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Fecha de otorgamiento</label>
          <input
            type="date"
            name="fechaOtorgamiento"
            value={formData.fechaOtorgamiento}
            onChange={(e) => setFormData({...formData, fechaOtorgamiento: e.target.value})}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errores.fechaOtorgamiento ? 'border-red-500' : 'border-gray-300'
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errores.fechaOtorgamiento && (
            <p className="mt-1 text-sm text-red-600">{errores.fechaOtorgamiento}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Matrícula inmobiliaria</label>
          <input
            type="text"
            name="matriculaInmobiliaria"
            value={formData.matriculaInmobiliaria}
            onChange={(e) => setFormData({...formData, matriculaInmobiliaria: e.target.value})}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errores.matriculaInmobiliaria ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errores.matriculaInmobiliaria && (
            <p className="mt-1 text-sm text-red-600">{errores.matriculaInmobiliaria}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Cédula Catastral</label>
          <input
            type="text"
            inputMode="numeric"
            name="cedulaCatastral"
            value={formData.cedulaCatastral}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({...formData, cedulaCatastral: value});
            }}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errores.cedulaCatastral ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errores.cedulaCatastral && (
            <p className="mt-1 text-sm text-red-600">{errores.cedulaCatastral}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="mayorExtension"
            name="mayorExtension"
            checked={formData.mayorExtension}
            onChange={(e) => setFormData({...formData, mayorExtension: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="mayorExtension" className="ml-2 block text-sm text-gray-700">
            ¿Mayor extensión?
          </label>
        </div>
      </div>

      {/* Sección de Ubicación */}
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Departamento</label>
          <select
            name="departamento"
            value={formData.departamento}
            onChange={(e) => setFormData({...formData, departamento: e.target.value})}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
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
            <p className="mt-1 text-sm text-red-600">{errores.departamento}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Ciudad/Municipio</label>
          <select
            name="ciudad"
            value={formData.ciudad}
            onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
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
            <p className="mt-1 text-sm text-red-600">{errores.ciudad}</p>
          )}
        </div>
      </div>

      {/* Sección de Detalles Adicionales */}
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Tipo de predio</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoPredio"
                value="Urbano"
                checked={formData.tipoPredio === 'Urbano'}
                onChange={(e) => setFormData({...formData, tipoPredio: e.target.value})}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Urbano</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoPredio"
                value="Rural"
                checked={formData.tipoPredio === 'Rural'}
                onChange={(e) => setFormData({...formData, tipoPredio: e.target.value})}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Rural</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Nombre del lote/terreno</label>
          <input
            type="text"
            name="nombreLote"
            value={formData.nombreLote}
            onChange={(e) => setFormData({...formData, nombreLote: e.target.value})}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errores.nombreLote ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Las Acacias"
          />
          {errores.nombreLote && (
            <p className="mt-1 text-sm text-red-600">{errores.nombreLote}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errores.direccion ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Calle 123 #45-67"
          />
          {errores.direccion && (
            <p className="mt-1 text-sm text-red-600">{errores.direccion}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Acto</label>
          <input
            type="text"
            inputMode="numeric"
            name="acto"
            value={formData.acto}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({...formData, acto: value});
            }}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errores.acto ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0137"
          />
          {errores.acto && (
            <p className="mt-1 text-sm text-red-600">{errores.acto}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Valor del acto</label>
          <div className="relative">
            <span className="absolute left-3 top-3">$</span>
            <input
              type="text"
              name="valorActo"
              value={new Intl.NumberFormat('es-CO', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }).format(formData.valorActo.replace(/[^0-9]/g, '') || 0)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                setFormData({...formData, valorActo: rawValue});
              }}
              onBlur={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                setFormData({...formData, valorActo: rawValue});
              }}
              className={`w-full pl-8 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errores.valorActo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errores.valorActo && (
            <p className="mt-1 text-sm text-red-600">{errores.valorActo}</p>
          )}
        </div>
      </div>

      {/* Nueva sección: Compradores */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800">Compradores</h3>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            ¿Cuántos compradores son?
          </label>
          <select
            value={cantidadCompradores}
            onChange={(e) => setCantidadCompradores(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {compradores.map((comprador, index) => (
          <div key={`comprador-${index}`} className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium">Comprador #{index + 1}</h4>
            
            <div>
              <label className="block mb-1 text-sm text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={comprador.nombreCompleto}
                onChange={(e) => handleCompradorChange(index, 'nombreCompleto', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Número de identificación</label>
                <input
                  type="text"
                  value={comprador.identificacion}
                  onChange={(e) => handleCompradorChange(index, 'identificacion', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Lugar de expedición</label>
                <input
                  type="text"
                  value={comprador.expedicion}
                  onChange={(e) => handleCompradorChange(index, 'expedicion', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700">Domicilio y ciudad</label>
              <input
                type="text"
                value={comprador.domicilio}
                onChange={(e) => handleCompradorChange(index, 'domicilio', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={comprador.telefono}
                  onChange={(e) => handleCompradorChange(index, 'telefono', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Estado civil</label>
                <input
                  type="text"
                  value={comprador.estadoCivil}
                  onChange={(e) => handleCompradorChange(index, 'estadoCivil', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-700">Sexo</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`comprador-${index}-sexo`}
                      value="Masculino"
                      checked={comprador.sexo === 'Masculino'}
                      onChange={(e) => handleCompradorChange(index, 'sexo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">Masculino</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`comprador-${index}-sexo`}
                      value="Femenino"
                      checked={comprador.sexo === 'Femenino'}
                      onChange={(e) => handleCompradorChange(index, 'sexo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">Femenino</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  value={comprador.correo}
                  onChange={(e) => handleCompradorChange(index, 'correo', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Ocupación</label>
                <input
                  type="text"
                  value={comprador.ocupacion}
                  onChange={(e) => handleCompradorChange(index, 'ocupacion', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {compradores.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarComprador(index)}
                className="text-red-600 text-sm"
              >
                Eliminar comprador
              </button>
            )}
          </div>
        ))}

        {cantidadCompradores > 1 && compradores.length < 5 && (
          <button
            type="button"
            onClick={agregarComprador}
            className="text-blue-600 text-sm"
          >
            + Agregar otro comprador
          </button>
        )}
      </div>

      {/* Sección de Vendedores (similar a compradores) */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800">Vendedores</h3>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            ¿Cuántos vendedores son?
          </label>
          <select
            value={cantidadVendedores}
            onChange={(e) => setCantidadVendedores(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {vendedores.map((vendedor, index) => (
          <div key={`vendedor-${index}`} className="space-y-4 border p-4 rounded-lg">
            <h4 className="font-medium">Vendedor #{index + 1}</h4>
            
            {/* Campos del vendedor (igual que los de comprador) */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={vendedor.nombreCompleto}
                onChange={(e) => handleVendedorChange(index, 'nombreCompleto', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Número de identificación</label>
                <input
                  type="text"
                  value={vendedor.identificacion}
                  onChange={(e) => handleVendedorChange(index, 'identificacion', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Lugar de expedición</label>
                <input
                  type="text"
                  value={vendedor.expedicion}
                  onChange={(e) => handleVendedorChange(index, 'expedicion', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700">Domicilio y ciudad</label>
              <input 
                type="text"
                value={vendedor.domicilio}
                onChange={(e) => handleVendedorChange(index, 'domicilio', e.target.value)}
                className="w-full p-2 border rounded-md"  
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={vendedor.telefono}
                  onChange={(e) => handleVendedorChange(index, 'telefono', e.target.value)}
                  className="w-full p-2 border rounded-md" 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Estado civil</label>
                <input
                  type="text"
                  value={vendedor.estadoCivil}
                  onChange={(e) => handleVendedorChange(index, 'estadoCivil', e.target.value)}
                  className="w-full p-2 border rounded-md" 
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-700">Sexo</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`vendedor-${index}-sexo`}
                      value="Masculino"
                      checked={vendedor.sexo === 'Masculino'}
                      onChange={(e) => handleVendedorChange(index, 'sexo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2">Masculino</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`vendedor-${index}-sexo`}
                      value="Femenino"
                      checked={vendedor.sexo === 'Femenino'}
                      onChange={(e) => handleVendedorChange(index, 'sexo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="ml-2">Femenino</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  value={vendedor.correo}
                  onChange={(e) => handleVendedorChange(index, 'correo', e.target.value)}
                  className="w-full p-2 border rounded-md" 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Ocupación</label>
                <input
                  type="text"
                  value={vendedor.ocupacion}
                  onChange={(e) => handleVendedorChange(index, 'ocupacion', e.target.value)}
                  className="w-full p-2 border rounded-md" 
                />
              </div>
            </div>

            {vendedores.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarVendedor(index)}
                className="text-red-600 text-sm"
              >
                Eliminar vendedor
              </button>
            )}
          </div>
        ))}

        {cantidadVendedores > 1 && vendedores.length < 5 && (
          <button
            type="button"
            onClick={agregarVendedor}
            className="text-blue-600 text-sm"
          >
            + Agregar otro vendedor
          </button>
        )}
      </div>

      {/* Sección: Información del inmueble */}
      <div className="space-y-4 border-t pt-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Descripción del inmueble</label>
          <textarea
            name="descripcionInmueble"
            value={formData.descripcionInmueble}
            onChange={(e) => setFormData({...formData, descripcionInmueble: e.target.value})}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Descripción detallada del inmueble" 
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Oficina de instrumentos públicos</label>
          <input
            type="text"
            name="oficinaInstrumentos"
            value={formData.oficinaInstrumentos}
            onChange={(e) => setFormData({...formData, oficinaInstrumentos: e.target.value})}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Oficina de Registro de Instrumentos Públicos de Bogotá"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Tradición</label>
          <textarea
            name="tradicion"
            value={formData.tradicion}
            onChange={(e) => setFormData({...formData, tradicion: e.target.value})}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Descripción de la tradición del inmueble"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Complementación de la tradición</label>
          <textarea
            name="complementosTradicion"
            value={formData.complementosTradicion}
            onChange={(e) => setFormData({...formData, complementosTradicion: e.target.value})}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Descripción de la complementación de la tradición del inmueble"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">¿Vivienda familiar?</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="viviendaFamiliar"
                value="Lote"
                checked={formData.viviendaFamiliar === 'Lote'}
                onChange={(e) => setFormData({...formData, viviendaFamiliar: e.target.value})}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Lote</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="viviendaFamiliar"
                value="Otro"
                checked={formData.viviendaFamiliar === 'Otro'}
                onChange={(e) => setFormData({...formData, viviendaFamiliar: e.target.value})}
                className="accent-green-600 focus:ring-blue-500"
              />
              <span className="ml-2">Otro</span>
            </label>
          </div>

          {formData.viviendaFamiliar === 'Otro' && (
            <div className="mt-2">
              <input
                type="text"
                name="descripcionViviendaFamiliar"
                value={formData.descripcionViviendaFamiliar}
                onChange={(e) => setFormData({ ...formData, descripcionViviendaFamiliar: e.target.value })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Describa el tipo de vivienda"
              />
            </div>
          )}

        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        Guardar
      </button>
    </form>
  );
}