"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
// import { useTranslation } from "next-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  Compass,
  Mountain,
  Download,
  Facebook,
  Instagram,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Globe,
} from "lucide-react"
import RegistrationButton from "@/components/registration-button"
import ArchiveCarousel from "@/components/archive-carousel"
import EventMap from "@/components/event-map"
import { fetchWithFallback, fallbackEventData, fallbackResultsData } from "@/lib/api-utils"


interface EventData {
  id: number
  name: string
  date: string
  categories: string[]
  location: string
  start_point_url: string
  start_time: string
  fee?: number
  registration_deadline?: string
  registered_participants: number
  google_maps_url?: string
  google_drive_url?: string
  deleted: boolean
  created_at: string
  updated_at: string
}

export default function HomePage() {
  // const { t } = useTranslation("common")
  const t = (key: string) => {
    const translations: { [key: string]: string } = {
      "common.loading": "Ładowanie...",
      "common.error": "Błąd",
      "nav.about": "Wyniki",
      "nav.teams": "Rejestracja", 
      "nav.gallery": "Archiwum",
      "nav.contact": "Kontakt",
      "nav.documents": "Zasady",
      "hero.title": "Impreza na Orientację",
      "hero.subtitle": "NKIH Leśna Szkółka",
      "hero.cta": "Zapisz się",
      "upcomingEvents.title": "Nadchodzące wydarzenia",
      "upcomingEvents.subtitle": "Dołącz do naszych przygód",
      "upcomingEvents.pricing": "Cennik:",
      "upcomingEvents.general": "Ogólny",
      "upcomingEvents.scouts": "Harcerze",
      "upcomingEvents.days": "dni",
      "upcomingEvents.hours": "godziny", 
      "upcomingEvents.minutes": "minuty",
      "upcomingEvents.detailsRegistration": "Szczegóły i rejestracja",
      "registrationSummary.peopleSignedUp": "osób zarejestrowanych",
      "registrationSummary.viewRegistrations": "Zobacz rejestracje",
      "startingInfo.title": "Informacje startowe",
      "startingInfo.subtitle": "Wszystko co musisz wiedzieć",
      "startingInfo.startingLocation": "Lokalizacja startu",
      "startingInfo.dateTime": "Data i czas",
      "rules.title": "Zasady",
      "rules.subtitle": "Poznaj zasady uczestnictwa",
      "rules.competitionRules": "Zasady zawodów",
      "rules.basicRules": "Podstawowe zasady",
      "rules.safetyRequirements": "Wymagania bezpieczeństwa",
      "rules.scoring": "System punktacji",
      "rules.navigationEquipment": "Sprzęt nawigacyjny",
      "rules.navigationDesc": "Mapy, kompasy i urządzenia GPS",
      "rules.checkpointSystem": "System punktów kontrolnych",
      "rules.checkpointDesc": "Znajdź i potwierdź punkty kontrolne",
      "archive.title": "Archiwum wydarzeń",
      "archive.subtitle": "Przeszłe przygody i wspomnienia",
      "registration.title": "Rejestracja",
      "registration.howToRegister": "Jak się zarejestrować?",
      "registration.registerNow": "Zarejestruj się teraz",
      "registration.loginManage": "Zaloguj się / Zarządzaj",
      "results.title": "Wyniki",
      "results.subtitle": "Sprawdź wyniki poprzednich zawodów",
      "results.mostRecent": "Najnowsze",
      "results.downloadResults": "Pobierz wyniki",
      "results.viewParticipants": "Zobacz uczestników",
      "results.resultsPlaceholder": "Wyniki będą dostępne wkrótce",
      "about.title": "O INO",
      "about.subtitle": "Poznaj naszą organizację",
      "about.whatIsIno": "Czym są Chaszcze?",
      "about.whatIsInoDesc": "CHASZCZE to impreza na orientację (InO) organizowana przez “Leśną Szkółkę” nieprzerwanie od 36 lat.",
      "about.howItWorks": "Jak to działa?",
      "about.howItWorksDesc": "Otrzymujesz komplet map oraz kartę startową",
      "about.whyJoin": "Czego potrzebujesz?",
      "about.whyJoinDesc": "Kompas, długopis, naładowany telefon, pozytywne nastawienie :) ",
      "footer.contactUs": "Skontaktuj się z nami",
      "footer.quickLinks": "Szybkie linki",
      "footer.events": "Wydarzenia",
      "footer.results": "Wyniki",
      "footer.about": "Chaszcze",
      "footer.register": "Rejestracja",
      "footer.followUs": "Śledź nas",
      "footer.newsletter": "Newsletter",
      "footer.newsletterDesc": "Bądź na bieżąco z naszymi wydarzeniami",
      "footer.emailPlaceholder": "Twój email",
      "footer.subscribe": "Subskrybuj",
      "footer.copyright": "© 2024 INO. Wszystkie prawa zastrzeżone."
    }
    return translations[key] || key
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const downloadResultsAsCSV = (event: EventData, results: any) => {
    // Przygotuj dane CSV
    let csvContent = "data:text/csv;charset=utf-8,"
    
    // Nagłówek
    csvContent += `Wydarzenie: ${event.name}\n`
    csvContent += `Data: ${event.date}\n`
    csvContent += `Lokalizacja: ${event.location}\n\n`
    
    // Dla każdej kategorii
    Object.entries(results).forEach(([category, categoryResults]: [string, any]) => {
      csvContent += `Kategoria: ${category}\n`
      csvContent += "Miejsce,Drużyna,Punkty karne\n"
      
      categoryResults.forEach((result: any, index: number) => {
        csvContent += `${index + 1},${result.team},${result.penalty_points}\n`
      })
      
      csvContent += "\n"
    })
    
    // Utwórz link do pobrania
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `wyniki_${event.name.replace(/\s+/g, '_')}_${event.date}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [eventData, setEventData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [latestEvents, setLatestEvents] = useState<EventData[]>([])
  const [resultsData, setResultsData] = useState<{[key: number]: any}>({})
  const [resultsLoading, setResultsLoading] = useState(true)

  // Load event data from API
  useEffect(() => {
    const loadEventData = async () => {
      const result = await fetchWithFallback('/events', [fallbackEventData])
      
      if (result.data && result.data.length > 0) {
        setEventData(result.data[0])
        setLatestEvents(result.data)
      } else {
        setEventData(fallbackEventData)
        setLatestEvents([fallbackEventData])
      }
      
      if (result.isFallback) {
        console.warn("Using fallback data for events:", result.error)
      }
      
      setLoading(false)
    }

    loadEventData()
  }, [])

  // Load results data for latest events
  useEffect(() => {
    const loadResultsData = async () => {
      if (latestEvents.length === 0) return

      const resultsPromises = latestEvents.map(async (event) => {
        const result = await fetchWithFallback(`/results/${event.id}`, fallbackResultsData)
        return { eventId: event.id, results: result.data }
      })

      const results = await Promise.all(resultsPromises)
      const resultsMap: {[key: number]: any} = {}
      results.forEach(({ eventId, results }) => {
        resultsMap[eventId] = results
      })
      setResultsData(resultsMap)
      setResultsLoading(false)
    }

    loadResultsData()
  }, [latestEvents])



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t("common.error")}</p>
          <p className="text-gray-600 text-sm">Nie można załadować danych wydarzeń</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Odśwież stronę
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-green-600">
              INO 🧭
            </Link>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('upcoming-events')} 
                className="text-gray-700 hover:text-green-600"
              >
                Wydarzenia
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-gray-700 hover:text-green-600"
              >
                O INO
              </button>
              <button 
                onClick={() => scrollToSection('registration')} 
                className="text-gray-700 hover:text-green-600"
              >
                Rejestracja
              </button>
              <button 
                onClick={() => scrollToSection('starting-info')} 
                className="text-gray-700 hover:text-green-600"
              >
                Informacje startowe
              </button>
              <button 
                onClick={() => scrollToSection('results')} 
                className="text-gray-700 hover:text-green-600"
              >
                Wyniki
              </button>
              <button 
                onClick={() => scrollToSection('rules')} 
                className="text-gray-700 hover:text-green-600"
              >
                Zasady
              </button>
              <button 
                onClick={() => scrollToSection('archive')} 
                className="text-gray-700 hover:text-green-600"
              >
                Archiwum
              </button>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/login'}
              >
                Logowanie
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/photos/main2.jpg"
            alt="Główne zdjęcie orienteering - przygoda w naturze"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{t("hero.title")}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">{t("hero.subtitle")}</p>
          <RegistrationButton
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
          >
            <Compass className="mr-2 h-5 w-5" />
            {t("hero.cta")}
          </RegistrationButton>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section id="upcoming-events" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("upcomingEvents.title")}</h2>
            <p className="text-xl text-gray-600">{t("upcomingEvents.subtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              <div className="md:flex">
                <div className="md:w-1/2 md:ml-4">
                  <Image
                    src="/photos/nadchodzace.jpg"
                    alt={eventData.name}
                    width={400}
                    height={250}
                    className="w-full h-64 md:h-full object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl text-gray-900">{eventData.name}</CardTitle>
                    <CardDescription className="flex items-center text-gray-600 mt-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      {eventData.date}
                      <MapPin className="ml-4 mr-2 h-4 w-4" />
                      {eventData.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {eventData.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {eventData.fee && (
                    <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">{t("upcomingEvents.pricing")}</span>
                        <div className="font-semibold text-green-700">
                            {eventData.fee} zł
                        </div>
                      </div>
                    </div>
                    )}

                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Start: {eventData.start_time}</span>
                    </div>

                    <RegistrationButton
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {t("upcomingEvents.detailsRegistration")}
                    </RegistrationButton>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About INO Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("about.title")}</h2>
            <p className="text-xl text-gray-600">{t("about.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="mb-4">{t("about.whatIsIno")}</CardTitle>
              <CardContent className="p-0">
                <p className="text-gray-600">{t("about.whatIsInoDesc")}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="mb-4">{t("about.howItWorks")}</CardTitle>
              <CardContent className="p-0">
                <p className="text-gray-600">{t("about.howItWorksDesc")}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="mb-4">{t("about.whyJoin")}</CardTitle>
              <CardContent className="p-0">
                <p className="text-gray-600">{t("about.whyJoinDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Summary Panel */}
      <section className="py-8 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <Users className="h-8 w-8" />
            <div className="text-center">
              <div className="text-3xl font-bold">{eventData.registered_participants.toLocaleString()}</div>
              <div className="text-green-100">{t("registrationSummary.peopleSignedUp")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Starting Communication Section */}
      <section id="starting-info" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-none">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("startingInfo.title")}</h2>
            <p className="text-xl text-gray-600">{t("startingInfo.subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Map Section */}
            <div>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    {t("startingInfo.startingLocation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {eventData.google_maps_url && (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <a 
                        href={eventData.google_maps_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Zobacz lokalizację na Google Maps →
                      </a>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50">
                    <p className="font-semibold">{eventData.location}</p>
                    <p className="text-gray-600">Punkt startowy</p>
                    {eventData.start_point_url && (
                      <a 
                        href={eventData.start_point_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:text-green-700"
                      >
                        Szczegóły punktu startowego →
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    {t("startingInfo.dateTime")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{eventData.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        Start wydarzenia: {eventData.start_time}
                      </span>
                    </div>
                    {eventData.registration_deadline && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                          Deadline rejestracji: {eventData.registration_deadline}
                      </span>
                    </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-green-600" />
                    Kategorie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {eventData.categories.map((category, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
                      </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("rules.title")}</h2>
            <p className="text-xl text-gray-600">{t("rules.subtitle")}</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Karta startowa
                  </CardTitle>
                <CardDescription>
                  Zasady jak wypełnić kartę startową
                </CardDescription>
                </CardHeader>
              <CardContent className="p-0">
                <div className="h-[800px] w-full">
                  <iframe
                    src="/data/karta-startowa-1.pdf"
                    className="w-full h-full border-0"
                    title="Karta startowa PDF"
                  />
                    </div>
                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Instrukcja PDF - możesz ją pobrać i wydrukować
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.open('/data/karta-startowa-1.pdf', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Pobierz PDF
                    </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </section>



      {/* Registration Section */}
      <section id="registration" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t("registration.title")}</h2>
            <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">{t("registration.howToRegister")}</h3>
              <ol className="text-left space-y-2 text-gray-700">
                <li>1. Kliknij przycisk "Zarejestruj się teraz" poniżej</li>
                <li>2. Wypełnij formularz rejestracyjny w Google Sheets</li>
                <li>3. Opłata pobierana jest na miejscu podczas wydarzenia</li>
              </ol>
            </div>
            <div className="flex justify-center">
              <RegistrationButton
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Compass className="mr-2 h-5 w-5" />
                {t("registration.registerNow")}
              </RegistrationButton>

            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("results.title")}</h2>
            <p className="text-xl text-gray-600">{t("results.subtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {resultsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Ładowanie wyników...</p>
              </div>
            ) : latestEvents.length > 0 ? (
              <Tabs defaultValue={`event-${latestEvents[0].id}`} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {latestEvents.slice(0, 3).map((event) => {
                    const eventDate = new Date(event.date)
                    const formattedDate = eventDate.toLocaleDateString('pl-PL', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })
                    return (
                      <TabsTrigger key={event.id} value={`event-${event.id}`}>
                        {formattedDate}
                      </TabsTrigger>
                    )
                  })}
              </TabsList>

                {latestEvents.slice(0, 3).map((event) => {
                  const eventDate = new Date(event.date)
                  const formattedDate = eventDate.toLocaleDateString('pl-PL', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })
                  const results = resultsData[event.id]
                  
                  return (
                    <TabsContent key={event.id} value={`event-${event.id}`} className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                            {event.name} - Wyniki
                    </CardTitle>
                          <CardDescription>
                            {formattedDate} w {event.location}
                          </CardDescription>
                  </CardHeader>
                  <CardContent>
                          {!results || Object.keys(results).length === 0 ? (
                            <div className="text-center py-8">
                              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-gray-500 text-lg">Wyniki jeszcze nieopublikowane</p>
                              <p className="text-gray-400 text-sm mt-2">Sprawdź ponownie później</p>
                        </div>
                          ) : (
                            <div className="space-y-6">
                              {Object.entries(results).map(([category, categoryResults]: [string, any]) => (
                                <div key={category} className="border rounded-lg p-4">
                                  <h3 className="font-bold text-lg mb-4 text-green-700">{category}</h3>
                                  <div className="space-y-2">
                                    {categoryResults.map((result: any, index: number) => (
                                      <div 
                                        key={result.id} 
                                        className={`flex justify-between items-center p-3 rounded-lg ${
                                          index === 0 ? 'bg-yellow-50' : 
                                          index === 1 ? 'bg-gray-50' : 
                                          index === 2 ? 'bg-orange-50' : 'bg-blue-50'
                                        }`}
                                      >
                        <div className="flex items-center gap-4">
                                          <Badge 
                                            className={
                                              index === 0 ? 'bg-yellow-500' : 
                                              index === 1 ? 'bg-gray-500' : 
                                              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                            }
                                          >
                                            {index + 1}
                                          </Badge>
                                          <span className="font-semibold">{result.team}</span>
                        </div>
                                        <span className="text-gray-600">{result.penalty_points} pkt</span>
                      </div>
                                    ))}
                        </div>
                      </div>
                              ))}
                    </div>
                          )}
                          
                          <div className="mt-6">
                            <Button 
                              variant="outline" 
                              className="flex items-center gap-2 bg-transparent"
                              onClick={() => {
                                if (results && Object.keys(results).length > 0) {
                                  downloadResultsAsCSV(event, results)
                                }
                              }}
                              disabled={!results || Object.keys(results).length === 0}
                            >
                        <Download className="h-4 w-4" />
                        {t("results.downloadResults")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
                  )
                })}
            </Tabs>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Brak wydarzeń do wyświetlenia</p>
                <p className="text-gray-400 text-sm mt-2">Sprawdź połączenie z API</p>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Archive Carousel Section */}
      <section id="archive" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("archive.title")}</h2>
            <p className="text-xl text-gray-600">{t("archive.subtitle")}</p>
          </div>

          <ArchiveCarousel />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Contact Info */}
            {/* <div>
              <h3 className="text-xl font-bold mb-4">{t("footer.contactUs")}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+48 123 456 789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@ino-orienteering.pl</span>
                </div>
              </div>
            </div> */}

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t("footer.quickLinks")}</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('upcoming-events')} 
                    className="hover:text-green-400 text-left"
                  >
                    {t("footer.events")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('results')} 
                    className="hover:text-green-400 text-left"
                  >
                    {t("footer.results")}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="hover:text-green-400 text-left"
                  >
                    {t("footer.about")}
                  </button>
                </li>
                <li>
                  <RegistrationButton variant="link" className="hover:text-green-400 p-0 h-auto">
                    {t("footer.register")}
                  </RegistrationButton>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t("footer.followUs")}</h3>
              <div className="flex gap-4">
                <Link 
                  href="https://www.facebook.com/lesnaszkolka/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link 
                  href="https://www.instagram.com/lesnaszkolka/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Official Website */}
            <div>
              <h3 className="text-xl font-bold mb-4">Oficjalna strona</h3>
              <p className="text-gray-400 mb-4">Odwiedź oficjalną stronę organizacji Leśna Szkółka</p>
              <div className="flex gap-2">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('https://lesnaszkolka.org', '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  lesnaszkolka.org
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
