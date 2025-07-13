"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar, 
  Trophy, 
  LogOut, 
  Plus,
  List,
  Edit,
  BarChart3
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">INO Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Witaj, {session.user?.name}</span>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Wyloguj
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zarządzanie wydarzeniami */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Wydarzenia
              </CardTitle>
              <CardDescription>
                Zarządzaj wydarzeniami i imprezami
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/dashboard/events/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Nowe wydarzenie
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/events")}>
                <List className="h-4 w-4 mr-2" />
                Lista wydarzeń
              </Button>
            </CardContent>
          </Card>

          {/* Zarządzanie wynikami */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Wyniki
              </CardTitle>
              <CardDescription>
                Dodawaj i edytuj wyniki zawodów
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/dashboard/results")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Zarządzaj wynikami
              </Button>
            </CardContent>
          </Card>


        </div>
      </main>
    </div>
  )
} 