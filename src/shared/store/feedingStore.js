import { create } from "zustand";

export const useFeedingStore = create((set) => ({
  schedules: [],
  plans: [
    {
      id: "1",
      name: "Plan Bovino Adulto - Alta Producción",
      animalType: "Bovino",
      ageGroup: "Adulto",
      feedsPerDay: 3,
      totalDaily: "25 kg",
      cost: "$45.00",
      animalsAssigned: 42,
      status: "Activo",
    },
    {
      id: "2",
      name: "Plan Terneros - Crecimiento",
      animalType: "Bovino",
      ageGroup: "Cría",
      feedsPerDay: 4,
      totalDaily: "8 kg",
      cost: "$18.00",
      animalsAssigned: 18,
      status: "Activo",
    },
    {
      id: "3",
      name: "Plan Porcino - Engorde",
      animalType: "Porcino",
      ageGroup: "Adulto",
      feedsPerDay: 3,
      totalDaily: "4 kg",
      cost: "$12.00",
      animalsAssigned: 35,
      status: "Activo",
    },
    {
      id: "4",
      name: "Plan Ovino - Mantenimiento",
      animalType: "Ovino",
      ageGroup: "Adulto",
      feedsPerDay: 2,
      totalDaily: "2 kg",
      cost: "$5.00",
      animalsAssigned: 25,
      status: "Inactivo",
    },
  ],
  loading: false,

  setSchedules: (schedules) => set({ schedules }),
  setPlans: (plans) => set({ plans }),
  addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
  updatePlan: (updatedPlan) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p
      ),
    })),
  deletePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}));
