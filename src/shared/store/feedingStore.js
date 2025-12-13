import { create } from 'zustand'

export const useFeedingStore = create((set) => ({
  schedules: [],
  plans: [],
  loading: false,
  
  setSchedules: (schedules) => set({ schedules }),
  setPlans: (plans) => set({ plans }),
  setLoading: (loading) => set({ loading })
}))