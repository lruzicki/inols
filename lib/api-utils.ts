// Utility functions for API calls with fallbacks

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  isFallback: boolean
}

export async function fetchWithFallback<T>(
  url: string, 
  fallbackData: T,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`
    console.log("Fetching from:", apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
    
    if (response.ok) {
      const data = await response.json()
      return { data, error: null, isFallback: false }
    } else {
      console.error("API response not ok:", response.status, response.statusText)
      return { data: fallbackData, error: `HTTP ${response.status}`, isFallback: true }
    }
  } catch (error) {
    console.error("API fetch error:", error)
    return { data: fallbackData, error: error instanceof Error ? error.message : 'Unknown error', isFallback: true }
  }
}

export async function fetchWithAuth<T>(
  url: string,
  accessToken: string,
  fallbackData: T,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${url}`
    console.log("Fetching with auth from:", apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options?.headers,
      },
      ...options,
    })
    
    if (response.ok) {
      const data = await response.json()
      return { data, error: null, isFallback: false }
    } else {
      console.error("API response not ok:", response.status, response.statusText)
      return { data: fallbackData, error: `HTTP ${response.status}`, isFallback: true }
    }
  } catch (error) {
    console.error("API fetch error:", error)
    return { data: fallbackData, error: error instanceof Error ? error.message : 'Unknown error', isFallback: true }
  }
}

// Fallback data for events
export const fallbackEventData = {
  id: 1,
  name: "Przykładowe wydarzenie",
  date: "2024-01-01",
  categories: ["Open", "Junior"],
  location: "Las miejski",
  start_point_url: "#",
  start_time: "10:00",
  fee: 20,
  registration_deadline: "2023-12-31",
  registered_participants: 50,
  google_maps_url: "#",
  google_drive_url: "#",
  deleted: false,
  created_at: "2024-01-01",
  updated_at: "2024-01-01"
}

// Fallback data for results
export const fallbackResultsData = {
  "Open": [
    {
      id: 1,
      event_id: 1,
      category: "Open",
      team: "Przykładowy zespół",
      penalty_points: 0,
      deleted: false,
      created_at: "2024-01-01 10:00:00",
      updated_at: "2024-01-01 10:00:00"
    }
  ]
} 