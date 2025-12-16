import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Save, X, Info } from "lucide-react";
import { useFeedingStore } from "../../../shared/store/feedingStore";
import { useToastStore } from "../../../shared/store/toastStore";

export function FeedingPlanForm({ planToEdit, onCancel, onSave }) {
  const addPlan = useFeedingStore((state) => state.addPlan);
  const updatePlan = useFeedingStore((state) => state.updatePlan);
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: planToEdit || {
      name: "",
      animalType: "Bovino",
      ageGroup: "",
      feedsPerDay: 1,
      totalDaily: "",
      cost: "",
      animalsAssigned: 0,
      status: "Activo",
    },
  });

  const onSubmit = (data) => {
    // Ensure numeric fields are properly converted
    const formattedData = {
      ...data,
      feedsPerDay: Number(data.feedsPerDay),
      animalsAssigned: Number(data.animalsAssigned || 0),
    };

    if (planToEdit) {
      updatePlan({ ...planToEdit, ...formattedData });
      addToast("Plan actualizado correctamente", "success");
    } else {
      addPlan({ ...formattedData, id: Date.now().toString() });
      addToast("Plan creado correctamente", "success");
    }
    onSave();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-3xl shadow-xl border border-farm-green-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-farm-green-600 to-farm-emerald-600 p-6">
        <h2 className="text-2xl font-bold text-white">
          {planToEdit
            ? "Editar Plan de Alimentación"
            : "Nuevo Plan de Alimentación"}
        </h2>
        <p className="text-farm-green-100">
          Complete la información del régimen alimenticio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del Plan */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Plan
            </label>
            <input
              {...register("name", { required: "El nombre es obligatorio" })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: Plan Engorde Intensivo"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Tipo de Animal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Animal
            </label>
            <select
              {...register("animalType")}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Bovino">Bovino</option>
              <option value="Porcino">Porcino</option>
              <option value="Ovino">Ovino</option>
              <option value="Equino">Equino</option>
            </select>
          </div>

          {/* Grupo Etario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo Etario
            </label>
            <input
              {...register("ageGroup", { required: "Campo obligatorio" })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: Adulto, Cría, Destete"
            />
            {errors.ageGroup && (
              <span className="text-red-500 text-sm">
                {errors.ageGroup.message}
              </span>
            )}
          </div>

          {/* Raciones por día */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raciones por Día
            </label>
            <input
              type="number"
              {...register("feedsPerDay", { min: 1 })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Total Diario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Diario (kg/l)
            </label>
            <input
              {...register("totalDaily", { required: "Campo obligatorio" })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: 15 kg"
            />
          </div>

          {/* Costo Estimado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo Estimado
            </label>
            <input
              {...register("cost", { required: "Campo obligatorio" })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: $45.00"
            />
          </div>

          {/* Animales Asignados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animales Asignados
            </label>
            <input
              type="number"
              {...register("animalsAssigned", { min: 0 })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: 42"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Borrador">Borrador</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-blue-700 text-sm">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Al guardar este plan, se actualizarán automáticamente las
            proyecciones de costos para los animales asignados.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-all"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-farm-green-600 hover:bg-farm-green-700 text-white font-medium shadow-lg shadow-farm-green-200 transition-all"
          >
            <Save className="w-5 h-5" />
            Guardar Plan
          </button>
        </div>
      </form>
    </motion.div>
  );
}
