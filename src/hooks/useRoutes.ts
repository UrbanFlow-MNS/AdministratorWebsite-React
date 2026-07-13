import { useEffect } from 'react';
import { routesStore } from '../stores/routes.store';

export function useRoutes() {
  useEffect(() => {
    routesStore.fetchAll();
  }, []);

  return routesStore;
}
