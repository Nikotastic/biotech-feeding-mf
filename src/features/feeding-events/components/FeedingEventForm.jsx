import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Save, X, Database, Zap, Activity, Info, Settings } from "lucide-react";
import { feedingEventsService } from "../services/feedingEventsService";
import alertService from "@shared/utils/alertService";

export function FeedingEventForm({ farmId, onCancel, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      targetType: "Animal",
      targetId: "",
      productId: "",
      quantity: "",
      cost: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        farmId: Number(farmId),
        date: new Date(data.date).toISOString(),
        quantity: Number(data.quantity),
        productId: Number(data.productId),
        animalId: data.targetType === "Animal" ? Number(data.targetId) : null,
        batchId: data.targetType === "Batch" ? Number(data.targetId) : null,
      };

      await feedingEventsService.createEvent(payload);
      onSuccess();
    } catch (error) {
      console.error(error);
      alertService.error(
        "Error al crear el evento. Verifica los datos.",
        "Error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    Registrar Evento
                  </h2>
                </div>
                <p className="text-green-100/80 text-sm md:text-lg max-w-xl font-medium">
                  Registre el suministro de alimento para su activo o lote.
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
              <h3 className={sectionTitleStyles}>DESTINO Y FECHA</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyles}>Fecha del Evento</label>
                  <input
                    type="date"
                    {...register("date", { required: "Fecha requerida" })}
                    className={inputStyles}
                  />
                  {errors.date && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.date.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className={labelStyles}>Tipo de Destino</label>
                  <select {...register("targetType")} className={inputStyles}>
                    <option value="Animal">Individual (Animal)</option>
                    <option value="Batch">Lote (Batch)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  ID{" "}
                  {watch("targetType") === "Animal" ? "del Animal" : "del Lote"}
                </label>
                <input
                  type="number"
                  {...register("targetId", { required: "ID Requerido" })}
                  placeholder={`Ingrese ID del ${watch("targetType") === "Animal" ? "Animal" : "Lote"}`}
                  className={inputStyles}
                />
                {errors.targetId && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.targetId.message}
                  </span>
                )}
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                  En el futuro, esto será un buscador interactivo.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <h3 className={sectionTitleStyles}>PRODUCTO SUMINISTRADO</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className={labelStyles}>ID Producto / Alimento</label>
                <input
                  type="number"
                  {...register("productId", { required: "Producto requerido" })}
                  placeholder="ID del Alimento"
                  className={inputStyles}
                />
                {errors.productId && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.productId.message}
                  </span>
                )}
              </div>

              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <p className="text-blue-800 text-xs sm:text-sm font-medium leading-relaxed">
                  Asegúrese de vincular correctamente el producto de su
                  inventario para mantener el conteo exacto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: METRICS */}
        <div className="bg-gray-50/50 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100/50 space-y-8 md:space-y-10">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            <h3 className={sectionTitleStyles}>DOSIFICACIÓN Y CANTIDAD</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <label className={labelStyles}>Cantidad Suministrada</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  {...register("quantity", {
                    required: "Cantidad requerida",
                    min: 0,
                  })}
                  className={`${inputStyles} pr-12`}
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-400 uppercase">
                  KG/L
                </span>
              </div>
              {errors.quantity && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.quantity.message}
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
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-4 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] bg-[#1a5a35] hover:bg-[#134428] text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-green-900/40 transition-all border border-green-400/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5 md:w-6 md:h-6 text-green-300" />
              )}
              {isSubmitting ? "PROCESANDO..." : "CONFIRMAR REGISTRO"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
