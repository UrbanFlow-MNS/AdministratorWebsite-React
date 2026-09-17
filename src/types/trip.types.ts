export interface CreateStopTripPayload {
  tripId: number;
  arrivalTime: string;
  departureTime?: string;
  stopId: number;
  stopSequence: number;
}

export interface CreateTripPayload {
  routeId: number;
  serviceId: number;
  tripHeadsign?: string;
  createStopTrips: CreateStopTripPayload[];
}

export interface UpdateHourlyPayload {
  arrivalTime: string;
  departureTime?: string;
}

export interface UpdateServicePayload {
  serviceId: number;
}
