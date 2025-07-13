"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Calendar,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react"

interface Event {
  id?: number
  name: string
  date: string
  categories: string[]
  location: string
  start_point_url: string
  start_time: string
  fee?: number
  registration_deadline?: string
  registered_participants?: number
  google_maps_url?: string
  google_drive_url?: string
  deleted?: boolean
}

export default function EventsPage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Event>({
    name: "",
    date: "",
    categories: [],
    location: "",
    start_point_url: "",
    start_time: "",
    fee: undefined,
    registration_deadline: "",
    registered_participants: 0,
    google_maps_url: "",
    google_drive_url: ""
  })
  const [newCategory, setNewCategory] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events/all`, {
        headers
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Błąd podczas pobierania wydarzeń:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingEvent 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events/${editingEvent.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events`
      
      const method = editingEvent ? "PUT" : "POST"
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingEvent(null)
        resetForm()
        fetchEvents()
      } else {
        console.error("Błąd podczas zapisywania wydarzenia")
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania wydarzenia:", error)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      name: event.name,
      date: event.date,
      categories: event.categories,
      location: event.location,
      start_point_url: event.start_point_url,
      start_time: event.start_time,
      fee: event.fee,
      registration_deadline: event.registration_deadline || "",
      registered_participants: event.registered_participants || 0,
      google_maps_url: event.google_maps_url || "",
      google_drive_url: event.google_drive_url || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm("Czy na pewno chcesz usunąć to wydarzenie?")) return

    try {
      const headers: HeadersInit = {}
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events/${eventId}`, {
        method: "DELETE",
        headers,
      })

      if (response.ok) {
        fetchEvents()
      }
    } catch (error) {
      console.error("Błąd podczas usuwania wydarzenia:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      categories: [],
      location: "",
      start_point_url: "",
      start_time: "",
      fee: undefined,
      registration_deadline: "",
      registered_participants: 0,
      google_maps_url: "",
      google_drive_url: ""
    })
    setNewCategory("")
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()]
      })
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    })
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Zarządzanie wydarzeniami</h1>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj wydarzenie
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingEvent ? "Edytuj wydarzenie" : "Dodaj nowe wydarzenie"}
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowForm(false)
                  setEditingEvent(null)
                  resetForm()
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nazwa wydarzenia *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data wydarzenia *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Lokalizacja *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_time">Godzina startu *</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_point_url">URL punktu startowego *</Label>
                    <Input
                      id="start_point_url"
                      type="url"
                      value={formData.start_point_url}
                      onChange={(e) => setFormData({...formData, start_point_url: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fee">Opłata (zł)</Label>
                    <Input
                      id="fee"
                      type="number"
                      step="0.01"
                      value={formData.fee || ""}
                      onChange={(e) => setFormData({...formData, fee: e.target.value ? parseFloat(e.target.value) : undefined})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_deadline">Deadline rejestracji</Label>
                    <Input
                      id="registration_deadline"
                      type="date"
                      value={formData.registration_deadline}
                      onChange={(e) => setFormData({...formData, registration_deadline: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registered_participants">Liczba zarejestrowanych</Label>
                    <Input
                      id="registered_participants"
                      type="number"
                      min="0"
                      value={formData.registered_participants || ""}
                      onChange={(e) => setFormData({...formData, registered_participants: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google_maps_url">URL Google Maps</Label>
                    <Input
                      id="google_maps_url"
                      type="url"
                      placeholder="https://maps.app.goo.gl/..."
                      value={formData.google_maps_url}
                      onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google_drive_url">URL Google Drive</Label>
                    <Input
                      id="google_drive_url"
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={formData.google_drive_url}
                      onChange={(e) => setFormData({...formData, google_drive_url: e.target.value})}
                    />
                  </div>
                </div>

                {/* Kategorie */}
                <div className="space-y-2">
                  <Label>Kategorie</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Skrót (max 3 znaki)"
                      maxLength={3}
                      className="w-32"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                    />
                    <Button type="button" onClick={addCategory} variant="outline" size="sm">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingEvent ? "Zapisz zmiany" : "Dodaj wydarzenie"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
                    resetForm()
                  }}>
                    Anuluj
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                      <div className="flex gap-2">
                        {event.categories.map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.start_time}</span>
                      </div>
                      {event.fee && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{event.fee} zł</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edytuj
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => event.id && handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Usuń
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Brak wydarzeń. Dodaj pierwsze wydarzenie!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 