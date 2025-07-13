"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, ChevronDown } from "lucide-react"

const languages = [
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "en", name: "English", flag: "🇬🇧" },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // For App Router, we need to determine the current locale from the pathname
  // or use a default. You might want to implement a more sophisticated locale detection
  const getCurrentLocale = () => {
    // Check if the pathname starts with a locale
    const pathSegments = pathname.split('/')
    const firstSegment = pathSegments[1]
    
    if (languages.some(lang => lang.code === firstSegment)) {
      return firstSegment
    }
    
    return 'pl' // default locale
  }

  const currentLanguage = languages.find((lang) => lang.code === getCurrentLocale()) || languages[0]

  const handleLanguageChange = (locale: string) => {
    // For App Router, you need to implement locale switching based on your i18n setup
    // This is a basic implementation - you might need to adjust based on your specific setup
    
    // If the current path doesn't start with a locale, add it
    const pathSegments = pathname.split('/')
    const hasLocale = languages.some(lang => lang.code === pathSegments[1])
    
    let newPath
    if (hasLocale) {
      // Replace the current locale with the new one
      pathSegments[1] = locale
      newPath = pathSegments.join('/')
    } else {
      // Add the locale to the beginning
      newPath = `/${locale}${pathname}`
    }
    
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white">
          <Globe className="h-4 w-4 mr-2" />
          <span className="mr-1">{currentLanguage.flag}</span>
          <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${language.code === getCurrentLocale() ? "bg-green-50 text-green-700" : ""}`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
