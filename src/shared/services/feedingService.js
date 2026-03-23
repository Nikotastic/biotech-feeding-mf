import apiClient from "@shared/utils/apiClient";

/**
 * Feeding Service
 * Handles all feeding-related API calls against the backend.
 *
 * Base path: /api/v1/FeedingEvents
 */
export const feedingService = {
  // ── POST /api/v1/feeding-events ─────────────────────────────────────────
  // Create a new feeding event
  createFeedingEvent: async (eventData) => {
    const response = await apiClient.post("/v1/feeding-events", eventData);
    return response.data;
  },

  // ── GET /api/v1/feeding-events/{id} ─────────────────────────────────────
  // Get a single feeding event by its ID
  getEventById: async (id) => {
    const response = await apiClient.get(`/v1/feeding-events/${id}`);
    return response.data;
  },

  // ── GET /api/v1/feeding-events/farm/{farmId} ────────────────────────────
  // Get feeding events for a specific farm.
  // Optional query params: fromDate, toDate, page, pageSize
  getEventsByFarm: async (farmId, params = {}) => {
    const query = new URLSearchParams();
    if (params.fromDate) query.append("fromDate", params.fromDate);
    if (params.toDate) query.append("toDate", params.toDate);
    if (params.page) query.append("page", params.page);
    if (params.pageSize) query.append("pageSize", params.pageSize);

    const qs = query.toString();
    const response = await apiClient.get(
      `/v1/feeding-events/farm/${farmId}${qs ? `?${qs}` : ""}`,
    );
    return response.data;
  },

  // ── GET /api/v1/feeding-events/batch/{batchId} ──────────────────────────
  // Get feeding events by batch. Optional query params: page, pageSize
  getEventsByBatch: async (batchId, params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.pageSize) query.append("pageSize", params.pageSize);

    const qs = query.toString();
    const response = await apiClient.get(
      `/v1/feeding-events/batch/${batchId}${qs ? `?${qs}` : ""}`,
    );
    return response.data;
  },

  // ── GET /api/v1/feeding-events/product/{productId} ──────────────────────
  // Get feeding events by product. Optional query params: page, pageSize
  getEventsByProduct: async (productId, params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.pageSize) query.append("pageSize", params.pageSize);

    const qs = query.toString();
    const response = await apiClient.get(
      `/v1/feeding-events/product/${productId}${qs ? `?${qs}` : ""}`,
    );
    return response.data;
  },

  // ── GET /api/v1/feeding-events/animal/{animalId} ────────────────────────
  // Get feeding events by animal. Optional query params: page, pageSize
  getEventsByAnimal: async (animalId, params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.pageSize) query.append("pageSize", params.pageSize);

    const qs = query.toString();
    const response = await apiClient.get(
      `/v1/feeding-events/animal/${animalId}${qs ? `?${qs}` : ""}`,
    );
    return response.data;
  },

  // ── POST /api/v1/feeding-events/recalculate-cost ────────────────────────
  // Trigger a cost recalculation for a set of events
  recalculateCost: async (data) => {
    const response = await apiClient.post(
      "/v1/feeding-events/recalculate-cost",
      data,
    );
    return response.data;
  },

  // ── PUT /api/v1/feeding-events/{id}/cancel ─────────────────────────────
  // Cancel (soft-delete) a specific feeding event
  cancelEvent: async (id) => {
    const response = await apiClient.put(`/v1/feeding-events/${id}/cancel`);
    return response.data;
  },

  // Alias kept for backwards compatibility
  recordFeeding: async (data) => feedingService.createFeedingEvent(data),
};

export default feedingService;
