/* Retire the Gatsby offline worker for returning visitors. */
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => /^(gatsby|workbox-precache)/.test(key))
          .map((key) => caches.delete(key))
      )
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: "window" })
      await Promise.all(clients.map((client) => client.navigate(client.url)))
    })()
  )
})
