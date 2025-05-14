import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaSearch, FaFilter, FaCalendarAlt, FaCreditCard, FaPaypal } from 'react-icons/fa';

const HistorialPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [periodo, setPeriodo] = useState('todos');

  useEffect(() => {
    // En un caso real, aquí cargarías los pagos del usuario desde tu API:
    // const cargarPagos = async () => {
    //   try {
    //     const respuesta = await axios.get('http://localhost/TFG_DAW/backend/controlador/controlador.php?action=obtenerHistorialPagos', { withCredentials: true });
    //     setPagos(respuesta.data);
    //   } catch (error) {
    //     console.error('Error al cargar historial de pagos:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // cargarPagos();
    
    // Simulamos datos para la demo
    setTimeout(() => {
      const pagosMock = [
        {
          id: 'INV-2024-001',
          curso: 'JavaScript Avanzado',
          fecha: '2024-10-15',
          monto: 49.99,
          metodo: 'tarjeta',
          estado: 'completado',
          factura: '#link-a-factura-1'
        },
        {
          id: 'INV-2024-002',
          curso: 'React Native Masterclass',
          fecha: '2024-11-05',
          monto: 59.99,
          metodo: 'paypal',
          estado: 'completado',
          factura: '#link-a-factura-2'
        },
        {
          id: 'INV-2024-003',
          curso: 'Python para Data Science',
          fecha: '2024-11-10',
          monto: 39.99,
          metodo: 'tarjeta',
          estado: 'completado',
          factura: '#link-a-factura-3'
        }
      ];
      setPagos(pagosMock);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDescargarFactura = (idFactura) => {
    // En un caso real, aquí descargarías la factura:
    // window.open(`http://localhost/TFG_DAW/backend/facturas/${idFactura}.pdf`, '_blank');
    alert(`Descargando factura ${idFactura}`);
  };

  const pagosFiltrados = pagos.filter(pago => {
    // Filtrar por texto
    const coincideTexto = pago.curso.toLowerCase().includes(filtro.toLowerCase()) || 
                         pago.id.toLowerCase().includes(filtro.toLowerCase());
    
    // Filtrar por período
    let coincidePeriodo = true;
    const fechaPago = new Date(pago.fecha);
    const hoy = new Date();
    
    if (periodo === 'mes') {
      const unMesAtras = new Date();
      unMesAtras.setMonth(hoy.getMonth() - 1);
      coincidePeriodo = fechaPago >= unMesAtras;
    } else if (periodo === 'trimestre') {
      const tresMesesAtras = new Date();
      tresMesesAtras.setMonth(hoy.getMonth() - 3);
      coincidePeriodo = fechaPago >= tresMesesAtras;
    } else if (periodo === 'año') {
      const unAñoAtras = new Date();
      unAñoAtras.setFullYear(hoy.getFullYear() - 1);
      coincidePeriodo = fechaPago >= unAñoAtras;
    }
    
    return coincideTexto && coincidePeriodo;
  });

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-pink-600 border-b-purple-600 border-l-pink-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">Cargando historial de pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Historial de Pagos y Facturas
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 mt-2 rounded-full"></div>
        </h2>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Buscar por curso o referencia..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 pl-10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          >
            <option value="todos">Todos los períodos</option>
            <option value="mes">Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="año">Último año</option>
          </select>
        </div>
        
        {/* Tarjeta de resumen */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">Total gastado</p>
              <h3 className="text-2xl font-bold text-white">
                {pagosFiltrados.reduce((total, pago) => total + pago.monto, 0).toFixed(2)}€
              </h3>
            </div>
            
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">Cursos adquiridos</p>
              <h3 className="text-2xl font-bold text-white">{pagosFiltrados.length}</h3>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Último pago</p>
              <h3 className="text-2xl font-bold text-white">
                {pagosFiltrados.length > 0 
                  ? new Date(pagosFiltrados[0].fecha).toLocaleDateString()
                  : 'N/A'
                }
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabla de pagos */}
      {pagosFiltrados.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700/50 bg-gray-800/30">
                <th className="p-4">Referencia</th>
                <th className="p-4">Curso</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Método</th>
                <th className="p-4">Importe</th>
                <th className="p-4">Factura</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((pago, index) => (
                <motion.tr 
                  key={pago.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-gray-700/30 last:border-0 hover:bg-gray-800/30"
                >
                  <td className="p-4 text-white font-medium">{pago.id}</td>
                  <td className="p-4 text-gray-300">{pago.curso}</td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-500" size={14} />
                      {new Date(pago.fecha).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      {pago.metodo === 'tarjeta' ? (
                        <><FaCreditCard className="mr-2 text-purple-400" size={14} /> Tarjeta</>
                      ) : (
                        <><FaPaypal className="mr-2 text-blue-400" size={14} /> PayPal</>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-green-400 font-medium">{pago.monto.toFixed(2)}€</td>
                  <td className="p-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDescargarFactura(pago.id)}
                      className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FaDownload className="mr-1" size={14} /> Descargar
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400">
          No se encontraron registros de pagos que coincidan con los criterios de búsqueda
        </div>
      )}
      
      <div className="p-4 bg-gray-800/30 border-t border-gray-700/50 text-sm text-gray-400">
        Mostrado {pagosFiltrados.length} de {pagos.length} pagos
      </div>
    </div>
  );
};

export default HistorialPagos;
