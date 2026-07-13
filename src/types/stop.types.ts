export interface Stop {
  stopId: number;
  agencyId: number;
  stopName: string;
  stopLat: number;
  stopLong: number;
}

export interface CreateStopPayload {
  stopName: string;
  stopLat: number;
  stopLong: number;
  agencyId: number;
}

export interface UpdateStopPayload {
  stopName: string;
  stopLat: number;
  stopLong: number;
}
