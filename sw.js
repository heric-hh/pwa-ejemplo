// Plantilla de service worker para una PWA.

/*
Esta variable almacena el nombre del cache que se utilizara 
para almacenar los archivos de la PWA.
*/
const CACHE_NAME = "mi-pwa-cache-v1";

/*
Esta variable es un array que contiene las rutas de los archivos que se van a almacenar en el cache.
Se han actualizado las rutas para funcionar correctamente con GitHub Pages.
*/
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/favicon/icon-192x192.png",
  "./icons/favicon/icon-512x512.png",
  "./offline.html",
];

/* 2. INSTALL -> El evento que se ejecuta al instalar el service worker.
Este evento se dispara cuando se instala el service worker. En este caso, se abre el cache 
especificado por CACHE_NAME y se agregar todos los archivos de urlsToCache al cache usando
cache.addAll(urlsToCache).
*/
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

/**
 * Este evento se dispara cuando se activa el service worker.
 * En este caso, se eliminan todos los caches que no sean el especificado por CACHE_NAME
 * utilizando caches.delete(key)
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

/**
 * Este evento se dispara cuando se realiza una solicitud a la PWA.
 * En este caso, se intenta recuperar el archivo del cache utilizando caches.match(event.request).
 *  Si no se encuentra en el cache, se realiza la solicitud normalmente utilizando
 *  fetch(event.request). Si la solicitud falla, se muestra el archivo "offline.html" del cache.
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("offline.html"))
      );
    })
  );
});

/**
 * Este evento se dispara cuando se recibe una notificación push.
 * En este caso, se muestra una notificación con el título "Mi PWA"
 * y el cuerpo del mensaje de la notificación utilizando
 * self.registration.showNotification("Mi PWA", { body: data })
 */
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Notificacion sin datos";
  event.waitUntil(self.registration.showNotification("Mi PWA", { body: data }));
});
