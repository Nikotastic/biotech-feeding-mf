import apiService from "@shared-services/ApiService";

export const feedingService = {
  // Create a new feeding event (Record feeding)
  createFeedingEvent: async (eventData) => {
    try {
      const response = await apiService.post("/v1/FeedingEvents", eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating feeding event:", error);
      throw error;
    }
  },

  // GET /api/v1/FeedingEvents/{id} - Get feeding event by ID
  getEventById: async (id) => {
    try {
      const response = await apiService.get(`/v1/FeedingEvents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feeding event ${id}:`, error);
      throw error;
    }
  },

  // Get feeding events by Farm ID
  getEventsByFarm: async (farmId) => {
    try {
      const response = await apiService.get(`/v1/FeedingEvents/farm/${farmId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching feeding events for farm ${farmId}:`, error);
      throw error;
    }
  },

  // Get feeding events by Batch ID
  getEventsByBatch: async (batchId) => {
    try {
      const response = await apiService.get(
        `/v1/FeedingEvents/batch/${batchId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching feeding events for batch ${batchId}:`,
        error
      );
      throw error;
    }
  },

  // Get feeding events by Product ID
  getEventsByProduct: async (productId) => {
    try {
      const response = await apiService.get(
        `/v1/FeedingEvents/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching feeding events for product ${productId}:`,
        error
      );
      throw error;
    }
  },

  // Get feeding events by Animal ID
  getEventsByAnimal: async (animalId) => {
    try {
      const response = await apiService.get(
        `/v1/FeedingEvents/animal/${animalId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching feeding consumption (events) for animal ${animalId}:`,
        error
      );
      throw error;
    }
  },

  // Recalculate total costs
  recalculateCost: async (data) => {
    try {
      const response = await apiService.post(
        "/v1/FeedingEvents/recalculate-cost",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error recalculating cost:", error);
      throw error;
    }
  },

  // Cancel (soft delete) a feeding event
  cancelEvent: async (id) => {
    try {
      const response = await apiService.put(`/v1/FeedingEvents/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling feeding event ${id}:`, error);
      throw error;
    }
  },

  // Helper alias to match legacy calls if needed (though UI should be updated)
  recordFeeding: async (data) => {
    return await feedingService.createFeedingEvent(data);
  },
};

export default feedingService;
