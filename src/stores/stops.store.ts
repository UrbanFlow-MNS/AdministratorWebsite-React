import { action, makeObservable, observable, runInAction } from 'mobx';
import { stopsApi } from '../api/stops.api';
import type { CreateStopPayload, Stop, UpdateStopPayload } from '../types/stop.types';

class StopsStore {
  stops: Stop[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      stops: observable,
      loading: observable,
      error: observable,
      fetchAll: action,
      create: action,
      update: action,
      remove: action,
    });
  }

  async fetchAll() {
    this.loading = true;
    this.error = null;
    try {
      const data = await stopsApi.getAll();
      runInAction(() => {
        this.stops = data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Impossible de charger les arrêts.';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async create(payload: CreateStopPayload) {
    await stopsApi.create(payload);
    await this.fetchAll();
  }

  async update(id: number, payload: UpdateStopPayload) {
    await stopsApi.update(id, payload);
    await this.fetchAll();
  }

  async remove(id: number) {
    await stopsApi.delete(id);
    runInAction(() => {
      this.stops = this.stops.filter((s) => s.stopId !== id);
    });
  }
}

export const stopsStore = new StopsStore();
