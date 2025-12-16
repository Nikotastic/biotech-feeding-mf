import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Save, X } from "lucide-react";
import { feedingEventsService } from "../services/feedingEventsService";
import { useToastStore } from "../../../shared/store/toastStore";

export function FeedingEventForm({ farmId, onCancel, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      targetType: "Animal", // Animal or Batch
      targetId: "",
      productId: "",
      quantity: "",
      cost: "", // Optional if calculated by backend, but let's include
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        farmId: Number(farmId),
        date: new Date(data.date).toISOString(),
        quantity: Number(data.quantity),
        productId: Number(data.productId), // In a real app, this comes from a select dropdown of Products
        // Handle conditional animal/batch logic
        animalId: data.targetType === "Animal" ? Number(data.targetId) : null,
        batchId: data.targetType === "Batch" ? Number(data.targetId) : null,
      };

      await feedingEventsService.createEvent(payload);
      onSuccess();
    } catch (error) {
      console.error(error);
      addToast("Error al crear el evento. Verifica los datos.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-farm-green-100 overflow-hidden max-w-3xl mx-auto"
    >
      <div className="bg-farm-green-600 p-6">
        <h2 className="text-2xl font-bold text-white">
          Registrar Evento de Alimentación
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              {...register("date", { required: "Fecha requerida" })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-farm-green-500"
            />
          </div>

          {/* Target Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Destino
            </label>
            <select
              {...register("targetType")}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-farm-green-500"
            >
              <option value="Animal">Individual (Animal)</option>
              <option value="Batch">Lote (Batch)</option>
            </select>
          </div>

          {/* Target ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID {watch("targetType") === "Animal" ? "del Animal" : "del Lote"}
            </label>
            <input
              type="number"
              {...register("targetId", { required: "ID Requerido" })}
              placeholder={`Ingrese ID del ${
                watch("targetType") === "Animal" ? "Animal" : "Lote"
              }`}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-farm-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              En el futuro esto será un buscador.
            </p>
          </div>

          {/* Product ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Producto / Alimento
            </label>
            <input
              type="number"
              {...register("productId", { required: "Producto requerido" })}
              placeholder="ID del Alimento"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-farm-green-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad (kg)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("quantity", {
                required: "Cantidad requerida",
                min: 0,
              })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-farm-green-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-all"
          >
            <X className="w-5 h-5" /> Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-farm-green-600 hover:bg-farm-green-700 text-white font-medium shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />{" "}
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
