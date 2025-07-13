"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Jeśli użytkownik jest już zalogowany, przekieruj do dashboard
    if (session && status === "authenticated") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  const handleSignIn = () => {
    signIn("azure-ad", { callbackUrl: "/dashboard" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Logowanie</CardTitle>
          <CardDescription>
            Zaloguj się do panelu administracyjnego INO przez Microsoft 365
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-[#0078d4] text-white py-3 px-4 rounded-md hover:bg-[#106ebe] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
              <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
            Zaloguj przez Microsoft 365
          </Button>

          <div className="text-center text-sm text-gray-500">
            Dostęp tylko dla członków organizacji
          </div>
          
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Powrót na główną
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 