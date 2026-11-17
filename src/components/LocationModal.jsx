
import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DEFAULT_LOCATION = {
  lat: 4.711,
  lng: -74.0721,
};

if (GOOGLE_MAPS_KEY) {
  setOptions({
    key: GOOGLE_MAPS_KEY,
    v: "weekly",
  });
}

function GoogleMap({ latitude, longitude }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [mapError, setMapError] = useState("");
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!GOOGLE_MAPS_KEY) {
        setMapError("Falta configurar la clave de Google Maps.");
        setMapLoading(false);
        return;
      }

      setMapLoading(true);
      setMapError("");

      try {
        const { Map } = await importLibrary("maps");
        const { Marker } = await importLibrary("marker");

        if (cancelled || !mapRef.current) return;

        const center = {
          lat: latitude,
          lng: longitude,
        };

        const map = new Map(mapRef.current, {
          center,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        const marker = new Marker({
          position: center,
          map,
          title: "Ubicación de la fotografía",
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        setMapLoading(false);
      } catch (error) {
        if (!cancelled) {
          console.error("Error al cargar Google Maps:", error);

          setMapError(
            "No se pudo cargar Google Maps. Revisa que Maps JavaScript API esté habilitada."
          );

          setMapLoading(false);
        }
      }
    }

    initializeMap();

    return () => {
      cancelled = true;

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl">
      <div ref={mapRef} className="h-full w-full" />

      {mapLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-gray-600">
            Cargando mapa...
          </span>
        </div>
      )}

      {mapError && (
        <div
          role="alert"
          className="absolute inset-0 flex items-center justify-center bg-red-50 p-6 text-center text-red-700"
        >
          {mapError}
        </div>
      )}
    </div>
  );
}

export default function LocationModal({
  photo,
  details,
  loading,
  error,
  onClose,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!photo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [photo]);

  if (!photo) return null;

  const location = details?.location;

  const lat = location?.position?.latitude;
  const lng = location?.position?.longitude;

  const hasCoordinates =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng);

  const center = hasCoordinates
    ? { lat, lng }
    : DEFAULT_LOCATION;

  const locationName = [
    location?.city,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const placeName =
    locationName ||
    location?.name ||
    "Ubicación no especificada";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-title"
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2
              id="location-title"
              className="text-xl font-bold text-gray-900"
            >
              Ubicación de la fotografía
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {loading ? "Consultando ubicación..." : placeName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg px-3 py-2 text-2xl text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex h-80 items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <span className="text-gray-600">
                Consultando coordenadas...
              </span>
            </div>
          ) : (
            <>
              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {!error && !hasCoordinates && (
                <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  Ubicación exacta no especificada por el fotógrafo.
                  El mapa muestra Bogotá, Colombia, como referencia.
                </p>
              )}

              <GoogleMap
                latitude={center.lat}
                longitude={center.lng}
              />

              {hasCoordinates && (
                <p className="mt-3 text-sm text-gray-500">
                  Coordenadas: {lat.toFixed(5)}, {lng.toFixed(5)}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
