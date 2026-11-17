
import { useState, useEffect } from "react";

import SearchBar from "./components/SearchBar";
import CategoryFilters from "./components/CategoryFilters";
import PhotoGallery from "./components/PhotoGallery";
import LocationModal from "./components/LocationModal";

import {
  searchPhotos,
  getPhotoDetails,
  getDownloadUrl,
} from "./services/unsplashService";

export default function App() {
  const [query, setQuery] = useState("nature");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoDetails, setPhotoDetails] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  const [downloadingId, setDownloadingId] = useState(null);

  // Buscar fotografías al iniciar o cambiar término
  useEffect(() => {
    const controller = new AbortController();

    async function loadPhotos() {
      setLoading(true);
      setError("");
      setPhotos([]);

      try {
        const results = await searchPhotos(
          query,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setPhotos(results);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPhotos();

    return () => controller.abort();
  }, [query]);

  // Consultar detalles de una fotografía
  useEffect(() => {
    if (!selectedPhoto) return;

    let cancelled = false;

    async function loadDetails() {
      setMapLoading(true);
      setMapError("");
      setPhotoDetails(null);

      try {
        const details = await getPhotoDetails(selectedPhoto.id);

        if (!cancelled) {
          setPhotoDetails(details);
        }
      } catch (err) {
        if (!cancelled) {
          setMapError(err.message);
        }
      } finally {
        if (!cancelled) {
          setMapLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedPhoto]);

  function handleSearch(term) {
    setQuery(term);
  }

  function handleOpenLocation(photo) {
    setSelectedPhoto(photo);
  }

  function handleCloseLocation() {
    setSelectedPhoto(null);
    setPhotoDetails(null);
    setMapError("");
  }

  async function handleDownload(photo) {
    setDownloadingId(photo.id);

    try {
      const url = await getDownloadUrl(photo);

      // Abrir el enlace de descarga proporcionado por Unsplash
      window.location.assign(url);
    } catch (err) {
      window.alert(err.message);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-950 px-5 py-14 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 text-sm font-semibold
                          uppercase tracking-widest text-blue-400">
            StockPhoto Explorer
          </div>

          <h1 className="mb-4 text-3xl font-bold sm:text-5xl">
            Descubre imágenes increíbles
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-gray-300">
            Explora fotografías gratuitas, conoce a sus
            autores y descubre dónde fueron capturadas.
          </p>

          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <CategoryFilters
          activeCategory={query}
          onSelect={handleSearch}
        />

        <div className="mb-7 mt-12 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Resultados: {query}
          </h2>

          {!loading && !error && (
            <span className="text-sm text-gray-500">
              {photos.length} fotografías
            </span>
          )}
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200
                       bg-red-50 p-5 text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setQuery(`${query} `)}
              className="mt-3 font-semibold underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <PhotoGallery
            photos={photos}
            loading={loading}
            onLocation={handleOpenLocation}
            onDownload={handleDownload}
            downloadingId={downloadingId}
          />
        )}
      </main>

      <footer className="mt-16 bg-slate-950 p-8 text-center
                         text-sm text-gray-400">
        Fotografías proporcionadas por{" "}
        <a
          href="https://unsplash.com/?utm_source=stock_photo_app&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline"
        >
          Unsplash
        </a>
        {" "}· Mapas de Google Maps
      </footer>

      <LocationModal
        photo={selectedPhoto}
        details={photoDetails}
        loading={mapLoading}
        error={mapError}
        onClose={handleCloseLocation}
      />
    </div>
  );
}