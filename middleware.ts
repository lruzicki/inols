import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Dodatkowa logika middleware (opcjonalnie)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Sprawdza czy użytkownik jest zalogowany
    },
    pages: {
      signIn: "/login", // Strona przekierowania dla niezalogowanych
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*"], // Chronione ścieżki
} 