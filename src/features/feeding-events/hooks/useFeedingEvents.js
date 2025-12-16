import { useState, useEffect } from "react";
import { feedingEventsService } from "../services/feedingEventsService";
import { useFeedingStore } from "../../../shared/store/feedingStore"; // Assuming we might store some global state here, or just use local

export function useFeedingEvents(farmId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    if (!farmId) return;
    setLoading(true);
    try {
      const data = await feedingEventsService.getEventsByFarm(farmId);
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los registros de alimentación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [farmId]);

  return { events, loading, error, refetch: fetchEvents };
}
