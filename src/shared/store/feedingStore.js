import { create } from "zustand";
import { feedingService } from "@shared/services/feedingService";

/**
 * Feeding Store
 * Manages feeding plans (local CRUD) and feeding events (fetched from backend).
 *
 * Note: The backend only exposes FeedingEvents endpoints.
 * FeedingPlans are managed locally until a plans API is available.
 */
export const useFeedingStore = create((set, get) => ({
  // ── State ──
  plans: [],
  events: [],
  loading: false,
  error: null,

  // ── Feeding Events (Backend) ───────────────────────────────────────────

  /**
   * Fetch all feeding events for a given farm from the backend.
   * @param {string} farmId
   * @param {object} params - optional { fromDate, toDate, page, pageSize }
   */
  fetchEventsByFarm: async (farmId, params = {}) => {
    if (!farmId) return;
    set({ loading: true, error: null });
    try {
      const data = await feedingService.getEventsByFarm(farmId, params);
      // Support both array response and paginated { items: [] } response
      const events = Array.isArray(data)
        ? data
        : (data?.items ?? data?.data ?? []);
      set({ events, loading: false });
    } catch (err) {
      console.error("Error fetching feeding events:", err);
      set({
        error: "Error al cargar los eventos de alimentación.",
        loading: false,
      });
    }
  },

  /**
   * Create a new feeding event and refresh the list.
   */
  createEvent: async (eventData, farmId) => {
    set({ loading: true, error: null });
    try {
      await feedingService.createFeedingEvent(eventData);
      // Refresh the events list after creation
      if (farmId) await get().fetchEventsByFarm(farmId);
      else set({ loading: false });
    } catch (err) {
      console.error("Error creating feeding event:", err);
      set({
        error: "Error al registrar el evento de alimentación.",
        loading: false,
      });
      throw err;
    }
  },

  /**
   * Cancel a feeding event by ID and remove it from the local state.
   */
  cancelEvent: async (id, farmId) => {
    set({ loading: true, error: null });
    try {
      await feedingService.cancelEvent(id);
      if (farmId) await get().fetchEventsByFarm(farmId);
      else
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          loading: false,
        }));
    } catch (err) {
      console.error("Error cancelling feeding event:", err);
      set({ error: "Error al cancelar el evento.", loading: false });
      throw err;
    }
  },

  // ── Feeding Plans (Local CRUD — no backend endpoint yet) ──────────────

  /**
   * Add a new plan locally.
   */
  addPlan: (plan) =>
    set((state) => ({
      plans: [
        ...state.plans,
        { ...plan, id: plan.id ?? Date.now().toString() },
      ],
    })),

  /**
   * Update an existing plan locally.
   */
  updatePlan: (updatedPlan) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === updatedPlan.id ? { ...p, ...updatedPlan } : p,
      ),
    })),

  /**
   * Delete a plan locally.
   */
  deletePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
    })),

  // ── Misc ──────────────────────────────────────────────────────────────
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),
}));
