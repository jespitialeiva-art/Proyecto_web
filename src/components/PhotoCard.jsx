
export default function PhotoCard({
  photo,
  onLocation,
  onDownload,
  downloading,
}) {
  return (
    <article
      className="overflow-hidden rounded-2xl bg-white
                 shadow-sm transition hover:shadow-xl"
    >
      <img
        src={photo.urls.regular}
        alt={photo.alt_description || "Fotografía de Unsplash"}
        loading="lazy"
        className="h-64 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <img
            src={photo.user.profile_image?.small}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {photo.user.name}
            </p>

            <a
              href={`${photo.user.links.html}?utm_source=stock_photo_app&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:underline"
            >
              Ver fotógrafo en Unsplash
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onDownload(photo)}
            disabled={downloading}
            className="flex-1 rounded-lg bg-blue-600
                       px-3 py-2 text-sm font-medium
                       text-white hover:bg-blue-700
                       disabled:opacity-50"
          >
            {downloading ? "Preparando..." : "Descargar gratis"}
          </button>

          <button
            type="button"
            onClick={() => onLocation(photo)}
            className="flex-1 rounded-lg border
                       border-gray-300 px-3 py-2
                       text-sm font-medium text-gray-700
                       hover:bg-gray-100"
          >
            Ver ubicación
          </button>
        </div>
      </div>
    </article>
  );
}