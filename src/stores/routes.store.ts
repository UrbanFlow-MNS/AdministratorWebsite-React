import { action, makeObservable, observable, runInAction } from 'mobx';
import { routesApi } from '../api/routes.api';
import type { CompleteRoute, CreateRoutePayload, Route, UpdateRoutePayload } from '../types/route.types';

class RoutesStore {
  routes: Route[] = [];
  selectedRoute: CompleteRoute[] | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      routes: observable,
      selectedRoute: observable,
      loading: observable,
      error: observable,
      fetchAll: action,
      fetchDetails: action,
      create: action,
      update: action,
      remove: action,
      setSelectedRoute: action,
    });
  }

  async fetchAll() {
    this.loading = true;
    this.error = null;
    try {
      const data = await routesApi.getAll();
      runInAction(() => {
        this.routes = data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Impossible de charger les lignes.';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchDetails(id: number) {
    this.loading = true;
    try {
      const data = await routesApi.getDetails(id);
      runInAction(() => {
        this.selectedRoute = data;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async create(payload: CreateRoutePayload) {
    await routesApi.create(payload);
    await this.fetchAll();
  }

  async update(id: number, payload: UpdateRoutePayload) {
    await routesApi.update(id, payload);
    await this.fetchAll();
  }

  async remove(id: number) {
    await routesApi.delete(id);
    runInAction(() => {
      this.routes = this.routes.filter((r) => r.routeId !== id);
    });
  }

  setSelectedRoute(route: CompleteRoute[] | null) {
    this.selectedRoute = route;
  }
}

export const routesStore = new RoutesStore();
