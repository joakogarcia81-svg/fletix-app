'use client';

import * as React from 'react';
import Map, { Marker, Popup, Source, Layer, useMap, type ViewState } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TrackedTrip, ARGENTINA_CENTER, DEFAULT_ZOOM, FOCUSED_ZOOM, TRACKING_STATUS_COLORS } from '@/types/tracking';

interface TrackingMapProps {
  trips: TrackedTrip[];
  selectedTrip: TrackedTrip | null;
  onSelectTrip: (trip: TrackedTrip) => void;
}

// ── Map Controller (smooth fly-to on selection) ──
function MapController({ selectedTrip }: { selectedTrip: TrackedTrip | null }) {
  const { current: map } = useMap();

  React.useEffect(() => {
    if (selectedTrip?.location && map) {
      map.flyTo({
        center: [selectedTrip.location.longitude, selectedTrip.location.latitude],
        zoom: FOCUSED_ZOOM,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedTrip, map]);

  return null;
}

export function TrackingMap({ trips, selectedTrip, onSelectTrip }: TrackingMapProps) {
  const [viewState, setViewState] = React.useState<Partial<ViewState>>({
    longitude: ARGENTINA_CENTER.lng,
    latitude: ARGENTINA_CENTER.lat,
    zoom: DEFAULT_ZOOM,
    pitch: 45,
    bearing: 0,
  });

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-neutral-800">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        attributionControl={{compact: true}}
        interactive={true}
        dragRotate={true}
        pitchWithRotate={true}
      >
        <MapController selectedTrip={selectedTrip} />

        {/* Truck Markers */}
        {trips
          .filter((t) => t.location)
          .map((trip) => {
            const isMoving = trip.status === 'EN_RUTA';
            const color = TRACKING_STATUS_COLORS[trip.status] || '#6b7280';
            const isSelected = selectedTrip?.id === trip.id;

            return (
              <Marker
                key={trip.id}
                longitude={trip.location!.longitude}
                latitude={trip.location!.latitude}
                anchor="center"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  onSelectTrip(trip);
                }}
                style={{ cursor: 'pointer', zIndex: isSelected ? 10 : 1 }}
              >
                <div className="relative flex items-center justify-center">
                  {isMoving && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: color, transform: 'scale(2)' }}
                    />
                  )}
                  <div 
                    className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: color, 
                      border: '2px solid white',
                      boxShadow: isSelected ? `0 0 0 4px ${color}40` : 'none'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                </div>
              </Marker>
            );
          })}

        {/* Selected Trip Info Window */}
        {selectedTrip?.location && (
          <Popup
            longitude={selectedTrip.location.longitude}
            latitude={selectedTrip.location.latitude}
            anchor="bottom"
            offset={24}
            closeButton={false}
            closeOnClick={false}
            className="tracking-popup"
          >
            <div className="min-w-[200px] p-2 bg-neutral-900 rounded-xl border border-neutral-800 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-300">{selectedTrip.tripId}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: TRACKING_STATUS_COLORS[selectedTrip.status],
                    backgroundColor: `${TRACKING_STATUS_COLORS[selectedTrip.status]}20`,
                  }}
                >
                  {selectedTrip.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm font-semibold text-white mb-1">{selectedTrip.driverName}</p>
              <p className="text-xs text-neutral-400">
                {selectedTrip.truckPatent} · {selectedTrip.truckType}
              </p>
              {selectedTrip.location?.speed != null && (
                <p className="text-xs text-emerald-400 font-medium mt-1">{selectedTrip.location.speed} km/h</p>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Global styles for popup to ensure dark mode looks great */}
      <style dangerouslySetInnerHTML={{__html: `
        .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .maplibregl-popup-tip {
          border-top-color: #171717 !important;
        }
        .maplibregl-ctrl-attrib {
          background-color: rgba(0,0,0,0.5) !important;
          color: #fff !important;
        }
        .maplibregl-ctrl-attrib a {
          color: #60a5fa !important;
        }
      `}} />

      {/* Connection Status Indicator */}
      <div className="absolute top-4 left-4 z-[10] flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full px-3 py-1.5 shadow-lg">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
          En vivo
        </span>
      </div>
    </div>
  );
}
