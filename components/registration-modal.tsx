"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Plus, Users, User, Calendar, MapPin, CheckCircle } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  age: string
  category: string
}

interface Event {
  id: number
  name: string
  date: string
  location: string
  price: {
    general: number
    scouts: number
  }
}

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
}

export default function RegistrationModal({ isOpen, onClose, event }: RegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [contactName, setContactName] = useState("")
  const [teamName, setTeamName] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ id: "1", name: "", age: "", category: "general" }])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTeamMember = () => {
    if (teamMembers.length < 6) {
      setTeamMembers([
        ...teamMembers,
        {
          id: Date.now().toString(),
          name: "",
          age: "",
          category: "general",
        },
      ])
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
    if (!event) return 0
    return teamMembers.reduce((total, member) => {
      return total + (member.category === "scout" ? event.price.scouts : event.price.general)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Registration submitted:", {
      event: event?.name,
      email,
      contactName,
      teamName,
      teamMembers,
      notes,
      total: calculateTotal(),
    })

    setStep(3) // Success step
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setStep(1)
    setEmail("")
    setContactName("")
    setTeamName("")
    setTeamMembers([{ id: "1", name: "", age: "", category: "general" }])
    setNotes("")
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Registration for {event.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {event.date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">Please provide your contact details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Your Name *</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name (Optional)</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Forest Explorers"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!email || !contactName}
                className="bg-green-600 hover:bg-green-700"
              >
                Next: Team Members
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Team Members */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Team Members</h3>
              <p className="text-gray-600">Add up to 6 team members</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Team Members</Label>
                <Badge variant="secondary">{teamMembers.length}/6 people</Badge>
              </div>

              {teamMembers.map((member, index) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Person {index + 1}
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
                      <Label htmlFor={`name-${member.id}`}>Full Name *</Label>
                      <Input
                        id={`name-${member.id}`}
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`age-${member.id}`}>Age</Label>
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
                    <Label htmlFor={`category-${member.id}`}>Category</Label>
                    <Select
                      value={member.category}
                      onValueChange={(value) => updateTeamMember(member.id, "category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General ({event.price.general}zł)</SelectItem>
                        <SelectItem value="scout">Scout/Under 16 ({event.price.scouts}zł)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              ))}

              {teamMembers.length < 6 && (
                <Button type="button" variant="outline" onClick={addTeamMember} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary requirements, special needs, etc."
                rows={3}
              />
            </div>

            {/* Price Summary */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Cost:</span>
                  <span className="text-2xl font-bold text-green-600">{calculateTotal()}zł</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Payment collected on-site</p>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                Back
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || teamMembers.some((member) => !member.name)}
              >
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for registering for {event.name}. We've sent a confirmation email to {email}.
              </p>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2">Registration Summary</h4>
                <div className="text-left space-y-1 text-sm">
                  <p>
                    <strong>Contact:</strong> {contactName} ({email})
                  </p>
                  {teamName && (
                    <p>
                      <strong>Team:</strong> {teamName}
                    </p>
                  )}
                  <p>
                    <strong>Members:</strong> {teamMembers.length} people
                  </p>
                  <p>
                    <strong>Total Cost:</strong> {calculateTotal()}zł
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• Check your email for detailed event information</li>
                <li>• Prepare required equipment (compass, pen, charged phone)</li>
                <li>• Arrive at the venue 30 minutes before start time</li>
                <li>• Payment will be collected on-site</li>
              </ul>
            </div>

            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
