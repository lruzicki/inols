'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Wystąpił błąd
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Na razie serwis jest niedostępny, pracujemy nad tym, aby wrócił jak najszybciej! Przepraszamy!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={reset} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Spróbuj ponownie
            </Button>
            <Button onClick={() => window.location.href = '/'} className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Strona główna
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 