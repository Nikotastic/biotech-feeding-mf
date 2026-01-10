import React, { useState } from "react";
import { Plus, Calendar, Search, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFeedingEvents } from "../hooks/useFeedingEvents";
import { FeedingEventForm } from "./FeedingEventForm";
import { feedingEventsService } from "../services/feedingEventsService";
import alertService from "../../../shared/utils/alertService";

export function FeedingEventsList() {
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  // IMPORTANT: We need a way to get the current Farm ID.
  // For now, I'll hardcode or try to read from localStorage just like HealthService did.
  // Ideally this comes from a shared Auth Context/Store exposed via Module Federation.
  const authStorage = localStorage.getItem("auth-storage");
  let farmId = null;
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      farmId = parsed?.state?.selectedFarm?.id;
    } catch (e) {
      console.error("Error parsing auth storage", e);
    }
  }

  const { events, loading, error, refetch } = useFeedingEvents(farmId);

  const filteredEvents =
    events?.filter(
      (e) =>
        e.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.animalName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreateSuccess = () => {
    setViewMode("list");
    refetch();
    alertService.success("Registro de alimentación creado con éxito", "Éxito");
  };

  const handleCancelEvent = async (id) => {
    const result = await alertService.confirm(
      "¿Estás seguro de cancelar este evento?",
      "Confirmar Cancelación",
      "Sí, cancelar",
      "No"
    );
    if (!result.isConfirmed) return;
    try {
      await feedingEventsService.cancelEvent(id);
      alertService.success("Evento cancelado", "Éxito");
      refetch();
    } catch (e) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-farm-green-100">
        <div>
          <h2 className="text-2xl font-bold text-farm-green-900">
            Historial de Alimentación
          </h2>
          <p className="text-gray-500">Registro de eventos de consumo</p>
        </div>
        <button
          onClick={() => setViewMode("create")}
          className="flex items-center gap-2 bg-farm-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-farm-green-700 transition-all shadow-lg shadow-farm-green-200"
        >
          <Plus className="w-5 h-5" />
          Registrar Evento
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por producto o animal..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
        />
      </div>

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
                    {event.productName || "Producto desconocido"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} -{" "}
                    {event.animalName
                      ? `Animal: ${event.animalName}`
                      : `Lote: ${event.batchName || "N/A"}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block font-bold text-lg text-farm-green-700">
                    {event.quantity} kg
                  </span>
                  <span className="text-xs text-gray-400">Cantidad</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-lg text-gray-700">
                    ${event.cost || 0}
                  </span>
                  <span className="text-xs text-gray-400">Costo</span>
                </div>
                <button
                  onClick={() => handleCancelEvent(event.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Cancelar evento"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
