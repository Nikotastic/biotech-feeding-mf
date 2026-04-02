import React, { useState, useEffect } from "react";
import { Plus, Calendar, Search, Trash2, Wheat, Eye, X } from "lucide-react";
import alertService from "@shared/utils/alertService";
import { useAuthStore } from "@shared/store/authStore";
import { useFeedingStore } from "@shared/store/feedingStore";
import { feedingService } from "@shared/services/feedingService";
import { FeedingEventForm } from "./FeedingEventForm";
import { motion, AnimatePresence } from "framer-motion";

export function FeedingEventsList() {
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const farmId = useAuthStore((s) => s.selectedFarm?.id);
  const events = useFeedingStore((s) => s.events);
  const loading = useFeedingStore((s) => s.loading);
  const error = useFeedingStore((s) => s.error);
  const fetchEventsByFarm = useFeedingStore((s) => s.fetchEventsByFarm);
  const cancelEventInStore = useFeedingStore((s) => s.cancelEvent);

  const [productsMap, setProductsMap] = useState({});
  const [animalsMap, setAnimalsMap] = useState({});
  const [batchesMap, setBatchesMap] = useState({});

  useEffect(() => {
    fetchEventsByFarm(farmId);
    
    // Load diccionaries for real names
    feedingService.getProducts().then((p) => {
      const map = {};
      p.forEach((i) => map[i.id] = i.name);
      setProductsMap(map);
    });
    feedingService.getAnimals().then((a) => {
      const map = {};
      a.forEach((i) => map[i.id] = i.name || i.identifier || i.tagNumber);
      setAnimalsMap(map);
    });
    feedingService.getBatches().then((b) => {
      const map = {};
      b.forEach((i) => map[i.id] = i.name);
      setBatchesMap(map);
    });
  }, [farmId]);

  const filteredEvents = (events ?? []).filter(
    (e) =>
      (e.productName || productsMap[e.productId] || `Producto #${e.productId}`)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.animalName || animalsMap[e.animalId] || `Animal #${e.animalId}`)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.batchName || batchesMap[e.batchId] || `Lote #${e.batchId}`)?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateSuccess = () => {
    setViewMode("list");
    fetchEventsByFarm(farmId);
    alertService.success("Registro de alimentación creado con éxito", "Éxito");
  };

  const handleCancelEvent = async (id) => {
    const result = await alertService.confirm(
      "¿Estás seguro de cancelar este evento?",
      "Confirmar Cancelación",
      "Sí, cancelar",
      "No",
    );
    if (!result.isConfirmed) return;
    try {
      await cancelEventInStore(id, farmId);
      alertService.success("Evento cancelado", "Éxito");
    } catch {
      alertService.error("Error al cancelar evento", "Error");
    }
  };

  if (viewMode === "create") {
    return (
      <FeedingEventForm
        farmId={farmId}
        onCancel={() => setViewMode("list")}
        onSuccess={handleCreateSuccess}
      />
    );
  }

  if (!farmId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Selecciona una granja para ver los registros.
      </div>
    );
  }

  const refetch = () => fetchEventsByFarm(farmId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        className="mb-6 md:mb-8 relative overflow-hidden rounded-2xl md:rounded-3xl group shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="relative max-md:min-h-[180px] md:h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=2670&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="relative h-full flex flex-col justify-center max-md:px-6 md:px-8 max-md:py-6 md:py-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex max-sm:flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-300/20 rounded-xl backdrop-blur-md">
                    <Wheat className="max-md:w-6 max-md:h-6 md:w-8 md:h-8 text-green-300" />
                  </div>
                  <h1 className="max-md:text-xl md:text-3xl font-bold text-white leading-tight">
                    Historial de Alimentación
                  </h1>
                </div>
                <p className="text-green-100/90 max-md:text-sm md:text-lg max-w-xl font-medium">
                  Lleva el registro detallado del consumo de alimentos para optimizar la salud de tu ganado.
                </p>
              </div>

              <div className="flex max-sm:flex-col sm:flex-row gap-3 max-sm:w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="max-sm:w-full sm:w-auto"
                >
                  <button
                    onClick={() => setViewMode("create")}
                    className="flex justify-center items-center gap-2 max-sm:w-full sm:w-auto bg-white text-green-800 hover:bg-green-50 shadow-lg font-bold max-sm:py-2.5 sm:py-2 px-6 rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Registrar Evento
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Search Bar with updated styling */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-farm-green-100"
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por producto o animal..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </motion.div>

      {/* Loading/Error/List */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error}{" "}
          <button onClick={refetch} className="underline ml-2">
            Reintentar
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500">
            No hay registros de alimentación para esta granja.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-farm-green-50 rounded-xl text-farm-green-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {event.productName || productsMap[event.productId] || (event.productId ? `Producto #${event.productId}` : "Producto desconocido")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.supplyDate || event.date || event.createdAt).toLocaleDateString()} -{" "}
                    {event.animalName || event.animalId
                      ? `Animal: ${event.animalName || animalsMap[event.animalId] || `#${event.animalId}`}`
                      : `Lote: ${event.batchName || batchesMap[event.batchId] || (event.batchId ? `#${event.batchId}` : "N/A")}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block font-bold text-lg text-farm-green-700">
                    {event.totalQuantity ?? event.quantity ?? 0} kg
                  </span>
                  <span className="text-xs text-gray-400">Cantidad</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                    title="Ver Detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCancelEvent(event.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Cancelar evento"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VER MAS MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-farm-green-600" />
                  Detalles del Evento
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Producto / Alimento</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {selectedEvent.productName || productsMap[selectedEvent.productId] || `Producto #${selectedEvent.productId}`}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Destino</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {selectedEvent.animalName || selectedEvent.animalId
                        ? `Animal: ${selectedEvent.animalName || animalsMap[selectedEvent.animalId] || `#${selectedEvent.animalId}`}`
                        : `Lote: ${selectedEvent.batchName || batchesMap[selectedEvent.batchId] || `#${selectedEvent.batchId}`}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-farm-green-50/50 p-4 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Fecha</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {new Date(selectedEvent.supplyDate || selectedEvent.date || selectedEvent.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="bg-farm-green-50/50 p-4 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Total Entregado</span>
                    <span className="font-bold text-farm-green-700">
                      {selectedEvent.totalQuantity ?? selectedEvent.quantity ?? 0} kg
                    </span>
                  </div>
                  <div className="bg-farm-green-50/50 p-4 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Animales Alimentados</span>
                    <span className="font-bold text-gray-800">
                      {selectedEvent.animalsFedCount ?? 1}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-2">Observaciones</span>
                  <p className="text-gray-700 text-sm italic">
                    {selectedEvent.observations ? `"${selectedEvent.observations}"` : "No se registraron observaciones adicionales para este suministro."}
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition-all shadow-md"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default FeedingEventsList;
