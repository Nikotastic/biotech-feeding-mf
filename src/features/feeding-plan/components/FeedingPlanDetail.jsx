import { motion } from "framer-motion";
import { ArrowLeft, Edit2, Calendar, DollarSign, Activity } from "lucide-react";

export function FeedingPlanDetail({ plan, onBack, onEdit }) {
  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header with Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-farm-green-600 hover:text-farm-green-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a la lista
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-farm-green-100 overflow-hidden">
        {/* Banner Section inside Detail */}
        <div className="h-48 bg-gradient-to-r from-farm-green-800 to-farm-emerald-800 relative flex items-end p-8">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 w-full flex justify-between items-end">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm text-sm mb-3">
                {String(plan.animalType)}
              </span>
              <h1 className="text-3xl font-bold text-white mb-2">
                {String(plan.name)}
              </h1>
              <p className="text-farm-green-100 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Creado el: {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onEdit(plan)}
              className="flex items-center gap-2 bg-white text-farm-green-800 px-6 py-2.5 rounded-xl font-medium shadow-lg hover:bg-gray-50 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="bg-blue-50 p-6 rounded-2xl">
              <p className="text-blue-600 font-medium mb-1">Raciones Diarias</p>
              <p className="text-3xl font-bold text-blue-900">
                {String(plan.feedsPerDay)}
              </p>
              <p className="text-sm text-blue-400 mt-2">
                Distribuidas en el día
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl">
              <p className="text-purple-600 font-medium mb-1">Total Alimento</p>
              <p className="text-3xl font-bold text-purple-900">
                {String(plan.totalDaily)}
              </p>
              <p className="text-sm text-purple-400 mt-2">
                Kg por animal al día
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl">
              <p className="text-orange-600 font-medium mb-1">Costo Estimado</p>
              <p className="text-3xl font-bold text-orange-900">
                {String(plan.cost)}
              </p>
              <p className="text-sm text-orange-400 mt-2">Por animal al día</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Detalles Generales
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Grupo Etario</span>
                  <span className="font-medium text-gray-900">
                    {String(plan.ageGroup)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Estado</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.status === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {String(plan.status)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Animales Asignados</span>
                  <span className="font-medium text-gray-900">
                    {String(plan.animalsAssigned || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Notas y Restricciones
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Este plan está diseñado específicamente para maximizar el
                rendimiento en la etapa seleccionada. Se recomienda monitorear
                el consumo de agua y ajustar las raciones si se observan cambios
                en la condición corporal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
