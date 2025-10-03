"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Facebook, Instagram } from "lucide-react"
import { StepIndicator } from "@/components/step-indicator"
import { cn } from "@/lib/utils"
import { useSession } from "../providers"

const BACKGROUNDS = [
  { id: "bg-1", name: "Mountain", image: "/background/bg-1.png" },
  { id: "bg-2", name: "Beach", image: "/background/bg-2.png" },
  { id: "bg-3", name: "City Night", image: "/background/bg-3.png" },
  { id: "bg-4", name: "Lake", image: "/background/bg-4.png" },
]

export default function LayoutSelectionPage() {
  const router = useRouter()
  const {
    state: { userName, whatsappNumber, selectedPlatform, selectedBackground, socialHandle, caption },
    actions: { selectPlatform, selectBackground, setSocialDetails, reset },
  } = useSession()

  const [handle, setHandle] = useState(socialHandle || "")
  const [userCaption, setUserCaption] = useState(caption || "")

  useEffect(() => {
    if (!userName || !whatsappNumber) {
      router.replace("/welcome")
    }
  }, [userName, whatsappNumber, router])

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-8 py-12">
        <header className="flex flex-col gap-6">
          <StepIndicator current={1} total={4} label="Select Platform & Layout" />
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">Choose your platform</h1>
              <p className="mt-2 max-w-xl text-lg text-slate-500">
                First select your social media platform, then pick a layout template.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-slate-400 underline decoration-dotted underline-offset-4 hover:text-slate-600"
            >
              Reset session
            </button>
          </div>
        </header>

        {/* Social Media Platform Selection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Select Social Media</h2>
          <div className="grid grid-cols-2 gap-6 md:max-w-md">
            <button
              type="button"
              onClick={() => selectPlatform("facebook")}
              className={cn(
                "flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-8 transition hover:shadow-lg focus:outline-none focus:ring-4",
                selectedPlatform === "facebook"
                  ? "border-blue-600 focus:ring-blue-100"
                  : "border-slate-200 focus:ring-slate-100"
              )}
            >
              <Facebook className={cn(
                "h-16 w-16",
                selectedPlatform === "facebook" ? "text-blue-600" : "text-slate-400"
              )} />
              <span className={cn(
                "text-lg font-semibold",
                selectedPlatform === "facebook" ? "text-blue-600" : "text-slate-700"
              )}>
                Facebook
              </span>
            </button>

            <button
              type="button"
              onClick={() => selectPlatform("instagram")}
              className={cn(
                "flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-8 transition hover:shadow-lg focus:outline-none focus:ring-4",
                selectedPlatform === "instagram"
                  ? "border-blue-600 focus:ring-blue-100"
                  : "border-slate-200 focus:ring-slate-100"
              )}
            >
              <Instagram className={cn(
                "h-16 w-16",
                selectedPlatform === "instagram" ? "text-blue-600" : "text-slate-400"
              )} />
              <span className={cn(
                "text-lg font-semibold",
                selectedPlatform === "instagram" ? "text-blue-600" : "text-slate-700"
              )}>
                Instagram
              </span>
            </button>
          </div>
        </section>

        {/* Background Selection */}
        {selectedPlatform && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Select Background</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {BACKGROUNDS.map((bg) => {
                const isSelected = bg.id === selectedBackground
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => selectBackground(bg.id)}
                    className={cn(
                      "group flex flex-col gap-3 rounded-2xl border-2 bg-white p-4 transition hover:shadow-lg focus:outline-none focus:ring-4",
                      isSelected
                        ? "border-blue-600 focus:ring-blue-100"
                        : "border-slate-200 focus:ring-slate-100"
                    )}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <Image
                        src={bg.image}
                        alt={bg.name}
                        width={400}
                        height={300}
                        className="h-32 w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <span className={cn(
                      "text-base font-semibold",
                      isSelected ? "text-blue-600" : "text-slate-700"
                    )}>
                      {bg.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Social Details Form */}
        {selectedPlatform && selectedBackground && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Your Social Media Details</h2>
            <div className="max-w-md space-y-4">
              <div>
                <label htmlFor="handle" className="block text-sm font-medium text-slate-700">
                  {selectedPlatform === "facebook" ? "Facebook" : "Instagram"} Handle
                </label>
                <input
                  type="text"
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  placeholder={selectedPlatform === "facebook" ? "@yourfacebook" : "@yourinstagram"}
                />
              </div>
              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-slate-700">
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  value={userCaption}
                  onChange={(e) => setUserCaption(e.target.value)}
                  className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your caption"
                />
              </div>
            </div>
          </section>
        )}

        <footer className="sticky bottom-8 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSocialDetails(handle, userCaption)
              router.push("/capture")
            }}
            disabled={!selectedPlatform || !selectedBackground || !handle.trim() || !userCaption.trim()}
            className={cn(
              "inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-medium text-white transition",
              selectedPlatform && selectedBackground && handle.trim() && userCaption.trim()
                ? "bg-slate-900 hover:bg-slate-700"
                : "cursor-not-allowed bg-slate-300 text-slate-500"
            )}
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </footer>
      </div>
    </div>
  )
}
