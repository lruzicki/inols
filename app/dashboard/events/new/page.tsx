"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Save, 
  X,
  Plus
} from "lucide-react"

interface Event {
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
}

export default function NewEventPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  
  // Debug: sprawdź sesję przy załadowaniu
  useEffect(() => {
    console.log("Current session:", session)
    if (session) {
      console.log("User roles:", (session as any)?.user?.roles)
    }
  }, [session])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      console.log("Session:", session)
      console.log("Access token:", (session as any)?.accessToken)
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      
      if (session && (session as any).accessToken) {
        headers["Authorization"] = `Bearer ${(session as any).accessToken}`
        console.log("Authorization header set")
      } else {
        console.log("No access token found in session")
      }
      
      console.log("Request headers:", headers)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/events`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status)
      
      if (response.ok) {
        router.push("/dashboard/events")
      } else {
        const errorText = await response.text()
        console.error("Błąd podczas tworzenia wydarzenia:", response.status, errorText)
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia wydarzenia:", error)
    } finally {
      setIsLoading(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Nowe wydarzenie</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Dodaj nowe wydarzenie</CardTitle>
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
                  <Label htmlFor="google_maps_url">URL Google Maps</Label>
                  <Input
                    id="google_maps_url"
                    type="url"
                    value={formData.google_maps_url}
                    onChange={(e) => setFormData({...formData, google_maps_url: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_drive_url">URL Google Drive</Label>
                  <Input
                    id="google_drive_url"
                    type="url"
                    value={formData.google_drive_url}
                    onChange={(e) => setFormData({...formData, google_drive_url: e.target.value})}
                  />
                </div>
              </div>

              {/* Kategorie */}
              <div className="space-y-4">
                <Label>Kategorie</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Skrót (max 3 znaki)"
                    maxLength={3}
                    className="w-32"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  />
                  <Button type="button" onClick={addCategory} variant="outline" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Zapisywanie..." : "Zapisz wydarzenie"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Anuluj
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 