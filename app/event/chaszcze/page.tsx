"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import RegistrationButton from "@/components/registration-button"
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  Compass,
  Mail,
  CheckCircle,
  AlertCircle,
  Navigation,
  Pencil,
  Smartphone,
  Smile,
} from "lucide-react"

export default function ChaszczeEventPage() {
  const [participantCount] = useState(247)

  const routes = [
    {
      id: "tsz",
      name: "TSZ – szkoleniowa",
      level: "Początkujący",
      description:
        "Trasa przeznaczona dla osób rozpoczynających przygodę z orientacją. Punkty kontrolne znajdują się przy wyraźnych elementach terenu, mapa w skali 1:10000.",
      teamSize: "1-6 osób",
      distance: "2-3 km",
      timeLimit: "2 godziny",
      mapType: "Uproszczona mapa, wyraźne punkty orientacyjne",
    },
    {
      id: "tt",
      name: "TT – niezaawansowani",
      level: "Łatwy",
      description:
        "Trasa dla osób z podstawową znajomością orientacji. Wymaga umiejętności czytania mapy i posługiwania się kompasem.",
      teamSize: "1-6 osób",
      distance: "3-4 km",
      timeLimit: "2.5 godziny",
      mapType: "Standardowa mapa 1:10000",
    },
    {
      id: "tu",
      name: "TU – średnio zaawansowani",
      level: "Średni",
      description:
        "Trasa wymagająca dobrej znajomości technik orientacyjnych. Punkty kontrolne w trudniejszych miejscach terenu.",
      teamSize: "1-6 osób",
      distance: "4-6 km",
      timeLimit: "3 godziny",
      mapType: "Szczegółowa mapa 1:7500",
    },
    {
      id: "tz",
      name: "TZ – zaawansowani",
      level: "Trudny",
      description:
        "Najtrudniejsza trasa dla doświadczonych orientowców. Wymaga zaawansowanych umiejętności nawigacyjnych i dobrej kondycji fizycznej.",
      teamSize: "1-6 osób",
      distance: "6-8 km",
      timeLimit: "4 godziny",
      mapType: "Profesjonalna mapa 1:5000",
    },
  ]

  const organizers = [
    { name: "phm. Jakub Miler", role: "Główny organizator" },
    { name: "pwd. Weronika Chaniewska", role: "Koordynator tras" },
    { name: "pwd. Zuzanna Chaniewska", role: "Obsługa uczestników" },
    { name: "pwd. Natalia Machulska", role: "Logistyka" },
  ]

  const includedServices = [
    "Komplet map i materiałów",
    "Karty kontrolne",
    "Przekąski na mecie",
    "Naklejki pamiątkowe",
    "Potwierdzenie startu w książeczce OInO",
  ]

  const requiredEquipment = [
    { name: "Kompas", icon: Compass },
    { name: "Długopis", icon: Pencil },
    { name: "Naładowany telefon", icon: Smartphone },
    { name: "Dobry humor", icon: Smile },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-green-600">
              INO 🧭
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/o-nas" className="text-gray-700 hover:text-green-600">
                O NAS
              </Link>
              <Link href="/druzyny" className="text-gray-700 hover:text-green-600">
                DRUŻYNY
              </Link>
              <Link href="/galeria" className="text-gray-700 hover:text-green-600">
                GALERIA
              </Link>
              <Link href="/kontakt" className="text-gray-700 hover:text-green-600">
                KONTAKT
              </Link>
              <Link href="/dokumenty" className="text-gray-700 hover:text-green-600">
                DOKUMENTY
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">36. edycja Imprezy na Orientację "Chaszcze"</h1>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-orange-500 text-white">
            Edycja zakończona, zapraszamy w przyszłym roku
          </Badge>
        </div>
      </section>

      {/* Event Info */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Termin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Sobota, godziny poranne</p>
                <p className="text-2xl font-bold text-green-600">20.04.2024r.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Miejsce
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Gdynia Wielki Kack – Źródło Marii</p>
                <p className="text-gray-600">FF5M+2Q Gdynia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Harmonogram imprezy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">9:00</div>
                  <div>
                    <p className="font-semibold">Godzina zero wszystkich tras</p>
                    <p className="text-gray-600">Start dla wszystkich kategorii</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">16:00</div>
                  <div>
                    <p className="font-semibold">Zamknięcie mety</p>
                    <p className="text-gray-600">Koniec przyjmowania wyników</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Limity czasowe poszczególnych tras znajdują się przy ich opisie.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Routes */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trasy</h2>
            <p className="text-xl text-gray-600">Wybierz trasę odpowiednią do swojego poziomu</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {routes.map((route) => (
                <AccordionItem key={route.id} value={route.id}>
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              route.level === "Trudny"
                                ? "destructive"
                                : route.level === "Średni"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {route.level}
                          </Badge>
                          <h3 className="text-xl font-semibold text-left">{route.name}</h3>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0">
                        <p className="text-gray-700 mb-6">{route.description}</p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Wielkość drużyny:</span>
                              <span>{route.teamSize}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Navigation className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Dystans:</span>
                              <span>{route.distance}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Limit czasu:</span>
                              <span>{route.timeLimit}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Mapa:</span>
                              <span className="text-sm">{route.mapType}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Scoring Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                Punktacja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Trasy są punktowane zgodnie z Zasadami punktacji Otwartych Imprez na Orientację.
              </p>
              <p className="font-semibold text-blue-700">
                TT, TU, TZ kwalifikują się do Pucharu Pomorza Gdańskiego KInO.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fees */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Opłaty startowe</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-green-600 mb-2">20zł</div>
                <p className="text-lg font-semibold">Kategoria ogólna</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">5zł</div>
                <p className="text-lg font-semibold">Harcerze i poniżej 16 lat</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 mt-6">Opłata pobierana na miejscu</p>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Rejestracja</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-xl">
                <span className="font-bold text-green-600">{participantCount}</span> osób już zapisanych!
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 mb-8 shadow-sm text-center">
              <h3 className="text-xl font-semibold mb-4">Zarejestruj się na wydarzenie</h3>
              <p className="text-gray-600 mb-6">
                Kliknij poniższy przycisk, aby przejść do formularza rejestracyjnego w Google Sheets.
              </p>
              <RegistrationButton size="lg" className="bg-green-600 hover:bg-green-700">
                Zarejestruj się teraz
              </RegistrationButton>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing Team */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Zespół organizacyjny</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {organizers.map((organizer, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{organizer.name}</h3>
                  <p className="text-sm text-gray-600">{organizer.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Świadczenia startowe</h2>
              <div className="space-y-3">
                {includedServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Wymagane wyposażenie</h2>
              <div className="grid grid-cols-2 gap-4">
                {requiredEquipment.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className="h-6 w-6 text-green-600" />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Kontakt</h3>
              <div className="space-y-2">
                <p>ul. Stryjska 24, 81-506 Gdynia</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>komenda@lesnaszkolka.org</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Linki</h3>
              <Link href="#" className="block text-gray-300 hover:text-white mb-2">
                Nasza strona na Wikipedii
              </Link>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Organizator</h3>
              <p className="text-gray-300">Leśna Szkółka</p>
              <p className="text-gray-300">Komenda Hufca ZHP Gdynia</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 INO - Impreza na Orientację. Wszystkie prawa zastrzeżone.</p>
            <Button variant="link" className="text-gray-400 hover:text-white mt-2">
              Ustawienia cookies
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
