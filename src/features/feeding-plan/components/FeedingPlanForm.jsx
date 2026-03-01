import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Info,
  Zap,
  Settings,
  Database,
  Activity,
  DollarSign,
} from "lucide-react";
import { useFeedingStore } from "@shared/store/feedingStore";
import alertService from "@shared/utils/alertService";

export function FeedingPlanForm({ planToEdit, onCancel, onSave }) {
  const addPlan = useFeedingStore((state) => state.addPlan);
  const updatePlan = useFeedingStore((state) => state.updatePlan);

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
      alertService.success("Plan actualizado correctamente", "Éxito");
    } else {
      addPlan({ ...formattedData, id: Date.now().toString() });
      alertService.success("Plan creado correctamente", "Éxito");
    }
    onSave();
  };

  const isEditing = Boolean(planToEdit);

  const inputStyles =
    "w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/30 outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 shadow-sm";
  const labelStyles =
    "flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1";
  const sectionTitleStyles =
    "text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full my-4 md:my-6 bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden"
    >
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl group shadow-lg">
        <div
          className="relative min-h-[180px] md:h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/85 to-teal-900/90" />
          <div className="relative h-full flex flex-col justify-center px-6 md:px-8 py-6 md:py-0 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-300/20 rounded-xl backdrop-blur-md">
                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-green-300" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                    {isEditing
                      ? "Actualizar Plan"
                      : "Configuración de Nutrición"}
                  </h2>
                </div>
                <p className="text-green-100/80 text-sm md:text-lg max-w-xl font-medium">
                  {isEditing
                    ? `Editando los parámetros nutricionales para el plan ${planToEdit?.name}.`
                    : "Establezca los regímenes alimenticios para maximizar el rendimiento."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 md:p-10 lg:p-14 space-y-10 md:space-y-12"
      >
        {/* SECTION 1: IDENTITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <h3 className={sectionTitleStyles}>IDENTIDAD DEL PLAN</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className={labelStyles}>Nombre del Plan</label>
                <input
                  type="text"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  placeholder="Ej: Plan Engorde Intensivo"
                  className={`${inputStyles} ${errors.name ? "border-red-200" : ""}`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>Tipo de Animal</label>
                  <select {...register("animalType")} className={inputStyles}>
                    <option value="Bovino">Bovino</option>
                    <option value="Porcino">Porcino</option>
                    <option value="Ovino">Ovino</option>
                    <option value="Equino">Equino</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>Grupo Etario</label>
                  <input
                    type="text"
                    {...register("ageGroup", { required: "Campo obligatorio" })}
                    placeholder="Ej: Adulto, Cría, Destete"
                    className={`${inputStyles} ${errors.ageGroup ? "border-red-200" : ""}`}
                  />
                  {errors.ageGroup && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.ageGroup.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <h3 className={sectionTitleStyles}>ESTADO Y ASIGNACIÓN</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>Estado</label>
                  <select {...register("status")} className={inputStyles}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Borrador">Borrador</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>Animales Asignados</label>
                  <input
                    type="number"
                    {...register("animalsAssigned", { min: 0 })}
                    placeholder="Ej: 42"
                    className={inputStyles}
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex items-start gap-3 mt-4">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <p className="text-blue-800 text-xs sm:text-sm font-medium leading-relaxed">
                  Al guardar este plan, se actualizarán automáticamente las
                  proyecciones de costos para los animales asignados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: METRICS */}
        <div className="bg-gray-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100/50 space-y-8 md:space-y-10">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            <h3 className={sectionTitleStyles}>
              PROYECCIÓN Y MÉTRICAS NUTRICIONALES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <label className={labelStyles}>Raciones por Día</label>
              <input
                type="number"
                {...register("feedsPerDay", { min: 1 })}
                className={inputStyles}
                placeholder="Ej: 2"
              />
            </div>
            <div>
              <label className={labelStyles}>Total Diario</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("totalDaily", { required: "Campo obligatorio" })}
                  className={`${inputStyles} pr-14 ${errors.totalDaily ? "border-red-200" : ""}`}
                  placeholder="Ej: 15"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-400 uppercase">
                  KG/L
                </span>
              </div>
              {errors.totalDaily && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.totalDaily.message}
                </span>
              )}
            </div>
            <div>
              <label className={labelStyles}>Costo Estimado</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register("cost", { required: "Campo obligatorio" })}
                  className={`${inputStyles} pr-12 ${errors.cost ? "border-red-200" : ""}`}
                  placeholder="45.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">
                  $ USD
                </span>
              </div>
              {errors.cost && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.cost.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-gray-400 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Descartar cambios
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-4 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-[#1a5a35] hover:bg-[#134428] text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-green-900/40 transition-all border border-green-400/20"
            >
              <Save className="w-5 h-5 md:w-6 md:h-6 text-green-300" />
              {isEditing ? "CONFIRMAR" : "CONFIRMAR REGISTRO"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
