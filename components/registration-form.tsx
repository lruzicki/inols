"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Users, Mail, User } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  age: string
  category: string
}

export default function RegistrationForm({ eventName = "Forest Challenge 2024", isActive = true }) {
  const [email, setEmail] = useState("")
  const [teamName, setTeamName] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ id: "1", name: "", age: "", category: "general" }])
  const [notes, setNotes] = useState("")

  const addTeamMember = () => {
    if (teamMembers.length < 6) {
      setTeamMembers([...teamMembers, { id: Date.now().toString(), name: "", age: "", category: "general" }])
    }
  }

  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id))
    }
  }

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const calculateTotal = () => {
    return teamMembers.reduce((total, member) => {
      return total + (member.category === "scout" ? 5 : 20)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration submitted:", {
      email,
      teamName,
      teamMembers,
      notes,
      total: calculateTotal(),
    })
    // Handle form submission
  }

  if (!isActive) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="text-gray-500 mb-4">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Formularz nieaktywny</h3>
            <p>Jeśli chcesz wystartować napisz do nas maila 😉</p>
          </div>
          <Button variant="outline" className="mt-4 bg-transparent">
            <Mail className="mr-2 h-4 w-4" />
            Skontaktuj się z nami
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          Rejestracja na {eventName}
        </CardTitle>
        <CardDescription>Wypełnij formularz, aby zarejestrować swoją drużynę (maksymalnie 6 osób)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email kontaktowy *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj.email@example.com"
              required
            />
          </div>

          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Nazwa drużyny (opcjonalnie)</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="np. Leśni Odkrywcy"
            />
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Członkowie drużyny</Label>
              <Badge variant="secondary">{teamMembers.length}/6 osób</Badge>
            </div>

            {teamMembers.map((member, index) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Osoba {index + 1}
                  </h4>
                  {teamMembers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Label htmlFor={`name-${member.id}`}>Imię i nazwisko *</Label>
                    <Input
                      id={`name-${member.id}`}
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                      placeholder="Jan Kowalski"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`age-${member.id}`}>Wiek</Label>
                    <Input
                      id={`age-${member.id}`}
                      type="number"
                      value={member.age}
                      onChange={(e) => updateTeamMember(member.id, "age", e.target.value)}
                      placeholder="25"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Label htmlFor={`category-${member.id}`}>Kategoria</Label>
                  <Select
                    value={member.category}
                    onValueChange={(value) => updateTeamMember(member.id, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Ogólna (20zł)</SelectItem>
                      <SelectItem value="scout">Harcerz/Poniżej 16 lat (5zł)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}

            {teamMembers.length < 6 && (
              <Button type="button" variant="outline" onClick={addTeamMember} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj członka drużyny
              </Button>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Dodatkowe uwagi</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dodatkowe informacje, wymagania dietetyczne, itp."
              rows={3}
            />
          </div>

          {/* Price Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Łączny koszt:</span>
                <span className="text-2xl font-bold text-green-600">{calculateTotal()}zł</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Opłata pobierana na miejscu</p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
            Zarejestruj drużynę
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
