"use client"

import { useEffect, useRef } from "react"
// import { useTranslation } from "next-i18next"

interface EventMapProps {
  coordinates: {
    lat: number
    lng: number
  }
  locationName: string
}

export default function EventMap({ coordinates, locationName }: EventMapProps) {
  // const { t } = useTranslation("common")
  const t = (key: string) => {
    const translations: { [key: string]: string } = {
      "common.clickToZoom": "Kliknij aby przybliżyć"
    }
    return translations[key] || key
  }
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return

      try {
        // Dynamically import Leaflet
        const L = (await import("leaflet")).default

        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        // Clean up existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        // Create map
        const map = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 15)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Create custom icon
        const customIcon = L.divIcon({
          html: `
            <div style="
              background-color: #16a34a;
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                color: white;
                font-size: 12px;
                font-weight: bold;
                transform: rotate(45deg);
              ">📍</div>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })

        // Add marker
        const marker = L.marker([coordinates.lat, coordinates.lng], { icon: customIcon }).addTo(map)

        // Add popup
        marker.bindPopup(`
          <div style="text-align: center; padding: 5px;">
            <strong>${locationName}</strong><br>
            <small>Event Starting Point</small>
          </div>
        `)

        mapInstanceRef.current = map

        // Disable scroll zoom initially
        map.scrollWheelZoom.disable()

        // Enable scroll zoom on click
        map.on("click", () => {
          map.scrollWheelZoom.enable()
        })

        // Disable scroll zoom when mouse leaves
        map.on("mouseout", () => {
          map.scrollWheelZoom.disable()
        })
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [coordinates, locationName])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-64 w-full rounded-t-lg" />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600">
        {t("common.clickToZoom")}
      </div>
    </div>
  )
}
