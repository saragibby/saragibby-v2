"use client"

import { useEffect } from "react"

export function RetireOfflineWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      for (const registration of registrations) {
        const worker = registration.active ?? registration.waiting ?? registration.installing
        if (worker && new URL(worker.scriptURL).pathname === "/sw.js") {
          await registration.update()
        }
      }
    }).catch((error: unknown) => {
      console.error("Could not check the retired offline worker.", error)
    })
  }, [])

  return null
}
