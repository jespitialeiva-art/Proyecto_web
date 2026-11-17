
import PhotoCard from "./PhotoCard";

export default function PhotoGallery({
  photos,
  loading,
  onLocation,
  onDownload,
  downloadingId,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden
                       rounded-2xl bg-white shadow-sm"
          >
            <div className="h-64 bg-gray-200" />
            <div className="space-y-4 p-5">
              <div className="h-5 w-2/3 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <p className="py-16 text-center text-gray-500">
        No se encontraron fotografías para esta búsqueda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onLocation={onLocation}
          onDownload={onDownload}
          downloading={downloadingId === photo.id}
        />
      ))}
    </div>
  );
}