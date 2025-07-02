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
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [errores, setErrores] = useState({});
  const [tipoParte, setTipoParte] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [partes, setPartes] = useState([{
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevosErrores = {};
    
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

    // Validar datos de compradores/vendedores si se seleccionó tipo
    if (tipoParte) {
      partes.forEach((parte, index) => {
        if (!parte.nombreCompleto.trim()) {
          nuevosErrores[`parte-${index}-nombre`] = 'Nombre completo requerido';
        }
        if (!parte.identificacion.trim()) {
          nuevosErrores[`parte-${index}-id`] = 'Identificación requerida';
        }
        if (!parte.expedicion.trim()) {
          nuevosErrores[`parte-${index}-expedicion`] = 'Expedición requerida';
        }
        if (!parte.domicilio.trim()) {
          nuevosErrores[`parte-${index}-domicilio`] = 'Domicilio requerido';
        }
        if (!parte.telefono.trim()) {
          nuevosErrores[`parte-${index}-telefono`] = 'Teléfono requerido';
        } else if (!/^\d+$/.test(parte.telefono)) {
          nuevosErrores[`parte-${index}-telefono`] = 'Solo se permiten números';
        }
        if (!parte.estadoCivil.trim()) {
          nuevosErrores[`parte-${index}-estadoCivil`] = 'Estado civil requerido';
        }
        if (!parte.correo.trim()) {
          nuevosErrores[`parte-${index}-correo`] = 'Correo electrónico requerido';
        } else if (!/\S+@\S+\.\S+/.test(parte.correo)) {
          nuevosErrores[`parte-${index}-correo`] = 'Correo electrónico inválido';
        }
        if (!parte.ocupacion.trim()) {
          nuevosErrores[`parte-${index}-ocupacion`] = 'Ocupación requerida';
        }
      });
    }

    setErrores(nuevosErrores);



    if (Object.keys(nuevosErrores).length === 0) {
      console.log('Datos a enviar:', {
        ...formData,
        valorActo: parseFloat(formData.valorActo),
        [tipoParte.toLowerCase()]: partes
      });
    }
  };

  const handleParteChange = (index, field, value) => {
    const nuevasPartes = [...partes];
    nuevasPartes[index][field] = value;
    setPartes(nuevasPartes);
  };

  const agregarParte = () => {
    setPartes([...partes, {
        nombreCompleto: '',
        identificacion: '',
        expedicion: '',
        domicilio: '',
        telefono: '',
        estadoCivil: '',
        correo: '',
        ocupacion: '',
    }]);
  };

  const eliminarParte = (index) => {
    if (partes.length > 1) {
        const nuevasPartes = partes.filter((_, i) => i !== index);
        setPartes(nuevasPartes);
    }
  };

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

      {/* Nueva sección: Compradores/Vendedores */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800">Partes involucradas</h3>
        
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tipoParte"
              value="Compradores"
              checked={tipoParte === 'Compradores'}
              onChange={(e) => setTipoParte(e.target.value)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Compradores</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tipoParte"
              value="Vendedores"
              checked={tipoParte === 'Vendedores'}
              onChange={(e) => setTipoParte(e.target.value)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Vendedores</span>
          </label>
        </div>

        {tipoParte && (
          <>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                ¿Cuántos {tipoParte.toLowerCase()} son?
              </label>
              <select
                value={cantidad}
                onChange={(e) => {
                  const newCantidad = parseInt(e.target.value);
                  setCantidad(newCantidad);
                  // Ajustar el array de partes según la cantidad seleccionada
                  if (newCantidad > partes.length) {
                    const partesFaltantes = newCantidad - partes.length;
                    setPartes([
                      ...partes,
                      ...Array(partesFaltantes).fill().map(() => ({
                        nombreCompleto: '',
                        identificacion: '',
                        expedicion: '',
                        domicilio: '',
                        telefono: '',
                        estadoCivil: '',
                        correo: '',
                        ocupacion: ''
                      }))
                    ]);
                  } else if (newCantidad < partes.length) {
                    setPartes(partes.slice(0, newCantidad));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {partes.map((parte, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
                <h4 className="font-medium">{tipoParte} #{index + 1}</h4>
                
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Nombre completo</label>
                  <input
                    type="text"
                    value={parte.nombreCompleto}
                    onChange={(e) => handleParteChange(index, 'nombreCompleto', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">Número de identificación</label>
                    <input
                      type="text"
                      value={parte.identificacion}
                      onChange={(e) => handleParteChange(index, 'identificacion', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">Lugar de expedición</label>
                    <input
                      type="text"
                      value={parte.expedicion}
                      onChange={(e) => handleParteChange(index, 'expedicion', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">Domicilio y ciudad</label>
                  <input
                    type="text"
                    value={parte.domicilio}
                    onChange={(e) => handleParteChange(index, 'domicilio', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">Teléfono</label>
                    <input
                      type="text"
                      value={parte.telefono}
                      onChange={(e) => handleParteChange(index, 'telefono', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">Estado civil</label>
                    <select
                      value={parte.estadoCivil}
                      onChange={(e) => handleParteChange(index, 'estadoCivil', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Seleccione...</option>
                      <option value="Soltero">Soltero/a</option>
                      <option value="Casado">Casado/a</option>
                      <option value="Divorciado">Divorciado/a</option>
                      <option value="Viudo">Viudo/a</option>
                    </select>
                  </div>

                  {/* Nuevo campo: Sexo */}
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">Sexo</label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name={`sexo-${index}`}
                                value="Masculino"
                                checked={parte.sexo === 'Masculino'}
                                onChange={(e) => handleParteChange(index, 'sexo', e.target.value)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2">Masculino</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name={`sexo-${index}`}
                                value="Femenino"
                                checked={parte.sexo === 'Femenino'}
                                onChange={(e) => handleParteChange(index, 'sexo', e.target.value)}
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
                      value={parte.correo}
                      onChange={(e) => handleParteChange(index, 'correo', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">Ocupación</label>
                    <input
                      type="text"
                      value={parte.ocupacion}
                      onChange={(e) => handleParteChange(index, 'ocupacion', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                {partes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarParte(index)}
                    className="text-red-600 text-sm"
                  >
                    Eliminar {tipoParte.toLowerCase()}
                  </button>
                )}
              </div>
            ))}

            {cantidad > 1 && partes.length < 10 && (
              <button
                type="button"
                onClick={agregarParte}
                className="text-blue-600 text-sm"
              >
                + Agregar otro {tipoParte.toLowerCase()}
              </button>
            )}
          </>
        )}
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