"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "./providers"

export default function HomePage() {
  const router = useRouter()
  const {
    state: { userName, whatsappNumber },
  } = useSession()

  useEffect(() => {
    // If user info is already provided, go to layouts
    // Otherwise, go to welcome page
    if (userName && whatsappNumber) {
      router.replace("/layouts")
    } else {
      router.replace("/welcome")
    }
  }, [userName, whatsappNumber, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
    </div>
  )
}
