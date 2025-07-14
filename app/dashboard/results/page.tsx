"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  Download,
  Upload,
  Trash2,
  Edit,
  X,
  Trophy,
  Users
} from "lucide-react"

interface Event {
  id: number
  name: string
  date: string
  categories: string[]
}

interface Result {
  id?: number
  event_id: number
  category: string
  team: string
  penalty_points: number
}

interface ResultsGrid {
  [category: string]: Result[]
}

export default function ResultsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [resultsGrid, setResultsGrid] = useState<ResultsGrid>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newResult, setNewResult] = useState<Result>({
    event_id: 0,
    category: "",
    team: "",
    penalty_points: 0
  })
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      fetchResults(selectedEvent)
    }
  }, [selectedEvent])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events/all`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
        if (data.length > 0) {
          setSelectedEvent(data[0].id)
        }
      } else {
        console.error("Błąd podczas pobierania wydarzeń:", response.status, response.statusText)
        setEvents([])
      }
    } catch (error) {
      console.error("Błąd podczas pobierania wydarzeń:", error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchResults = async (eventId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/results/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setResultsGrid(data)
      }
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error)
      setResultsGrid({})
    }
  }

  const handleSaveResults = async () => {
    if (!selectedEvent) return

    setIsSaving(true)
    try {
      // Przygotuj dane do wysłania - usuń puste wiersze
      const cleanResultsGrid: {[key: string]: any[]} = {}
      Object.entries(resultsGrid).forEach(([category, results]) => {
        const nonEmptyResults = results.filter(result => result.team.trim() !== '')
        if (nonEmptyResults.length > 0) {
          cleanResultsGrid[category] = nonEmptyResults
        }
      })

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      
      // Wyślij wszystkie wyniki na raz (nadpisze istniejące)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/results/${selectedEvent}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(cleanResultsGrid),
      })

      if (response.ok) {
        // Odśwież wyniki
        await fetchResults(selectedEvent)
      } else {
        console.error("Błąd podczas zapisywania wyników")
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania wyników:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addNewResult = async () => {
    if (!selectedEvent || !newResult.team.trim() || !newResult.category) return

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/results`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...newResult,
          event_id: selectedEvent
        }),
      })

      if (response.ok) {
        setNewResult({
          event_id: selectedEvent,
          category: "",
          team: "",
          penalty_points: 0
        })
        setShowAddForm(false)
        fetchResults(selectedEvent)
      }
    } catch (error) {
      console.error("Błąd podczas dodawania wyniku:", error)
    }
  }

  const deleteResult = async (resultId: number) => {
    try {
      const headers: HeadersInit = {}
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/results/${resultId}`, {
        method: "DELETE",
        headers,
      })

      if (response.ok) {
        fetchResults(selectedEvent!)
      }
    } catch (error) {
      console.error("Błąd podczas usuwania wyniku:", error)
    }
  }

  const updateGridCell = (category: string, rowIndex: number, field: keyof Result, value: any) => {
    setResultsGrid(prev => {
      const newGrid = { ...prev }
      if (newGrid[category] && newGrid[category][rowIndex]) {
        newGrid[category][rowIndex] = {
          ...newGrid[category][rowIndex],
          [field]: value
        }
      }
      return newGrid
    })
  }

  const addRowToCategory = (category: string) => {
    setResultsGrid(prev => ({
      ...prev,
      [category]: [
        ...(prev[category] || []),
        {
          event_id: selectedEvent!,
          category,
          team: "",
          penalty_points: 0
        }
      ]
    }))
  }

  const removeRowFromCategory = (category: string, rowIndex: number) => {
    setResultsGrid(prev => ({
      ...prev,
      [category]: prev[category].filter((_, index) => index !== rowIndex)
    }))
  }

  const getSelectedEvent = () => events.find(e => e.id === selectedEvent)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie wyników...</p>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Brak wydarzeń do wyświetlenia</p>
          <p className="text-gray-400 text-sm mb-4">Sprawdź połączenie z API lub dodaj nowe wydarzenie</p>
          <Button onClick={() => fetchEvents()} variant="outline">
            Odśwież
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Zarządzanie wynikami</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj wynik
              </Button>
              <Button onClick={handleSaveResults} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Zapisywanie..." : "Zapisz wszystkie"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Event Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Wybierz wydarzenie</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEvent?.toString()} onValueChange={(value) => setSelectedEvent(parseInt(value))}>
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder="Wybierz wydarzenie" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.name} - {event.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Add Result Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Dodaj nowy wynik
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Kategoria</Label>
                  <Select value={newResult.category} onValueChange={(value) => setNewResult({...newResult, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSelectedEvent()?.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Zespół</Label>
                  <Input
                    value={newResult.team}
                    onChange={(e) => setNewResult({...newResult, team: e.target.value})}
                    placeholder="Nazwa zespołu"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Punkty karne</Label>
                  <Input
                    type="number"
                    value={newResult.penalty_points}
                    onChange={(e) => setNewResult({...newResult, penalty_points: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addNewResult}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Anuluj
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {selectedEvent && (
          <div className="space-y-6">
            {Object.entries(resultsGrid).map(([category, results]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Kategoria: {category}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addRowToCategory(category)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj wiersz
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Zespół</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Punkty karne</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">
                              <Input
                                value={result.team}
                                onChange={(e) => updateGridCell(category, index, 'team', e.target.value)}
                                className="border-0 p-0 bg-transparent"
                                placeholder="Nazwa zespołu"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <Input
                                type="number"
                                value={result.penalty_points}
                                onChange={(e) => updateGridCell(category, index, 'penalty_points', parseInt(e.target.value) || 0)}
                                className="border-0 p-0 bg-transparent w-20"
                                placeholder="0"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex gap-2">
                                {result.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteResult(result.id!)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRowFromCategory(category, index)}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {results.length === 0 && (
                          <tr>
                            <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                              Brak wyników dla tej kategorii
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}

            {Object.keys(resultsGrid).length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Brak wyników dla tego wydarzenia. Dodaj pierwsze wyniki!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
} 