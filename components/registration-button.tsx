"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Users } from "lucide-react"

interface RegistrationButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  children?: React.ReactNode
  registrationUrl?: string
}

export default function RegistrationButton({ 
  className = "", 
  size = "default", 
  variant = "default",
  children,
  registrationUrl 
}: RegistrationButtonProps) {
  // Użyj przekazanego URL lub domyślnego
  const defaultRegistrationUrl = "https://docs.google.com/spreadsheets/d/13wAMcfu7gI0RtXIeh5yjQ6z1NV-lsTQlfCH18i23x0s/edit?gid=831341344#gid=831341344"
  const finalUrl = registrationUrl || defaultRegistrationUrl

  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={className}
    >
      <a 
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <Users className="h-4 w-4" />
        {children || "Zarejestruj się teraz"}
        <ExternalLink className="h-3 w-3" />
      </a>
    </Button>
  )
} 