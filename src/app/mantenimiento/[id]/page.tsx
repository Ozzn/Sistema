'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Mantenimiento {
  id: number;
  estado: string;
  fechaInicio: string | null;
  fechaPausa: string | null;
  fechaFinalizacion: string | null;
  diagnostico: string;
  recomendacion: string;
  observacionOperador: string;
  observacionSupervisor: string;
  tipo: string;
  prioridad: string;
  fechaEntrada: string;
  rutaUnidad: string;
  unidad: {
    modelo: { nombre: string };
    marca: { nombre: string };
    combustible: string;
    kilometraje: number;
  };
}

export default function MantenimientoDetallePage() {
  const params = useParams();
  const [mantenimiento, setMantenimiento] = useState<Mantenimiento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState<number>(0);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);

  const fetchMantenimiento = async (id: string) => {
    const res = await fetch(`/api/auth/mantenimiento/${id}`);
    if (!res.ok) throw new Error('No se pudo obtener el mantenimiento');
    const data = await res.json();
    setMantenimiento(data);

    if (data.fechaInicio && !data.fechaFinalizacion && !data.fechaPausa) {
      setTiempoTranscurrido(calcularTiempo(data.fechaInicio));
      setTemporizadorActivo(true);
    } else {
      setTemporizadorActivo(false);
    }
  };

  const calcularTiempo = (inicio: string) => {
    const inicioFecha = new Date(inicio).getTime();
    const ahora = Date.now();
    return Math.floor((ahora - inicioFecha) / 1000);
  };

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;

    fetchMantenimiento(id).catch(err => {
      console.error(err);
      setError('Error al cargar el mantenimiento');
      setCargando(false);
    }).finally(() => setCargando(false));
  }, [params?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (temporizadorActivo) {
      interval = setInterval(() => {
        setTiempoTranscurrido(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [temporizadorActivo]);

  const actualizarMantenimiento = async (nuevoEstado: string) => {
    if (!mantenimiento) return;

    const fechaCampo =
      nuevoEstado === 'EN_PROCESO' ? 'fechaInicio' :
      nuevoEstado === 'PAUSADO' ? 'fechaPausa' :
      nuevoEstado === 'FINALIZADO' ? 'fechaFinalizacion' : '';

    const ahora = new Date().toISOString();
    const payload: any = { estado: nuevoEstado };
    if (fechaCampo) payload[fechaCampo] = ahora;

    try {
      const res = await fetch(`/api/auth/mantenimiento/${mantenimiento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al actualizar mantenimiento');

      // Actualización basada en el estado anterior
      setMantenimiento(prevMantenimiento => {
        if (!prevMantenimiento) return prevMantenimiento;
        return { 
          ...prevMantenimiento, 
          estado: nuevoEstado, 
          [fechaCampo]: ahora 
        };
      });
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el estado del mantenimiento');
    }
  };

  const formatoTiempo = (segundos: number) => {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (cargando) return <div className="ml-[260px] p-6">Cargando...</div>;
  if (error) return <div className="ml-[260px] p-6 text-red-600">{error}</div>;
  if (!mantenimiento) return <div className="ml-[260px] p-6">No se encontró el mantenimiento</div>;

  const mostrarBotonIniciar = mantenimiento.estado !== 'EN_PROCESO' && !mantenimiento.fechaInicio;
  const mostrarBotonPausar = mantenimiento.estado === 'EN_PROCESO';
  const mostrarBotonReanudar = mantenimiento.estado === 'PAUSADO';
  const mostrarBotonFinalizar = mantenimiento.estado !== 'FINALIZADO';

  return (
    <div className="ml-[260px] p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Detalle de Mantenimiento #{mantenimiento.id}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded-lg shadow-md p-6 mb-6">
        <div><strong>Estado:</strong> {mantenimiento.estado}</div>
        <div><strong>Fecha de entrada:</strong> {mantenimiento.fechaEntrada}</div>
        <div><strong>Tipo:</strong> {mantenimiento.tipo}</div>
        <div><strong>Prioridad:</strong> {mantenimiento.prioridad}</div>
        <div><strong>Kilometraje:</strong> {mantenimiento.unidad.kilometraje} km</div>
        <div><strong>Ruta:</strong> {mantenimiento.rutaUnidad}</div>
        <div><strong>Marca:</strong> {mantenimiento.unidad.marca.nombre}</div>
        <div><strong>Modelo:</strong> {mantenimiento.unidad.modelo.nombre}</div>
        <div><strong>Combustible:</strong> {mantenimiento.unidad.combustible}</div>
        <div><strong>Diagnóstico:</strong> {mantenimiento.diagnostico}</div>
        <div><strong>Recomendación:</strong> {mantenimiento.recomendacion}</div>
        <div><strong>Obs. Operador:</strong> {mantenimiento.observacionOperador}</div>
        <div><strong>Obs. Supervisor:</strong> {mantenimiento.observacionSupervisor}</div>
      </div>

      {/* Fechas separadas */}
      <div className="bg-gray-50 p-4 rounded-md shadow mb-6 space-y-2">
        <div><strong>Fecha de inicio:</strong> {mantenimiento.fechaInicio ? new Date(mantenimiento.fechaInicio).toLocaleString() : '—'}</div>
        <div><strong>Fecha de pausa:</strong> {mantenimiento.fechaPausa ? new Date(mantenimiento.fechaPausa).toLocaleString() : '—'}</div>
        <div><strong>Fecha de finalización:</strong> {mantenimiento.fechaFinalizacion ? new Date(mantenimiento.fechaFinalizacion).toLocaleString() : '—'}</div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {mostrarBotonIniciar && (
          <button
            onClick={() => actualizarMantenimiento('EN_PROCESO')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Iniciar
          </button>
        )}
        {mostrarBotonPausar && (
          <button
            onClick={() => actualizarMantenimiento('PAUSADO')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Pausar
          </button>
        )}
        {mostrarBotonReanudar && (
          <button
            onClick={() => actualizarMantenimiento('EN_PROCESO')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reanudar
          </button>
        )}
        {mostrarBotonFinalizar && (
          <button
            onClick={() => actualizarMantenimiento('FINALIZADO')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Finalizar
          </button>
        )}
        {mantenimiento.fechaInicio && !mantenimiento.fechaFinalizacion && (
          <div className="text-gray-700 font-medium">
            Tiempo transcurrido: {formatoTiempo(tiempoTranscurrido)}
          </div>
        )}
      </div>
    </div>
  );
}
