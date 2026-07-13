export interface Route {
  routeId: number;
  agencyId: number;
  routeTypeName: string;
  routeShortName: string;
  routeLongName: string;
}

export interface RouteStopDetail {
  stopId: number;
  stopName: string;
  longitude: number;
  latitude: number;
  arrivalTime: number;
  sequenceOrder: number;
}

export interface RouteTripDetail {
  tripId: number;
  stops: RouteStopDetail[];
}

export interface CompleteRoute {
  routeId: number;
  routeShortName: string;
  routeLongName: string;
  routeTypeName: string;
  trips: RouteTripDetail[];
}

export interface CreateRoutePayload {
  agencyId: number;
  routeShortName: string;
  routeLongName: string;
  routeTypeId: number;
}

export interface UpdateRoutePayload {
  routeShortName: string;
  routeLongName: string;
  routeTypeId: number;
}

export interface RouteFilters {
  agencyId?: number;
  routeTypeId?: number;
  routeId?: number;
}
