import { useState } from "react";
import { Search, Plus, Utensils, Edit2, Trash2, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeedingStore } from "../../../shared/store/feedingStore";
import alertService from "../../../shared/utils/alertService";
import { FeedingPlanForm } from "./FeedingPlanForm";
import { FeedingPlanDetail } from "./FeedingPlanDetail";

export function FeedingPlans() {
  const plans = useFeedingStore((state) => state.plans);
  const deletePlan = useFeedingStore((state) => state.deletePlan);

  const [viewMode, setViewMode] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // ID of plan to delete

  // Derived state
  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.animalType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type) => {
    switch (type) {
      case "Bovino":
        return "bg-blue-100 text-blue-700";
      case "Porcino":
        return "bg-pink-100 text-pink-700";
      case "Ovino":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Handlers
  const handleCreate = () => {
    setSelectedPlan(null);
    setViewMode("create");
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setViewMode("edit");
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setViewMode("view");
  };

  const handleDelete = (id) => {
    deletePlan(id);
    setDeleteConfirm(null);
    alertService.success(
      "Plan de alimentación eliminado correctamente",
      "Éxito"
    );
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedPlan(null);
  };

  const handleSave = () => {
    setViewMode("list");
    setSelectedPlan(null);
  };

  // Render Content based on View Mode
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <FeedingPlanForm
        planToEdit={selectedPlan}
        onCancel={handleBack}
        onSave={handleSave}
      />
    );
  }

  if (viewMode === "view") {
    return (
      <FeedingPlanDetail
        plan={selectedPlan}
        onBack={handleBack}
        onEdit={(plan) => handleEdit(plan)}
      />
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Eliminar Plan?
                </h3>
                <p className="text-gray-500">
                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres
                  eliminar este plan de alimentación?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-200"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Image Banner */}
      <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl group">
        <img
          src="https://agroclick.org/agpanel/assets/img/blogs/bovinos_2.jpg"
          alt="Feeding Banner"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.classList.add(
              "bg-gradient-to-r",
              "from-farm-green-800",
              "to-farm-green-600"
            );
          }}
        />
        <div className="absolute inset-0 bg-farm-green-900/90 flex items-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gestión Nutricional
            </h1>
            <p className="text-farm-green-100 text-lg mb-8">
              Optimiza la salud y productividad de tu ganado con planes de
              alimentación balanceados y controlados.
            </p>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-white text-farm-green-900 hover:bg-farm-green-50 px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Crear Nuevo Plan
            </button>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Bar */}
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
            placeholder="Buscar por nombre o tipo..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-farm-green-500 focus:bg-white transition-all"
          />
        </div>
        <div className="text-sm font-medium text-gray-500">
          Mostrando{" "}
          <span className="text-farm-green-700 font-bold">
            {filteredPlans.length}
          </span>{" "}
          planes activos
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-farm-green-200 transition-all group"
          >
            {/* Card Header */}
            <div className="bg-farm-green-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                <Utensils className="w-24 h-24 text-white rotate-12" />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                      {plan.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/20 text-white backdrop-blur-sm">
                      {plan.ageGroup}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Tipo
                  </p>
                  <span
                    className={`px-2 py-0.5 text-sm font-bold rounded-md ${getTypeColor(
                      plan.animalType
                    )} bg-opacity-0 p-0`}
                  >
                    {plan.animalType}
                  </span>
                </div>
                <div className="p-3 bg-green-50/50 rounded-xl border border-green-100">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Raciones
                  </p>
                  <p className="text-gray-900 font-bold">
                    {plan.feedsPerDay}/día
                  </p>
                </div>
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Total
                  </p>
                  <p className="text-gray-900 font-bold">{plan.totalDaily}</p>
                </div>
                <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Costo
                  </p>
                  <p className="text-gray-900 font-bold">{plan.cost}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleView(plan)}
                  className="flex-1 flex items-center justify-center gap-2 bg-farm-green-50 hover:bg-farm-green-100 text-farm-green-700 py-2.5 rounded-xl font-medium transition-colors group-hover:bg-farm-green-600 group-hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalles
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="p-2.5 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-xl transition-colors border border-gray-200 hover:border-blue-200"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(plan.id)}
                  className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-colors border border-gray-200 hover:border-red-200"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedingPlans;
