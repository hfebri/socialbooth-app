"use client"

import { useEffect, useState } from "react"

type Orientation = "portrait" | "landscape"

const DEFAULT_ORIENTATION: Orientation = "portrait"

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>(DEFAULT_ORIENTATION)

  useEffect(() => {
    if (typeof window === "undefined") return

    const query = window.matchMedia("(orientation: portrait)")

    const update = () => {
      setOrientation(query.matches ? "portrait" : "landscape")
    }

    update()

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update)
      return () => query.removeEventListener("change", update)
    }

    // Safari iOS fallback
    query.addListener(update)
    return () => query.removeListener(update)
  }, [])

  return orientation
}
