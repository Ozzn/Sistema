'use client'

import { useEffect, useState } from 'react'
import { Calendar, Edit, Trash2 } from 'lucide-react'

interface Mantenimiento {
  id: number
  estado: string
  prioridad: string
  fechaInicio: string | null
  fechaFinalizacion: string | null
  duracionTotal: string | null
  unidad: {
    id: number
    placa: string
    serialCarroceria: string
  }
  operador: {
    nombre: string
    apellido: string
    email: string
  }
  mecanico: {
    nombre: string
    apellido: string
    email: string
  }
}

export default function ProgresoMantenimientoPage() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const res = await fetch('/api/auth/mantenimiento')
        if (!res.ok) throw new Error("Error al cargar mantenimientos")
        const data = await res.json()
        setMantenimientos(data)
      } catch (error) {
        console.error('Error al cargar mantenimientos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMantenimientos()
  }, [])

  const resumen = {
    total: mantenimientos.length,
    pendientes: mantenimientos.filter(m => !m.fechaInicio).length,
    enProgreso: mantenimientos.filter(m => m.fechaInicio && !m.fechaFinalizacion).length,
    completados: mantenimientos.filter(m => m.fechaFinalizacion).length
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>
  }

  // Función para normalizar estados (minúsculas sin acentos)
  const normalizeStatus = (status: string) => {
    return status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  // Función para normalizar prioridades (minúsculas sin acentos)
  const normalizePriority = (priority: string) => {
    return priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 min-h-screen ml-0 md:ml-64 transition-all duration-300">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Trabajos</h1>
              <p className="text-gray-500 text-sm">Gestiona y supervisa todos los trabajos del taller</p>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResumenCard label="Total Trabajos" value={resumen.total} icon="📋" />
            <ResumenCard label="Pendientes" value={resumen.pendientes} icon="⏱️" />
            <ResumenCard label="En Progreso" value={resumen.enProgreso} icon="🔧" />
            <ResumenCard label="Completados" value={resumen.completados} icon="✅" />
          </div>

          {/* Tabla */}
          <div className="overflow-auto bg-white border rounded-lg shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Prioridad</th>
                  <th className="p-3">Unidad</th>
                  <th className="p-3">Operador</th>
                  <th className="p-3">Mecánico</th>
                  <th className="p-3">Inicio</th>
                  <th className="p-3">Fin</th>
                  <th className="p-3">Horas</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mantenimientos.length === 0 ? (
                  <tr><td colSpan={9} className="p-4 text-center">No hay mantenimientos disponibles</td></tr>
                ) : (
                  mantenimientos.map((m) => (
                    <tr key={m.id} className="border-t hover:bg-gray-50">
                      {/* Columna Estado */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            normalizeStatus(m.estado) === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : normalizeStatus(m.estado) === 'en progreso'
                              ? 'bg-blue-100 text-blue-800'
                              : normalizeStatus(m.estado) === 'finalizado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {m.estado}
                        </span>
                      </td>
                      
                      {/* Columna Prioridad */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            normalizePriority(m.prioridad) === 'urgente'
                              ? 'bg-red-100 text-red-800'
                              : normalizePriority(m.prioridad) === 'alta'
                              ? 'bg-orange-100 text-orange-800'
                              : normalizePriority(m.prioridad) === 'media'
                              ? 'bg-blue-100 text-blue-800'
                              : normalizePriority(m.prioridad) === 'baja'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {m.prioridad}
                        </span>
                      </td>
                      
                      <td className="p-3">
                        <div className="font-medium">{m.unidad.placa || m.unidad.id}</div>
                        <div className="text-xs text-gray-500">{m.unidad.serialCarroceria}</div>
                      </td>
                      
                      <td className="p-3">
                        <div>{m.operador.nombre} {m.operador.apellido}</div>
                        <div className="text-xs text-gray-500">{m.operador.email}</div>
                      </td>
                      
                      <td className="p-3">
                        <div>{m.mecanico.nombre} {m.mecanico.apellido}</div>
                        <div className="text-xs text-gray-500">{m.mecanico.email}</div>
                      </td>
                      
                      <td className="p-3">{m.fechaInicio ? new Date(m.fechaInicio).toLocaleString() : '-'}</td>
                      <td className="p-3">{m.fechaFinalizacion ? new Date(m.fechaFinalizacion).toLocaleString() : '-'}</td>
                      <td className="p-3">{m.duracionTotal || '-'}</td>
                      
                      <td className="p-3 flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumenCard({ label, value, icon }: { label: string, value: number, icon: string }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold flex items-center gap-2">
        <span>{icon}</span> {value}
      </div>
    </div>
  )
}