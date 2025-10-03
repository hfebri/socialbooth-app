"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { LayoutCarousel } from "@/components/layout-carousel"
import { useSession } from "../providers"
import { cn } from "@/lib/utils"

export default function WelcomePage() {
  const router = useRouter()
  const {
    actions: { setUserInfo },
  } = useSession()

  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [errors, setErrors] = useState({ name: "", whatsapp: "" })

  const validateWhatsApp = (value: string) => {
    // Remove +62 prefix and spaces for validation
    const cleaned = value.replace(/^\+62\s*/, "").replace(/\s/g, "")
    // Check if it's a valid Indonesian phone number (8-12 digits after +62)
    return /^\d{8,12}$/.test(cleaned)
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // If user clears the input, reset to +62
    if (!value) {
      setWhatsapp("+62 ")
      return
    }

    // Ensure it always starts with +62
    if (!value.startsWith("+62")) {
      value = "+62 " + value.replace(/^\+?62?\s*/, "")
    }

    // Add space after +62 if not present
    if (value === "+62") {
      value = "+62 "
    }

    // Only allow numbers after +62 prefix
    const prefix = "+62 "
    const afterPrefix = value.slice(prefix.length)
    const numbersOnly = afterPrefix.replace(/\D/g, "")
    value = prefix + numbersOnly

    setWhatsapp(value)

    // Clear error when user types
    if (errors.whatsapp) {
      setErrors({ ...errors, whatsapp: "" })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = { name: "", whatsapp: "" }

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!whatsapp.trim() || whatsapp === "+62 ") {
      newErrors.whatsapp = "WhatsApp number is required"
    } else if (!validateWhatsApp(whatsapp)) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number"
    }

    setErrors(newErrors)

    if (!newErrors.name && !newErrors.whatsapp) {
      setUserInfo(name.trim(), whatsapp.trim())
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900">
              AI Photobooth
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Create stunning AI-powered photos in seconds
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    setErrors({ ...errors, name: "" })
                  }
                }}
                className={cn(
                  "mt-2 w-full rounded-2xl border-2 px-4 py-3 text-lg transition-colors focus:outline-none focus:ring-4",
                  errors.name
                    ? "border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-200 bg-white focus:border-slate-900 focus:ring-slate-100"
                )}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-rose-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700">
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="whatsapp"
                value={whatsapp}
                onChange={handleWhatsAppChange}
                onFocus={(e) => {
                  if (!e.target.value) {
                    setWhatsapp("+62 ")
                  }
                }}
                className={cn(
                  "mt-2 w-full rounded-2xl border-2 px-4 py-3 text-lg transition-colors focus:outline-none focus:ring-4",
                  errors.whatsapp
                    ? "border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-200 bg-white focus:border-slate-900 focus:ring-slate-100"
                )}
                placeholder="+62 812 3456 7890"
              />
              {errors.whatsapp && (
                <p className="mt-2 text-sm text-rose-600">{errors.whatsapp}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                We&apos;ll send your photo via WhatsApp
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="pb-12">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Choose from stunning layouts
          </h2>
          <p className="mt-2 text-slate-600">
            Our AI will blend your photo with these artistic templates
          </p>
        </div>
        <LayoutCarousel />
      </div>
    </div>
  )
}
