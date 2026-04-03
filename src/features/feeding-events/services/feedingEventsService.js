import { feedingService } from "@shared/services/feedingService";

export const feedingEventsService = {
  getEventsByFarm: async (farmId) => {
    try {
      return await feedingService.getEventsByFarm(farmId);
    } catch (error) {
      console.error("Error fetching feeding events:", error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      return await feedingService.createFeedingEvent(eventData);
    } catch (error) {
      console.error("Error creating feeding event:", error);
      throw error;
    }
  },

  cancelEvent: async (id) => {
    try {
      return await feedingService.cancelEvent(id);
    } catch (error) {
      console.error("Error cancelling feeding event:", error);
      throw error;
    }
  },
};
