import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import type { Stop } from '../../types/stop.types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const primaryIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const newPinIcon = new L.DivIcon({
  html: `<div style="
    width:32px;height:32px;background:#6912E2;border:3px solid #fff;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);box-shadow:0 2px 8px rgba(105,18,226,0.4)
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  className: '',
});

interface ClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

function ClickHandler({ onMapClick }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface StopsMapProps {
  stops?: Stop[];
  pendingPin?: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  onStopClick?: (stop: Stop) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function StopsMap({
  stops = [],
  pendingPin,
  onMapClick,
  onStopClick,
  center = [48.8566, 2.3522],
  zoom = 13,
  className = '',
}: StopsMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (pendingPin && mapRef.current) {
      mapRef.current.flyTo([pendingPin.lat, pendingPin.lng], Math.max(mapRef.current.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [pendingPin]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      ref={mapRef}
      className={['w-full h-full rounded-[0.875rem] z-0', className].join(' ')}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {onMapClick && <ClickHandler onMapClick={onMapClick} />}

      {stops.map((stop) => (
        <Marker
          key={stop.stopId}
          position={[stop.stopLat, stop.stopLong]}
          icon={primaryIcon}
          eventHandlers={{ click: () => onStopClick?.(stop) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-[#0A0A0A]">{stop.stopName}</p>
              <p className="text-[#AEAEB2] text-xs mt-1">
                {stop.stopLat.toFixed(6)}, {stop.stopLong.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {pendingPin && (
        <Marker position={[pendingPin.lat, pendingPin.lng]} icon={newPinIcon}>
          <Popup>
            <p className="text-sm font-medium text-[#6912E2]">Nouvel arrêt</p>
            <p className="text-xs text-[#6E6E73]">
              {pendingPin.lat.toFixed(6)}, {pendingPin.lng.toFixed(6)}
            </p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
