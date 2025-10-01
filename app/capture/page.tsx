"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Check, Loader2, RotateCcw } from "lucide-react"
import { StepIndicator } from "@/components/step-indicator"
import { LAYOUT_TEMPLATES } from "@/lib/layouts"
import { cn } from "@/lib/utils"
import { useSession } from "../providers"
import { useOrientation } from "@/hooks/use-orientation"
import { compressDataUrl } from "@/lib/image"

const Webcam = dynamic(() => import("react-webcam"), { ssr: false })

type WebcamInstance = {
  getScreenshot: () => string | null
}

export default function CapturePage() {
  const router = useRouter()
  const {
    state: { selectedLayoutId, photoDataUrl },
    actions: { storePhoto },
  } = useSession()
  const webcamRef = useRef<WebcamInstance | null>(null)
  const [preview, setPreview] = useState<string | undefined>(photoDataUrl)
  const [isSaving, setIsSaving] = useState(false)
  const [compressionError, setCompressionError] = useState<string | null>(null)
  const orientation = useOrientation()

  const videoConstraints = useMemo(
    () => ({
      facingMode: "user" as const,
      width: { ideal: orientation === "landscape" ? 1920 : 1280 },
      height: { ideal: orientation === "landscape" ? 1080 : 1440 },
    }),
    [orientation]
  )

  useEffect(() => {
    if (!selectedLayoutId) {
      router.replace("/")
    }
  }, [selectedLayoutId, router])

  const layout = LAYOUT_TEMPLATES.find((item) => item.id === selectedLayoutId)

  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (screenshot) {
      setPreview(screenshot)
      setCompressionError(null)
    }
  }

  const handleConfirm = async () => {
    if (!preview || isSaving) return
    setCompressionError(null)
    setIsSaving(true)
    try {
      const compressed = await compressDataUrl(preview, {
        maxWidth: orientation === "landscape" ? 1920 : 1440,
        maxHeight: orientation === "landscape" ? 1080 : 1920,
        quality: 0.82,
        mimeType: "image/jpeg",
      })
      storePhoto(compressed ?? preview)
      router.push("/generate")
    } catch (error) {
      console.error("Image compression failed", error)
      setCompressionError("We had trouble optimizing the photo. Sending original instead.")
      storePhoto(preview)
      router.push("/generate")
    } finally {
      setIsSaving(false)
    }
  }

  if (!layout) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-8 py-12">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <StepIndicator current={2} total={4} label="Capture" />
          <div className="text-right">
            <p className="text-sm text-slate-400">Layout</p>
            <p className="text-base font-medium text-white">{layout.name}</p>
          </div>
        </header>

        {orientation === "portrait" ? (
          <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-amber-200 sm:text-sm">
            Rotate your iPad to landscape for the widest camera preview. Portrait capture still works if you prefer this orientation.
          </div>
        ) : null}

        {compressionError ? (
          <div className="rounded-3xl border border-rose-400/60 bg-rose-500/20 px-4 py-3 text-sm text-rose-100">
            {compressionError}
          </div>
        ) : null}

        <main
          className={cn(
            "flex flex-1 gap-8",
            orientation === "landscape" ? "flex-col lg:flex-row" : "flex-col"
          )}
        >
          <section className="flex flex-1 flex-col gap-6">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-black/40 p-4">
              {preview ? (
                <Image
                  src={preview}
                  alt="Captured photo"
                  width={960}
                  height={720}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Webcam
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.82}
                  className="h-full w-full rounded-2xl object-cover"
                  videoConstraints={videoConstraints}
                  ref={(instance) => {
                    webcamRef.current = instance as unknown as WebcamInstance
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setPreview(undefined)
                  setCompressionError(null)
                }}
                disabled={!preview || isSaving}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
                  preview && !isSaving
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "cursor-not-allowed bg-white/5 text-slate-500"
                )}
              >
                <RotateCcw className="h-4 w-4" /> Retake
              </button>
              <button
                type="button"
                onClick={preview ? handleConfirm : handleCapture}
                disabled={isSaving}
                className={cn(
                  "inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-semibold transition",
                  preview
                    ? "bg-emerald-400 text-emerald-900 hover:bg-emerald-300"
                    : "bg-emerald-400 text-emerald-900 hover:bg-emerald-300",
                  isSaving ? "cursor-wait opacity-70" : ""
                )}
              >
                {preview ? (
                  isSaving ? (
                    <>
                      Saving <Loader2 className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Confirm <Check className="h-5 w-5" />
                    </>
                  )
                ) : (
                  <>
                    Capture <Camera className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </section>

          <aside className="flex w-full flex-col gap-6 md:w-72">
            <div className="rounded-3xl bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Capture tips</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Hold the iPad at eye level for flattering portraits.</li>
                <li>Ensure even lighting; avoid strong backlight.</li>
                <li>Leave headroom so the layout frame can breathe.</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white/5 p-6">
              <h3 className="text-sm font-medium uppercase tracking-wide text-slate-300">
                Layout preview
              </h3>
              <Image
                src={layout.preview}
                alt={`${layout.name} preview`}
                width={300}
                height={200}
                className="mt-3 w-full rounded-2xl"
              />
              <p className="mt-4 text-sm text-slate-300">{layout.description}</p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
