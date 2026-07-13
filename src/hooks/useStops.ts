import { useEffect } from 'react';
import { stopsStore } from '../stores/stops.store';

export function useStops() {
  useEffect(() => {
    stopsStore.fetchAll();
  }, []);

  return stopsStore;
}
