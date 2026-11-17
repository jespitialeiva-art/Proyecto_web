
const BASE_URL = "https://api.unsplash.com";

// Obtener la Access Key desde el archivo .env
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Verificación segura: nunca mostrar la clave completa
console.log("Unsplash configurado:", Boolean(ACCESS_KEY));
console.log("Modo de Vite:", import.meta.env.MODE);

// Función general para consultar Unsplash
async function requestUnsplash(endpoint, options = {}) {
  if (!ACCESS_KEY || !ACCESS_KEY.trim()) {
    throw new Error(
      "Falta configurar la clave de Unsplash. " +
      "Verifica el archivo .env y reinicia Vite."
    );
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY.trim()}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "La Access Key de Unsplash no es válida. " +
          "Comprueba que utilizas la Access Key y no la Secret Key."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Unsplash rechazó el acceso. " +
          "Revisa los permisos y el estado de tu aplicación."
        );
      }

      if (response.status === 429) {
        throw new Error(
          "Has alcanzado el límite de solicitudes de Unsplash. " +
          "Espera un momento antes de volver a intentarlo."
        );
      }

      throw new Error(
        `Error al consultar Unsplash: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con Unsplash. " +
        "Comprueba tu conexión a Internet."
      );
    }

    throw error;
  }
}

// PASO 1: Buscar fotografías
export async function searchPhotos(query = "nature", signal) {
  const params = new URLSearchParams({
    query: query.trim() || "nature",
    per_page: "12",
    page: "1",
  });

  const data = await requestUnsplash(
    `/search/photos?${params.toString()}`,
    { signal }
  );

  return data.results || [];
}

// PASO 2: Obtener detalles y coordenadas
export async function getPhotoDetails(photoId) {
  if (!photoId) {
    throw new Error("No se proporcionó el ID de la fotografía.");
  }

  const data = await requestUnsplash(
    `/photos/${encodeURIComponent(photoId)}`
  );

  return data;
}

// PASO 3: Obtener enlace de descarga
export async function getDownloadUrl(photo) {
  const downloadLocation = photo?.links?.download_location;

  if (!downloadLocation) {
    throw new Error(
      "No se encontró el enlace de descarga de la fotografía."
    );
  }

  const url = new URL(downloadLocation);

  // Verificar que el enlace pertenece a la API de Unsplash
  if (url.origin !== BASE_URL) {
    throw new Error("El enlace de descarga no es válido.");
  }

  const data = await requestUnsplash(
    `${url.pathname}${url.search}`
  );

  if (!data.url) {
    throw new Error(
      "Unsplash no devolvió una URL de descarga."
    );
  }

  return data.url;
}
