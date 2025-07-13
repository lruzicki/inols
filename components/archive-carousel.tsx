"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
// import { useTranslation } from "next-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, Users } from "lucide-react"

interface ArchiveEvent {
  id: number
  title: string
  date: string
  participants: number
  image: string
  driveUrl: string
  description: string
}

export default function ArchiveCarousel() {
  // const { t } = useTranslation("common")
  const t = (key: string) => {
    const translations: { [key: string]: string } = {
      "archive.loading": "Ładowanie archiwum...",
      "archive.noEvents": "Brak wydarzeń w archiwum",
      "archive.people": "osób",
      "archive.viewPhotos": "Zobacz zdjęcia",
      "archive.pastEvents": "Przeszłe wydarzenia",
      "archive.totalParticipants": "Łącznie uczestników",
      "archive.yearsOfAdventures": "lata przygód"
    }
    return translations[key] || key
  }
  const [currentIndex, setCurrentIndex] = useState(0)
  const [archiveEvents, setArchiveEvents] = useState<ArchiveEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArchiveData = async () => {
      try {
        // Twoje linki do Google Drive z obrazkami z podglądu
        const archiveEvents = [
          {
            id: 1,
            title: "INO 2023",
            date: "2023",
            participants: 45,
            image: "/data/chaszcze2023.jpg",
            driveUrl: "https://drive.google.com/drive/folders/1DCUr5Wi3iMsVmTTRVrzDFli7vnFnrhsZ",
            description: "Wiosenne wydarzenie orienteeringowe z mapami i kompasami"
          },
          {
            id: 2,
            title: "INO 2023 - Jesień",
            date: "2022",
            participants: 38,
            image: "/data/chaszcze2022.png",
            driveUrl: "https://drive.google.com/drive/folders/1_vwRx8LG_pYqaUNXQ7jnnVDUkepBlGg5",
            description: "Jesienne przygody w terenie z orientacją"
          },
          {
            id: 3,
            title: "INO 2021",
            date: "2021",
            participants: 52,
            image: "/data/chaszcze2021.png",
            driveUrl: "https://drive.google.com/drive/folders/1YSa4LhyKBORFEhr7qBy84n8MEv7IAZya",
            description: "Letnie wydarzenie z mapami i punktami kontrolnymi"
          },
          {
            id: 4,
            title: "INO 2020",
            date: "Marzec 2020",
            participants: 41,
            image: "/data/chaszcze2020.png",
            driveUrl: "https://drive.google.com/drive/folders/14_oY8JPUtFSNsEwsVNjictI5RYlEqmYg",
            description: "Wiosenne zawody orienteeringowe"
          }
        ]

        setArchiveEvents(archiveEvents)
      } catch (error) {
        console.error("Error loading archive data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadArchiveData()
  }, [])

  // Responsive items per view
  const [itemsPerView, setItemsPerView] = useState(3)
  
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) { // mobile
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) { // tablet
        setItemsPerView(2)
      } else { // desktop
        setItemsPerView(3)
      }
    }
    
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])
  
  const maxIndex = Math.max(0, archiveEvents.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleImageClick = (driveUrl: string) => {
    window.open(driveUrl, "_blank", "noopener,noreferrer")
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t("archive.loading")}</p>
      </div>
    )
  }

  if (archiveEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t("archive.noEvents")}</p>
      </div>
    )
  }

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {archiveEvents.map((event) => (
            <div 
              key={event.id} 
              className={`flex-shrink-0 px-3 ${
                itemsPerView === 1 ? 'w-full' : 
                itemsPerView === 2 ? 'w-1/2' : 
                'w-1/3'
              }`}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <div className="relative h-64 overflow-hidden" onClick={() => handleImageClick(event.driveUrl)}>
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-2">
                      <ExternalLink className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <Badge className="bg-green-600 text-white mb-2">{event.date}</Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.participants} {t("archive.people")}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 bg-transparent group-hover:bg-green-50 group-hover:border-green-200"
                    onClick={() => handleImageClick(event.driveUrl)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t("archive.viewPhotos")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {archiveEvents.length > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:bg-gray-50"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:bg-gray-50"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-green-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Archive Stats */}
      <div className="mt-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{archiveEvents.length}</div>
            <div className="text-gray-600">{t("archive.pastEvents")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {archiveEvents.reduce((sum, event) => sum + event.participants, 0)}
            </div>
            <div className="text-gray-600">{t("archive.totalParticipants")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">2</div>
            <div className="text-gray-600">{t("archive.yearsOfAdventures")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
